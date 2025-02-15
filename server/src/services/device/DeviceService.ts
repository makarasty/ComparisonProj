import deviceRepository from "../../repositories/DeviceRepository";
import { IProduct } from "../../interfaces/Product";
import {
	deviceCreateSchema,
	deviceUpdateSchema,
} from "../../validators/DeviceValidators";

export async function getAllDevicesService(): Promise<IProduct[]> {
	return deviceRepository.findAll();
}

export async function getDeviceByIdService(
	id: string,
): Promise<IProduct | null> {
	return deviceRepository.findById(id);
}

export async function createDeviceService(data: unknown): Promise<IProduct> {
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
	};

	return deviceRepository.create(finalDeviceData);
}

export async function updateDeviceService(
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

export async function deleteDeviceService(
	id: string,
): Promise<IProduct | null> {
	return deviceRepository.delete(id);
}

export async function seedDevicesService(): Promise<IProduct[]> {
	const { getAllProducts } = await import("../productsAggregator.js");
	const devices = await getAllProducts();
	return deviceRepository.insertMany(devices);
}
