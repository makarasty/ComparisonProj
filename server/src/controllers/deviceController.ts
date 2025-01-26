import { Request, Response } from "express";
import * as deviceService from "../utils/databaseUtils";

export async function getDevices(req: Request, res: Response) {
	try {
		const devs = await deviceService.getAllDevices();

		res.json({ data: devs });
	} catch (e) {
		res.status(500).json({ message: "Server error" });
	}
}

export async function getDeviceById(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const dev = await deviceService.getDeviceById(id);

		if (!dev) {
			res.status(404).json({ message: "Device not found" });
			return;
		}

		res.json({ data: dev });
	} catch (e) {
		res.status(500).json({ message: "Server error" });
	}
}

export async function createDevice(req: Request, res: Response) {
	try {
		const c = await deviceService.createDevice(req.body);

		res.status(201).json({ data: c });
	} catch (e) {
		res.status(500).json({ message: "Server error" });
	}
}

export async function updateDevice(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const u = await deviceService.updateDevice(id, req.body);

		if (!u) {
			res.status(404).json({ message: "Device not found" });
			return;
		}

		res.json({ data: u });
	} catch (e) {
		res.status(500).json({ message: "Server error" });
	}
}

export async function deleteDevice(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const d = await deviceService.deleteDevice(id);

		if (!d) {
			res.status(404).json({ message: "Device not found" });
			return;
		}

		res.json({ message: "Device deleted" });
	} catch (e) {
		res.status(500).json({ message: "Server error" });
	}
}

export async function seedDevices(req: Request, res: Response) {
	try {
		const ins = await deviceService.insertDevices();

		res.json({ message: "Database seeded", data: ins });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: "Server error" });
	}
}
