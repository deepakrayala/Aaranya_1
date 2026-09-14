import { Router } from "express";
import {
  createOrder,
  getAdminOrder,
  getOrder,
  listAdminOrders,
  listOrders,
  updateAdminOrderStatus,
} from "../controllers/order.controller.js";
import { requireAuthentication } from "../middleware/authenticate.js";
import { requireAdmin } from "../middleware/require-admin.js";

export const orderRouter = Router();
export const adminOrderRouter = Router();

orderRouter.use(requireAuthentication);
orderRouter.get("/", listOrders);
orderRouter.post("/", createOrder);
orderRouter.get("/:id", getOrder);

adminOrderRouter.use(requireAuthentication, requireAdmin);
adminOrderRouter.get("/orders", listAdminOrders);
adminOrderRouter.get("/orders/:id", getAdminOrder);
adminOrderRouter.put("/orders/:id/status", updateAdminOrderStatus);
