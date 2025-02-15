import DeviceModel from "../models/DeviceModel";
import { IProduct } from "../interfaces/Product";

class DeviceRepository {
	async findAll(): Promise<IProduct[]> {
		return DeviceModel.find().sort({ createdAt: -1 }).exec();
	}

	async findById(id: string): Promise<IProduct | null> {
		return DeviceModel.findById(id).exec();
	}

	async create(data: IProduct): Promise<IProduct> {
		const device = new DeviceModel(data);
		return device.save();
	}

	async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
		return DeviceModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	async delete(id: string): Promise<IProduct | null> {
		return DeviceModel.findByIdAndDelete(id).exec();
	}

	async insertMany(devices: IProduct[]): Promise<IProduct[]> {
		await DeviceModel.deleteMany({});
		return DeviceModel.insertMany(devices);
	}
}

export default new DeviceRepository();
