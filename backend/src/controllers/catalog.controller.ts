import type { Request, Response } from "express";
import { db } from "../db/pool.js";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const productFields = `products.id, products.category_id, products.sku, products.slug, products.name,
  products.description, products.price_paise, products.original_price_paise, products.stock_quantity,
  products.status, products.rating, products.image_url, products.created_at, products.updated_at,
  categories.name AS category_name, categories.slug AS category_slug`;
const productJoin = "FROM products INNER JOIN categories ON categories.id = products.category_id";

function object(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function text(value: unknown, min = 1, max = 255): string | null {
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result.length >= min && result.length <= max ? result : null;
}
function number(value: unknown, min: number, max = Number.MAX_SAFE_INTEGER): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max ? value : null;
}
function duplicate(error: unknown): boolean { return typeof error === "object" && error !== null && "code" in error && error.code === "23505"; }
function foreignKey(error: unknown): boolean { return typeof error === "object" && error !== null && "code" in error && error.code === "23503"; }

function categoryInput(body: unknown): { name: string; slug: string } | null {
  if (!object(body)) return null;
  const name = text(body.name, 2, 100); const categorySlug = text(body.slug, 2, 120);
  return name && categorySlug && slug.test(categorySlug) ? { name, slug: categorySlug } : null;
}

function productInput(body: unknown): Record<string, unknown> | null {
  if (!object(body)) return null;
  const categoryId = text(body.category_id, 36, 36); const sku = text(body.sku, 1, 100); const productSlug = text(body.slug, 2, 160);
  const name = text(body.name, 2, 255); const description = text(body.description, 1, 10000);
  const price = number(body.price_paise, 0); const stock = number(body.stock_quantity, 0); const status = number(body.status, 1, 3);
  const original = body.original_price_paise === null || body.original_price_paise === undefined ? null : number(body.original_price_paise, 0);
  const rating = body.rating === null || body.rating === undefined ? null : decimal(body.rating, 0, 5, 1);
  const image = body.image_url === null || body.image_url === undefined || body.image_url === "" ? null : text(body.image_url, 1, 2000);
  if (!categoryId || !uuid.test(categoryId) || !sku || !productSlug || !slug.test(productSlug) || !name || !description || price === null || stock === null || status === null || (body.original_price_paise != null && original === null) || (body.rating != null && rating === null) || (body.image_url && !image)) return null;
  return { categoryId, sku, productSlug, name, description, price, original, stock, status, rating, image };
}

function decimal(value: unknown, min: number, max: number, places: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) return null;
  const scale = 10 ** places;
  return Number.isInteger(value * scale) ? value : null;
}

export async function listCategories(_request: Request, response: Response): Promise<void> {
  const result = await db.query("SELECT id, name, slug FROM categories ORDER BY name"); response.json({ categories: result.rows });
}
export async function createCategory(request: Request, response: Response): Promise<void> {
  const input = categoryInput(request.body); if (!input) { response.status(400).json({ error: "Name and a valid slug are required" }); return; }
  try { const result = await db.query("INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id, name, slug", [input.name, input.slug]); response.status(201).json({ category: result.rows[0] }); }
  catch (error) { if (duplicate(error)) response.status(409).json({ error: "Category name or slug already exists" }); else throw error; }
}
export async function updateCategory(request: Request<{ id: string }>, response: Response): Promise<void> {
  if (!uuid.test(request.params.id)) { response.status(400).json({ error: "Invalid category id" }); return; }
  const input = categoryInput(request.body); if (!input) { response.status(400).json({ error: "Name and a valid slug are required" }); return; }
  try { const result = await db.query("UPDATE categories SET name = $1, slug = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, slug", [input.name, input.slug, request.params.id]); if (!result.rows[0]) response.status(404).json({ error: "Category not found" }); else response.json({ category: result.rows[0] }); }
  catch (error) { if (duplicate(error)) response.status(409).json({ error: "Category name or slug already exists" }); else throw error; }
}
export async function deleteCategory(request: Request<{ id: string }>, response: Response): Promise<void> {
  if (!uuid.test(request.params.id)) { response.status(400).json({ error: "Invalid category id" }); return; }
  try { const result = await db.query("DELETE FROM categories WHERE id = $1", [request.params.id]); if (!result.rowCount) response.status(404).json({ error: "Category not found" }); else response.sendStatus(204); }
  catch (error) { if (foreignKey(error)) response.status(409).json({ error: "Category cannot be deleted while products use it" }); else throw error; }
}

