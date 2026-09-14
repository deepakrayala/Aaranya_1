import { Router } from "express";
import {
  getAdminAnalytics,
  getAdminCustomer,
  getAdminDashboard,
  getAdminTest,
  listAdminCustomers,
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { requireAuthentication } from "../middleware/authenticate.js";

export const adminRouter = Router();

adminRouter.use(requireAuthentication, requireAdmin);

adminRouter.get("/test", getAdminTest);
adminRouter.get("/dashboard", getAdminDashboard);
adminRouter.get("/customers", listAdminCustomers);
adminRouter.get("/customers/:id", getAdminCustomer);
adminRouter.get("/analytics", getAdminAnalytics);
