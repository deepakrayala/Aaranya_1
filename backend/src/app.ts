import express from "express";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { adminCatalogRouter, categoryRouter, productRouter } from "./routes/catalog.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { adminOrderRouter, orderRouter } from "./routes/order.routes.js";
import { contactRouter } from "./routes/contact.routes.js";
import { userRouter } from "./routes/user.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(corsMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.get("/", (_request, response) => {
	response.json({
		name: "Aranya Pure Living API",
		status: "running",
		version: "v1",
		health: "/api/v1/health",
	});
});

app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin", adminCatalogRouter);
app.use("/api/v1/admin", adminOrderRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/contact-messages", contactRouter);
app.use(notFoundHandler);
app.use(errorHandler);