export async function listPublicProducts(request: Request, response: Response): Promise<void> {
  const category = typeof request.query.category === "string" && slug.test(request.query.category) ? request.query.category : undefined;
  const search = typeof request.query.search === "string" ? request.query.search.trim().slice(0, 100) : "";
  const parsedPage = typeof request.query.page === "string" ? Number(request.query.page) : 1;
  const parsedLimit = typeof request.query.limit === "string" ? Number(request.query.limit) : 24;
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isInteger(parsedLimit) ? Math.min(48, Math.max(1, parsedLimit)) : 24;
  const values: unknown[] = []; const filters = ["products.status IN (1, 3)"];
  if (category) { values.push(category); filters.push(`categories.slug = $${values.length}`); }
  if (search) { values.push(`%${search}%`); filters.push(`(products.name ILIKE $${values.length} OR products.description ILIKE $${values.length})`); }
  values.push(limit, (page - 1) * limit);
  const result = await db.query(`SELECT ${productFields} ${productJoin} WHERE ${filters.join(" AND ")} ORDER BY products.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
  response.json({ products: result.rows, page, limit });
}
export async function getPublicProduct(request: Request<{ slug: string }>, response: Response): Promise<void> {
  const result = await db.query(`SELECT ${productFields} ${productJoin} WHERE products.slug = $1 AND products.status IN (1, 3)`, [request.params.slug]);
  if (!result.rows[0]) response.status(404).json({ error: "Product not found" }); else response.json({ product: result.rows[0] });
}
export async function listAdminProducts(_request: Request, response: Response): Promise<void> { const result = await db.query(`SELECT ${productFields} ${productJoin} ORDER BY products.created_at DESC`); response.json({ products: result.rows }); }
export async function getAdminProduct(request: Request<{ id: string }>, response: Response): Promise<void> { if (!uuid.test(request.params.id)) { response.status(400).json({ error: "Invalid product id" }); return; } const result = await db.query(`SELECT ${productFields} ${productJoin} WHERE products.id = $1`, [request.params.id]); if (!result.rows[0]) response.status(404).json({ error: "Product not found" }); else response.json({ product: result.rows[0] }); }
export async function createProduct(request: Request, response: Response): Promise<void> {
  const input = productInput(request.body); if (!input) { response.status(400).json({ error: "Invalid product fields" }); return; }
  const v = input;
  try { const result = await db.query(`INSERT INTO products (category_id, sku, slug, name, description, price_paise, original_price_paise, stock_quantity, status, rating, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, [v.categoryId,v.sku,v.productSlug,v.name,v.description,v.price,v.original,v.stock,v.status,v.rating,v.image]); response.status(201).json({ product: result.rows[0] }); }
  catch (error) { if (foreignKey(error)) response.status(400).json({ error: "Invalid category" }); else if (duplicate(error)) response.status(409).json({ error: "SKU or slug already exists" }); else throw error; }
}
export async function updateProduct(request: Request<{ id: string }>, response: Response): Promise<void> {
  if (!uuid.test(request.params.id)) { response.status(400).json({ error: "Invalid product id" }); return; } const input = productInput(request.body); if (!input) { response.status(400).json({ error: "Invalid product fields" }); return; } const v = input;
  try { const result = await db.query(`UPDATE products SET category_id=$1,sku=$2,slug=$3,name=$4,description=$5,price_paise=$6,original_price_paise=$7,stock_quantity=$8,status=$9,rating=$10,image_url=$11,updated_at=NOW() WHERE id=$12 RETURNING *`, [v.categoryId,v.sku,v.productSlug,v.name,v.description,v.price,v.original,v.stock,v.status,v.rating,v.image,request.params.id]); if (!result.rows[0]) response.status(404).json({ error: "Product not found" }); else response.json({ product: result.rows[0] }); }
  catch (error) { if (foreignKey(error)) response.status(400).json({ error: "Invalid category" }); else if (duplicate(error)) response.status(409).json({ error: "SKU or slug already exists" }); else throw error; }
}
export async function deleteProduct(request: Request<{ id: string }>, response: Response): Promise<void> { if (!uuid.test(request.params.id)) { response.status(400).json({ error: "Invalid product id" }); return; } try { const result = await db.query("DELETE FROM products WHERE id = $1", [request.params.id]); if (!result.rowCount) response.status(404).json({ error: "Product not found" }); else response.sendStatus(204); } catch (error) { if (foreignKey(error)) response.status(409).json({ error: "Product cannot be deleted while referenced by orders" }); else throw error; } }
