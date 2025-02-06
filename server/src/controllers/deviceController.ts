import { Request, Response } from "express";
import * as deviceService from "../utils/databaseUtils";

export async function getDevices(req: Request, res: Response) {
	try {
		const devices = await deviceService.getAllDevices();
		return res.json({ data: devices });
	} catch (error) {
		console.error("Error fetching devices:", error);
		return res.status(500).json({ message: "Server error" });
	}
}

export async function getDeviceById(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const device = await deviceService.getDeviceById(id);

		if (!device) {
			return res.status(404).json({ message: "Device not found" });
		}
		return res.json({ data: device });
	} catch (error) {
		console.error("Error fetching device by id:", error);
		return res.status(500).json({ message: "Server error" });
	}
}

export async function createDevice(req: Request, res: Response) {
	try {
		const deviceData = req.body;

		if (deviceData.uuid == null) {
			deviceData.uuid = Math.floor(Math.random() * 1_000_000_000);
		}

		const createdDevice = await deviceService.createDevice(deviceData);
		return res.status(201).json({ data: createdDevice });
	} catch (error) {
		console.error("Error creating device:", error);
		return res.status(500).json({ message: "Server error" });
	}
}

export async function updateDevice(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const updatedDevice = await deviceService.updateDevice(id, req.body);

		if (!updatedDevice) {
			return res.status(404).json({ message: "Device not found" });
		}

		return res.json({ data: updatedDevice });
	} catch (error) {
		console.error("Error updating device:", error);
		return res.status(500).json({ message: "Server error" });
	}
}

export async function deleteDevice(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const deletedDevice = await deviceService.deleteDevice(id);

		if (!deletedDevice) {
			return res.status(404).json({ message: "Device not found" });
		}

		return res.json({ message: "Device deleted" });
	} catch (error) {
		console.error("Error deleting device:", error);
		return res.status(500).json({ message: "Server error" });
	}
}

export async function seedDevices(req: Request, res: Response) {
	try {
		const insertedDevices = await deviceService.insertDevices();
		return res.json({ message: "Database seeded", data: insertedDevices });
	} catch (error) {
		console.error("Error seeding database:", error);
		return res.status(500).json({ message: "Server error" });
	}
}
