import type { Request, Response } from "express";
import { db } from "../db/pool.js";

export function getAdminTest(_request: Request, response: Response): void {
  response.status(200).json({ message: "Admin access granted" });
}

const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const successfulStatuses = [2, 3, 4, 5];
const lowStockThreshold = 10;

function clampRange(value: unknown): 7 | 30 | 90 {
  const parsed = Number(value);
  return parsed === 7 || parsed === 90 ? parsed : 30;
}

function tierExpression() {
  return `CASE
    WHEN COALESCE(order_stats.order_count, 0) >= 10 THEN 'VIP'
    WHEN COALESCE(order_stats.order_count, 0) > 1 THEN 'Returning'
    ELSE 'New'
  END`;
}

export async function getAdminDashboard(
  _request: Request,
  response: Response,
): Promise<void> {
  const [metrics, revenue, recentOrders, topProducts] = await Promise.all([
    db.query(
      `SELECT
        (SELECT COUNT(*)::int FROM users WHERE role = 2) AS customers,
        (SELECT COUNT(*)::int FROM products) AS products,
        (SELECT COUNT(*)::int FROM orders) AS orders,
        (SELECT COUNT(*)::int FROM orders WHERE status = 1) AS pending_orders,
        (SELECT COUNT(*)::int FROM orders WHERE status = 5) AS delivered_orders,
        (SELECT COUNT(*)::int FROM products WHERE stock_quantity > 0 AND stock_quantity <= $1) AS low_stock_products`,
      [lowStockThreshold],
    ),

    db.query(
      `SELECT COALESCE(SUM(total_amount_paise), 0)::bigint AS revenue_paise
       FROM orders
       WHERE status = ANY($1::smallint[])`,
      [successfulStatuses],
    ),

    db.query(
      `SELECT
         orders.id,
         orders.order_number,
         orders.total_amount_paise,
         orders.status,
         orders.shipping_city,
         orders.created_at,
         users.name AS customer_name,
         users.email AS customer_email,
         COALESCE(SUM(order_items.quantity), 0)::int AS item_count
       FROM orders
       INNER JOIN users ON users.id = orders.user_id
       LEFT JOIN order_items ON order_items.order_id = orders.id
       GROUP BY orders.id, users.name, users.email
       ORDER BY orders.created_at DESC
       LIMIT 6`,
    ),

    db.query(
      `SELECT
         order_items.product_id,
         order_items.product_name AS name,
         order_items.sku,
         SUM(order_items.quantity)::int AS quantity_sold,
         SUM(order_items.price_paise * order_items.quantity)::bigint AS revenue_paise
       FROM order_items
       INNER JOIN orders ON orders.id = order_items.order_id
       WHERE orders.status = ANY($1::smallint[])
         AND orders.created_at >= NOW() - INTERVAL '30 days'
       GROUP BY order_items.product_id, order_items.product_name, order_items.sku
       ORDER BY quantity_sold DESC, revenue_paise DESC
       LIMIT 5`,
      [successfulStatuses],
    ),
  ]);

  response.json({
    metrics: {
      ...metrics.rows[0],
      revenue_paise: revenue.rows[0]?.revenue_paise ?? "0",
    },

    recent_orders: recentOrders.rows,

    top_products: topProducts.rows,

    revenue_definition:
      "Statuses 2, 3, 4, and 5: PAID, PROCESSING, SHIPPED, DELIVERED.",
  });
}

