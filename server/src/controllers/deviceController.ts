import { Request, Response } from "express";
import * as deviceService from "../services/deviceService";
import { fetchExternalDevices } from "../services/externalDataService";

export async function getDevices(req: Request, res: Response): Promise<void> {
	try {
		const devices = await deviceService.getAllDevices();
		res.json({ data: devices });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}

export async function getDeviceById(
	req: Request,
	res: Response,
): Promise<void> {
	try {
		const { id } = req.params;
		const device = await deviceService.getDeviceById(id);
		if (!device) {
			res.status(404).json({ message: "Device not found" });
			return;
		}
		res.json({ data: device });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}

export async function createDevice(req: Request, res: Response): Promise<void> {
	try {
		const created = await deviceService.createDevice(req.body);
		res.status(201).json({ data: created });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}

export async function updateDevice(req: Request, res: Response): Promise<void> {
	try {
		const { id } = req.params;
		const updated = await deviceService.updateDevice(id, req.body);
		if (!updated) {
			res.status(404).json({ message: "Device not found" });
			return;
		}
		res.json({ data: updated });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}

export async function deleteDevice(req: Request, res: Response): Promise<void> {
	try {
		const { id } = req.params;
		const deleted = await deviceService.deleteDevice(id);
		if (!deleted) {
			res.status(404).json({ message: "Device not found" });
			return;
		}
		res.json({ message: "Device deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}

export async function loadExternalDevices(
	req: Request,
	res: Response,
): Promise<void> {
	try {
		const externalDevices = await fetchExternalDevices();

		// for (const dev of externalDevices) {
		//   await deviceService.createDevice(dev);
		// }
		res.json({ data: externalDevices });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}
