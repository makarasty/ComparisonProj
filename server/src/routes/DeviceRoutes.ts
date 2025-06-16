import { Router } from "express";
import {
	getDevices,
	getDeviceById,
	createDevice,
	updateDevice,
	deleteDevice,
	seedDevices,
} from "../controllers/DeviceController";

import { authMiddleware } from "../middlewares/AuthMiddleware";
import { adminMiddleware } from "../middlewares/AdminMiddleware";

const router = Router();

router.get("/", getDevices);
router.get("/:id", getDeviceById);

router.post("/", authMiddleware, adminMiddleware, createDevice);
router.put("/:id", authMiddleware, adminMiddleware, updateDevice);
router.delete("/:id", authMiddleware, adminMiddleware, deleteDevice);
router.get("/seed/devices", authMiddleware, adminMiddleware, seedDevices);

export default router;
