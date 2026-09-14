import type { Request, Response } from "express";
import { db } from "../db/pool.js";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const statuses = new Set([1, 2, 3, 4, 5, 6, 7]);
const maxItemQuantity = 1000;
const maxOrderTotalPaise = 2_147_483_647;

const orderColumns = `orders.id, orders.order_number, orders.user_id, orders.total_amount_paise, orders.status,
  orders.shipping_name, orders.shipping_address_line1, orders.shipping_address_line2,
  orders.shipping_city, orders.shipping_state, orders.shipping_postal_code, orders.shipping_country, orders.shipping_phone,
  orders.billing_name, orders.billing_address_line1, orders.billing_address_line2,
  orders.billing_city, orders.billing_state, orders.billing_postal_code, orders.billing_country, orders.billing_phone,
  orders.created_at, orders.updated_at`;

const adminOrderColumns = `${orderColumns}, users.name AS customer_name, users.email AS customer_email`;

type OrderItemInput = {
  product_id: string;
  quantity: number;
};

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  price_paise: number;
  stock_quantity: number;
  status: number;
};

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseOrderItems(value: unknown): OrderItemInput[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) return null;

  const merged = new Map<string, number>();
  for (const item of value) {
    if (!object(item) || typeof item.product_id !== "string" || !uuid.test(item.product_id)) return null;
    if (typeof item.quantity !== "number" || !Number.isSafeInteger(item.quantity) || item.quantity < 1) return null;
    const quantity = (merged.get(item.product_id) ?? 0) + item.quantity;
    if (quantity > maxItemQuantity) return null;
    merged.set(item.product_id, quantity);
  }

  return [...merged.entries()].map(([product_id, quantity]) => ({ product_id, quantity }));
}

async function getOrderItems(orderId: string) {
  const result = await db.query(
    `SELECT id, order_id, product_id, product_name, sku, price_paise, quantity, created_at
     FROM order_items
     WHERE order_id = $1
     ORDER BY created_at ASC`,
    [orderId],
  );
  return result.rows;
}

