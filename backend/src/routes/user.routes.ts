import { Router } from "express";
import { createAddress, deleteAddress, getProfile, listAddresses, updateAddress, updateProfile } from "../controllers/user.controller.js";
import { requireAuthentication } from "../middleware/authenticate.js";
export const userRouter = Router(); userRouter.use(requireAuthentication); userRouter.get("/me", getProfile); userRouter.put("/me", updateProfile); userRouter.get("/me/addresses", listAddresses); userRouter.post("/me/addresses", createAddress); userRouter.put("/me/addresses/:id", updateAddress); userRouter.delete("/me/addresses/:id", deleteAddress);
