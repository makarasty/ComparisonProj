import { Request, Response, NextFunction, RequestHandler } from "express";
import * as deviceService from "../utils/databaseUtils";

export const getDevices: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const devices = await deviceService.getAllDevices();
		res.json({ data: devices });
	} catch (error) {
		next(error);
	}
};

export const getDeviceById: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const device = await deviceService.getDeviceById(id);

		if (!device) {
			res.status(404).json({ message: "Device not found" });
			return;
		}
		res.json({ data: device });
	} catch (error) {
		next(error);
	}
};

export const createDevice: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const deviceData = req.body;

		if (deviceData.uuid == null) {
			deviceData.uuid = Math.floor(Math.random() * 1_000_000_000);
		}
		if (!deviceData.image) {
			deviceData.image = "images/unknown.jpg";
		}

		const createdDevice = await deviceService.createDevice(deviceData);
		res.status(201).json({ data: createdDevice });
	} catch (error) {
		next(error);
	}
};

export const updateDevice: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const updatedDevice = await deviceService.updateDevice(id, req.body);

		if (!updatedDevice) {
			res.status(404).json({ message: "Device not found" });
			return;
		}

		res.json({ data: updatedDevice });
	} catch (error) {
		next(error);
	}
};

export const deleteDevice: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const deletedDevice = await deviceService.deleteDevice(id);

		if (!deletedDevice) {
			res.status(404).json({ message: "Device not found" });
			return;
		}

		res.json({ message: "Device deleted" });
	} catch (error) {
		next(error);
	}
};

export const seedDevices: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const insertedDevices = await deviceService.insertDevices();
		res.json({ message: "Database seeded", data: insertedDevices });
	} catch (error) {
		next(error);
	}
};