export async function listAdminCustomers(
  request: Request,
  response: Response,
): Promise<void> {
  const search =
    typeof request.query.search === "string"
      ? request.query.search.trim().slice(0, 100)
      : "";

  const tier =
    typeof request.query.tier === "string" ? request.query.tier : "All";

  const values: unknown[] = [];
  const filters = ["users.role = 2"];

  if (search) {
    values.push(`%${search}%`);
    filters.push(
      `(users.name ILIKE $${values.length + 1} OR users.email ILIKE $${values.length + 1})`,
    );
  }

  const computedTier = tierExpression();

  if (tier === "VIP" || tier === "Returning" || tier === "New") {
    values.push(tier);
    filters.push(`${computedTier} = $${values.length + 1}`);
  }

  const result = await db.query(
    `WITH order_stats AS (
       SELECT
         user_id,
         COUNT(*)::int AS order_count,
         COALESCE(
           SUM(total_amount_paise)
           FILTER (WHERE status = ANY($1::smallint[])),
           0
         )::bigint AS total_spent_paise,
         MAX(created_at) AS last_order_at,
         (ARRAY_AGG(shipping_city ORDER BY created_at DESC))[1] AS latest_order_city
       FROM orders
       GROUP BY user_id
     ),

     address_stats AS (
       SELECT
         user_id,
         (ARRAY_AGG(city ORDER BY created_at DESC))[1] AS latest_address_city
       FROM addresses
       GROUP BY user_id
     )

     SELECT
       users.id,
       users.name,
       users.email,
       users.role,
       users.created_at,
       COALESCE(order_stats.order_count, 0)::int AS order_count,
       COALESCE(order_stats.total_spent_paise, 0)::bigint AS total_spent_paise,
       order_stats.last_order_at,
       COALESCE(
         order_stats.latest_order_city,
         address_stats.latest_address_city,
         ''
       ) AS city,
       ${computedTier} AS tier
     FROM users
     LEFT JOIN order_stats
       ON order_stats.user_id = users.id
     LEFT JOIN address_stats
       ON address_stats.user_id = users.id
     WHERE ${filters.join(" AND ")}
     ORDER BY users.created_at DESC`,
    [successfulStatuses, ...values],
  );

  response.json({
    customers: result.rows,
  });
}

