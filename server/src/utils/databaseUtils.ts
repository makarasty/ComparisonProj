import DeviceModel from "../models/deviceModel";
import { IProduct } from "../interfaces/Product";
import { getAllProducts } from "../services/productsAggregator";

export async function getAllDevices(): Promise<IProduct[]> {
	return DeviceModel.find().sort({ createdAt: -1 });
}

export async function getDeviceById(id: string): Promise<IProduct | null> {
	return DeviceModel.findById(id);
}

export async function createDevice(data: IProduct): Promise<IProduct> {
	const d = new DeviceModel(data);

	return d.save();
}

export async function updateDevice(
	id: string,
	data: Partial<IProduct>,
): Promise<IProduct | null> {
	return DeviceModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteDevice(id: string): Promise<IProduct | null> {
	return DeviceModel.findByIdAndDelete(id);
}

export async function insertDevices(): Promise<IProduct[]> {
	const s = await getAllProducts();

	await DeviceModel.deleteMany({});

	return DeviceModel.insertMany(s);
}
