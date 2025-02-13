import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import {
	getAllUsers,
	deleteUser,
	updateUser,
} from "../controllers/userController";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getAllUsers);

router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

router.put("/:id", authMiddleware, adminMiddleware, updateUser);

export default router;
