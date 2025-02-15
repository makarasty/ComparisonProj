import { Request, Response, NextFunction } from "express";
import {
	getAllDevicesService,
	getDeviceByIdService,
	createDeviceService,
	updateDeviceService,
	deleteDeviceService,
	seedDevicesService,
} from "../services/device/DeviceService";

export async function getDevices(
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const devices = await getAllDevicesService();
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
		const device = await getDeviceByIdService(id);
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
		const createdDevice = await createDeviceService(req.body);
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
		const updatedDevice = await updateDeviceService(id, req.body);
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
		const deletedDevice = await deleteDeviceService(id);
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
		const insertedDevices = await seedDevicesService();
		res.json({ message: "Database seeded", data: insertedDevices });
	} catch (error) {
		next(error);
	}
}