export async function getAdminCustomer(
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> {
  if (!uuid.test(request.params.id)) {
    response.status(400).json({
      error: "Invalid customer id",
    });
    return;
  }

  const result = await db.query(
    `WITH order_stats AS (
       SELECT
         user_id,
         COUNT(*)::int AS order_count,
         COALESCE(
           SUM(total_amount_paise)
           FILTER (WHERE status = ANY($1::smallint[])),
           0
         )::bigint AS total_spent_paise,
         MAX(created_at) AS last_order_at,
         (ARRAY_AGG(shipping_city ORDER BY created_at DESC))[1] AS latest_order_city
       FROM orders
       GROUP BY user_id
     ),

     address_stats AS (
       SELECT
         user_id,
         (ARRAY_AGG(city ORDER BY created_at DESC))[1] AS latest_address_city
       FROM addresses
       GROUP BY user_id
     )

     SELECT
       users.id,
       users.name,
       users.email,
       users.role,
       users.created_at,
       COALESCE(order_stats.order_count, 0)::int AS order_count,
       COALESCE(order_stats.total_spent_paise, 0)::bigint AS total_spent_paise,
       order_stats.last_order_at,
       COALESCE(
         order_stats.latest_order_city,
         address_stats.latest_address_city,
         ''
       ) AS city,
       ${tierExpression()} AS tier
     FROM users
     LEFT JOIN order_stats
       ON order_stats.user_id = users.id
     LEFT JOIN address_stats
       ON address_stats.user_id = users.id
     WHERE users.id = $2
       AND users.role = 2
     GROUP BY
       users.id,
       order_stats.order_count,
       order_stats.total_spent_paise,
       order_stats.last_order_at,
       order_stats.latest_order_city,
       address_stats.latest_address_city`,
    [successfulStatuses, request.params.id],
  );

  if (!result.rows[0]) {
    response.status(404).json({
      error: "Customer not found",
    });
    return;
  }

  response.json({
    customer: result.rows[0],
  });
}

export async function getAdminAnalytics(
  request: Request,
  response: Response,
): Promise<void> {
  const rangeDays = clampRange(request.query.range);

  const [
    revenueSeries,
    statusDistribution,
    topProducts,
    categoryPerformance,
  ] = await Promise.all([
    db.query(
      `WITH days AS (
         SELECT generate_series(
           CURRENT_DATE - ($1::int - 1) * INTERVAL '1 day',
           CURRENT_DATE,
           INTERVAL '1 day'
         )::date AS day
       )

       SELECT
         TO_CHAR(days.day, 'Mon DD') AS d,
         COALESCE(COUNT(orders.id), 0)::int AS orders,
         COALESCE(
           SUM(orders.total_amount_paise)
           FILTER (WHERE orders.status = ANY($2::smallint[])),
           0
         )::bigint AS revenue_paise
       FROM days
       LEFT JOIN orders
         ON orders.created_at::date = days.day
       GROUP BY days.day
       ORDER BY days.day`,
      [rangeDays, successfulStatuses],
    ),

    db.query(
      `WITH statuses(status, label) AS (
         VALUES
           (1, 'PENDING_PAYMENT'),
           (2, 'PAID'),
           (3, 'PROCESSING'),
           (4, 'SHIPPED'),
           (5, 'DELIVERED'),
           (6, 'CANCELLED'),
           (7, 'REFUNDED')
       )

       SELECT
         statuses.status,
         statuses.label,
         COALESCE(COUNT(orders.id), 0)::int AS count
       FROM statuses
       LEFT JOIN orders
         ON orders.status = statuses.status
       GROUP BY statuses.status, statuses.label
       ORDER BY statuses.status`,
    ),

    db.query(
      `SELECT
         order_items.product_id,
         order_items.product_name AS name,
         order_items.sku,
         SUM(order_items.quantity)::int AS quantity_sold,
         SUM(
           order_items.price_paise * order_items.quantity
         )::bigint AS revenue_paise
       FROM order_items
       INNER JOIN orders
         ON orders.id = order_items.order_id
       WHERE orders.status = ANY($1::smallint[])
         AND orders.created_at >= NOW() - ($2::int * INTERVAL '1 day')
       GROUP BY
         order_items.product_id,
         order_items.product_name,
         order_items.sku
       ORDER BY revenue_paise DESC, quantity_sold DESC
       LIMIT 8`,
      [successfulStatuses, rangeDays],
    ),

    db.query(
      `SELECT
         categories.name AS category_name,
         COALESCE(
           SUM(order_items.quantity)
           FILTER (WHERE orders.id IS NOT NULL),
           0
         )::int AS quantity_sold,
         COALESCE(
           SUM(
             order_items.price_paise * order_items.quantity
           )
           FILTER (WHERE orders.id IS NOT NULL),
           0
         )::bigint AS revenue_paise
       FROM categories
       INNER JOIN products
         ON products.category_id = categories.id
       LEFT JOIN order_items
         ON order_items.product_id = products.id
       LEFT JOIN orders
         ON orders.id = order_items.order_id
         AND orders.status = ANY($1::smallint[])
         AND orders.created_at >= NOW() - ($2::int * INTERVAL '1 day')
       GROUP BY categories.id, categories.name
       ORDER BY revenue_paise DESC, quantity_sold DESC`,
      [successfulStatuses, rangeDays],
    ),
  ]);

  response.json({
    range_days: rangeDays,
    revenue_series: revenueSeries.rows,
    status_distribution: statusDistribution.rows,
    top_products: topProducts.rows,
    category_performance: categoryPerformance.rows,
    revenue_definition:
      "Statuses 2, 3, 4, and 5: PAID, PROCESSING, SHIPPED, DELIVERED.",
  });
}

export async function getAdminContactMessages(
  _request: Request,
  response: Response,
): Promise<void> {
  const result = await db.query(
    `SELECT
       contact_messages.id,
       contact_messages.user_id,
       contact_messages.name,
       contact_messages.email,
       contact_messages.subject,
       contact_messages.message,
       contact_messages.created_at,
       users.name AS account_name,
       users.email AS account_email
     FROM contact_messages
     LEFT JOIN users
       ON users.id = contact_messages.user_id
     ORDER BY contact_messages.created_at DESC`,
  );

  response.json({
    messages: result.rows,
  });
}

export async function deleteAdminContactMessage(
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> {
  if (!uuid.test(request.params.id)) {
    response.status(400).json({
      error: "Invalid message id",
    });
    return;
  }

  const result = await db.query(
    `DELETE FROM contact_messages
     WHERE id = $1
     RETURNING id`,
    [request.params.id],
  );

  if (!result.rows[0]) {
    response.status(404).json({
      error: "Message not found",
    });
    return;
  }

  response.json({
    message: "Contact message deleted successfully",
  });
}
