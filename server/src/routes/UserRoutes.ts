import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { adminMiddleware } from "../middlewares/AdminMiddleware";
import {
	getAllUsers,
	deleteUser,
	updateUser,
} from "../controllers/UserController";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);

export default router;
