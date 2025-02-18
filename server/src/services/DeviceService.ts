import deviceRepository from "../repositories/DeviceRepository";
import { IProduct } from "../interfaces/IProduct";
import {
	deviceCreateSchema,
	deviceUpdateSchema,
} from "../validators/DeviceValidators";
import productAggregator from "./ProductAggregatorService";

export class DeviceService {
	static async getAllDevices(): Promise<IProduct[]> {
		return deviceRepository.findAll();
	}

	static async getDeviceById(id: string): Promise<IProduct | null> {
		return deviceRepository.findById(id);
	}

	static async createDevice(data: unknown): Promise<IProduct> {
		const parsed = deviceCreateSchema.safeParse(data);
		if (!parsed.success) {
			const errMsg = parsed.error.errors.map((e) => e.message).join(", ");
			throw new Error(errMsg);
		}
		const deviceData = parsed.data;

		if (deviceData.uuid == null) {
			deviceData.uuid = Math.floor(Math.random() * 1_000_000_000);
		}
		if (!deviceData.image) {
			deviceData.image = "images/unknown.jpg";
		}

		const finalDeviceData: IProduct = {
			uuid: deviceData.uuid!,
			title: deviceData.title,
			description: deviceData.description,
			price: deviceData.price,
			brand: deviceData.brand ?? "Unknown Brand",
			category: deviceData.category ?? "Unknown Category",
			image: deviceData.image ?? "images/unknown.jpg",
			images: deviceData.images ?? [],
			rating: deviceData.rating ?? 0,
			stock: deviceData.stock ?? 0,
			available: deviceData.available ?? (deviceData.stock ?? 0) > 0,
			discount: deviceData.discount,
			tags: deviceData.tags,
			dimensions: deviceData.dimensions,
			specifications: deviceData.specifications,
			warranty: deviceData.warranty,
			metadata: deviceData.metadata,
			createdAt: new Date(),
		};

		return deviceRepository.create(finalDeviceData);
	}

	static async updateDevice(
		id: string,
		update: unknown,
	): Promise<IProduct | null> {
		const parsed = deviceUpdateSchema.safeParse(update);
		if (!parsed.success) {
			const errMsg = parsed.error.errors.map((e) => e.message).join(", ");
			throw new Error(errMsg);
		}
		const updateData = parsed.data;
		return deviceRepository.update(id, updateData);
	}

	static async deleteDevice(id: string): Promise<IProduct | null> {
		return deviceRepository.delete(id);
	}

	static async seedDevices(): Promise<IProduct[]> {
		const devices = await productAggregator.getAllProducts();
		return deviceRepository.insertMany(devices);
	}
}

export default DeviceService;
