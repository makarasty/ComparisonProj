import { Router } from "express";
import {
	getDevices,
	getDeviceById,
	createDevice,
	updateDevice,
	deleteDevice,
	loadExternalDevices,
} from "../controllers/deviceController";

const router = Router();

router.get("/", getDevices);
router.post("/", createDevice);

router.get("/:id", getDeviceById);
router.put("/:id", updateDevice);
router.delete("/:id", deleteDevice);

router.get("/external/load", loadExternalDevices);

export default router;
