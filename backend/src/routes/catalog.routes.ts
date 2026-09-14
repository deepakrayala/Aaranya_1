import { Router } from "express";
import { createCategory, createProduct, deleteCategory, deleteProduct, getAdminProduct, getPublicProduct, listAdminProducts, listCategories, listPublicProducts, updateCategory, updateProduct } from "../controllers/catalog.controller.js";
import { requireAuthentication } from "../middleware/authenticate.js";
import { requireAdmin } from "../middleware/require-admin.js";
export const categoryRouter = Router(); export const productRouter = Router(); export const adminCatalogRouter = Router();
categoryRouter.get("/", listCategories); productRouter.get("/", listPublicProducts); productRouter.get("/:slug", getPublicProduct);
adminCatalogRouter.use(requireAuthentication, requireAdmin);
adminCatalogRouter.post("/categories", createCategory); adminCatalogRouter.put("/categories/:id", updateCategory); adminCatalogRouter.delete("/categories/:id", deleteCategory);
adminCatalogRouter.get("/products", listAdminProducts); adminCatalogRouter.post("/products", createProduct); adminCatalogRouter.get("/products/:id", getAdminProduct); adminCatalogRouter.put("/products/:id", updateProduct); adminCatalogRouter.delete("/products/:id", deleteProduct);
