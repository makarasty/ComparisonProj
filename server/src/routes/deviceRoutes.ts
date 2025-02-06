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

router.get("/", (req, res) => void getDevices(req, res));
router.post("/", (req, res) => void createDevice(req, res));
router.get("/:id", (req, res) => void getDeviceById(req, res));
router.put("/:id", (req, res) => void updateDevice(req, res));
router.delete("/:id", (req, res) => void deleteDevice(req, res));
router.get("/seed/devices", (req, res) => void seedDevices(req, res));

export default router;
