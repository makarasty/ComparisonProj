import { Request, Response, NextFunction } from "express";
import { DeviceService } from "../services/DeviceService";

export async function getDevices(
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const devices = await DeviceService.getAllDevices();
		res.json({ data: devices });
	} catch (error) {
		next(error);
	}
}

export async function getDeviceById(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { id } = req.params;
		const device = await DeviceService.getDeviceById(id);
		if (!device) {
			res.status(404).json({ message: "Device not found" });
			return;
		}
		res.json({ data: device });
	} catch (error) {
		next(error);
	}
}

export async function createDevice(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const createdDevice = await DeviceService.createDevice(req.body);
		res.status(201).json({ data: createdDevice });
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json({ message: error.message });
			return;
		}
		next(error);
	}
}

export async function updateDevice(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { id } = req.params;
		const updatedDevice = await DeviceService.updateDevice(id, req.body);
		if (!updatedDevice) {
			res.status(404).json({ message: "Device not found" });
			return;
		}
		res.json({ data: updatedDevice });
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json({ message: error.message });
			return;
		}
		next(error);
	}
}

export async function deleteDevice(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { id } = req.params;
		const deletedDevice = await DeviceService.deleteDevice(id);
		if (!deletedDevice) {
			res.status(404).json({ message: "Device not found" });
			return;
		}
		res.json({ message: "Device deleted" });
	} catch (error) {
		next(error);
	}
}

export async function seedDevices(
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const insertedDevices = await DeviceService.seedDevices();
		res.json({ message: "Database seeded", data: insertedDevices });
	} catch (error) {
		next(error);
	}
}