export async function createOrder(request: Request, response: Response): Promise<void> {
  if (!object(request.body)) {
    response.status(400).json({ error: "Invalid order request" });
    return;
  }

  const items = parseOrderItems(request.body.items);
  const shippingAddressId = typeof request.body.shipping_address_id === "string" ? request.body.shipping_address_id : "";
  const billingAddressId =
    typeof request.body.billing_address_id === "string" ? request.body.billing_address_id : shippingAddressId;

  if (!items || !uuid.test(shippingAddressId) || !uuid.test(billingAddressId)) {
    response.status(400).json({ error: "Items and valid address selections are required" });
    return;
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const addressResult = await client.query(
      `SELECT id, label, address_line1, address_line2, city, state, postal_code, country, phone
       FROM addresses
       WHERE user_id = $1 AND id IN ($2, $3)`,
      [request.authUser!.id, shippingAddressId, billingAddressId],
    );
    const addresses = new Map(addressResult.rows.map((address) => [address.id, address]));
    const shippingAddress = addresses.get(shippingAddressId);
    const billingAddress = addresses.get(billingAddressId);

    if (!shippingAddress || !billingAddress) {
      await client.query("ROLLBACK");
      response.status(400).json({ error: "Selected address was not found" });
      return;
    }

    const productIds = items.map((item) => item.product_id);
    const productResult = await client.query<ProductRow>(
      `SELECT id, sku, name, price_paise, stock_quantity, status
       FROM products
       WHERE id = ANY($1::uuid[])
       FOR UPDATE`,
      [productIds],
    );
    const products = new Map(productResult.rows.map((product) => [product.id, product]));

    if (products.size !== items.length) {
      await client.query("ROLLBACK");
      response.status(400).json({ error: "One or more products were not found" });
      return;
    }

    let totalAmountPaise = 0;
    for (const item of items) {
      const product = products.get(item.product_id)!;
      if (product.status !== 1) {
        await client.query("ROLLBACK");
        response.status(409).json({ error: `${product.name} is not available for purchase` });
        return;
      }
      if (product.stock_quantity < item.quantity) {
        await client.query("ROLLBACK");
        response.status(409).json({ error: `Only ${product.stock_quantity} units of ${product.name} are available` });
        return;
      }
      const lineTotal = product.price_paise * item.quantity;
      if (!Number.isSafeInteger(lineTotal) || totalAmountPaise > maxOrderTotalPaise - lineTotal) {
        await client.query("ROLLBACK");
        response.status(400).json({ error: "Order total is too large" });
        return;
      }
      totalAmountPaise += lineTotal;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (
        user_id, total_amount_paise, status,
        shipping_name, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state,
        shipping_postal_code, shipping_country, shipping_phone,
        billing_name, billing_address_line1, billing_address_line2, billing_city, billing_state,
        billing_postal_code, billing_country, billing_phone
      ) VALUES (
        $1, $2, 1,
        $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING ${orderColumns}`,
      [
        request.authUser!.id,
        totalAmountPaise,
        request.authUser!.name,
        shippingAddress.address_line1,
        shippingAddress.address_line2,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postal_code,
        shippingAddress.country,
        shippingAddress.phone,
        request.authUser!.name,
        billingAddress.address_line1,
        billingAddress.address_line2,
        billingAddress.city,
        billingAddress.state,
        billingAddress.postal_code,
        billingAddress.country,
        billingAddress.phone,
      ],
    );

    const order = orderResult.rows[0];
    for (const item of items) {
      const product = products.get(item.product_id)!;
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, sku, price_paise, quantity)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, product.id, product.name, product.sku, product.price_paise, item.quantity],
      );
      await client.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1,
             status = CASE WHEN stock_quantity - $1 = 0 THEN 3 ELSE status END,
             updated_at = NOW()
         WHERE id = $2`,
        [item.quantity, product.id],
      );
    }

    const orderItems = await client.query(
      `SELECT id, order_id, product_id, product_name, sku, price_paise, quantity, created_at
       FROM order_items
       WHERE order_id = $1
       ORDER BY created_at ASC`,
      [order.id],
    );

    await client.query("COMMIT");
    response.status(201).json({ order, items: orderItems.rows });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export async function listOrders(request: Request, response: Response): Promise<void> {
  const result = await db.query(
    `SELECT ${orderColumns},
      COALESCE(SUM(order_items.quantity), 0)::int AS item_count,
      COALESCE(string_agg(order_items.product_name, ', ' ORDER BY order_items.created_at), '') AS item_summary
     FROM orders
     LEFT JOIN order_items ON order_items.order_id = orders.id
     WHERE orders.user_id = $1
     GROUP BY orders.id
     ORDER BY orders.created_at DESC`,
    [request.authUser!.id],
  );
  response.json({ orders: result.rows });
}

export async function getOrder(request: Request<{ id: string }>, response: Response): Promise<void> {
  if (!uuid.test(request.params.id)) {
    response.status(404).json({ error: "Order not found" });
    return;
  }

  const result = await db.query(`SELECT ${orderColumns} FROM orders WHERE id = $1 AND user_id = $2`, [
    request.params.id,
    request.authUser!.id,
  ]);
  if (!result.rows[0]) {
    response.status(404).json({ error: "Order not found" });
    return;
  }

  response.json({ order: result.rows[0], items: await getOrderItems(request.params.id) });
}

export async function listAdminOrders(_request: Request, response: Response): Promise<void> {
  const result = await db.query(
    `SELECT ${adminOrderColumns},
      COALESCE(SUM(order_items.quantity), 0)::int AS item_count,
      COALESCE(string_agg(order_items.product_name, ', ' ORDER BY order_items.created_at), '') AS item_summary
     FROM orders
     INNER JOIN users ON users.id = orders.user_id
     LEFT JOIN order_items ON order_items.order_id = orders.id
     GROUP BY orders.id, users.name, users.email
     ORDER BY orders.created_at DESC`,
  );
  response.json({ orders: result.rows });
}

export async function getAdminOrder(request: Request<{ id: string }>, response: Response): Promise<void> {
  if (!uuid.test(request.params.id)) {
    response.status(400).json({ error: "Invalid order id" });
    return;
  }

  const result = await db.query(
    `SELECT ${adminOrderColumns}
     FROM orders
     INNER JOIN users ON users.id = orders.user_id
     WHERE orders.id = $1`,
    [request.params.id],
  );
  if (!result.rows[0]) {
    response.status(404).json({ error: "Order not found" });
    return;
  }

  response.json({ order: result.rows[0], items: await getOrderItems(request.params.id) });
}

export async function updateAdminOrderStatus(
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> {
  if (!uuid.test(request.params.id)) {
    response.status(400).json({ error: "Invalid order id" });
    return;
  }

  const status = object(request.body) && typeof request.body.status === "number" ? request.body.status : null;
  if (!status || !Number.isInteger(status) || !statuses.has(status)) {
    response.status(400).json({ error: "Status must be between 1 and 7" });
    return;
  }

  const current = await db.query<{ status: number }>("SELECT status FROM orders WHERE id = $1", [request.params.id]);
  if (!current.rows[0]) {
    response.status(404).json({ error: "Order not found" });
    return;
  }
  if (status === 2 && current.rows[0].status !== 1) {
    response.status(409).json({ error: "Only pending payment orders can be marked paid" });
    return;
  }

  const result = await db.query(
    `UPDATE orders
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING ${orderColumns}`,
    [status, request.params.id],
  );
  if (!result.rows[0]) {
    response.status(404).json({ error: "Order not found" });
    return;
  }

  response.json({ order: result.rows[0] });
}
