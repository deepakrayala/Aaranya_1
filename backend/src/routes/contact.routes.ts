import { Router } from "express";
import { createContactMessage } from "../controllers/contact.controller.js";
import { requireAuthentication } from "../middleware/authenticate.js";

export const contactRouter = Router();

contactRouter.use(requireAuthentication);

contactRouter.post("/", createContactMessage);
