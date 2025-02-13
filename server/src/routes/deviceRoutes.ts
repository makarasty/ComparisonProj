import { Router } from "express";
import {
	getDevices,
	getDeviceById,
	createDevice,
	updateDevice,
	deleteDevice,
	seedDevices,
} from "../controllers/deviceController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

router.get("/", getDevices);
router.get("/:id", getDeviceById);

router.post("/", authMiddleware, adminMiddleware, createDevice);
router.put("/:id", authMiddleware, adminMiddleware, updateDevice);
router.delete("/:id", authMiddleware, adminMiddleware, deleteDevice);
router.get("/seed/devices", authMiddleware, adminMiddleware, seedDevices);

export default router;
