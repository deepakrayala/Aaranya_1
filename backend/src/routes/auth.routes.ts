import { Router } from "express";
import { getCurrentUser, login, logout, signup } from "../controllers/auth.controller.js";
import { requireAuthentication } from "../middleware/authenticate.js";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", requireAuthentication, logout);
authRouter.get("/me", requireAuthentication, getCurrentUser);
