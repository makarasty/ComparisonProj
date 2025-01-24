import DeviceModel from "../models/deviceModel";
import { IDevice } from "../interfaces/Device";

export async function getAllDevices(): Promise<IDevice[]> {
	return DeviceModel.find().sort({ createdAt: -1 });
}

export async function getDeviceById(deviceId: string): Promise<IDevice | null> {
	return DeviceModel.findById(deviceId);
}

export async function createDevice(data: IDevice): Promise<IDevice> {
	const device = new DeviceModel(data);
	return device.save();
}

export async function updateDevice(
	deviceId: string,
	data: Partial<IDevice>,
): Promise<IDevice | null> {
	// new: true
	return DeviceModel.findByIdAndUpdate(deviceId, data, { new: true });
}

export async function deleteDevice(deviceId: string): Promise<IDevice | null> {
	return DeviceModel.findByIdAndDelete(deviceId);
}
