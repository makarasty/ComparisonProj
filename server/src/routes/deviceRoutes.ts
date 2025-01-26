import { Router } from "express";
import {
	getDevices,
	getDeviceById,
	createDevice,
	updateDevice,
	deleteDevice,
	seedDevices,
} from "../controllers/deviceController";

const router = Router();

router.get("/", getDevices);
router.post("/", createDevice);
router.get("/:id", getDeviceById);
router.put("/:id", updateDevice);
router.delete("/:id", deleteDevice);
router.get("/seed/devices", seedDevices);

export default router;
