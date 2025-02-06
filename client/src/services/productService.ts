import axios from "axios";
import { IProduct } from "../types/product";

const API_URL = "http://localhost:5305/api/devices";

function extractFirstLink(str: string): string | null {
	const regex = /https?:\/\/[^,"']+|\/[^,"']+/;
	const match = str.match(regex);
	return match ? match[0] : null;
}

export async function fetchProducts(): Promise<IProduct[]> {
	try {
		const resp = await axios.get<{ data: IProduct[] }>(API_URL);
		const products = resp.data.data.map((product, index) => {
			const mapped: IProduct = {
				...product,
				image: extractFirstLink(product.image) || "/images/unknown.jpg",
			};
			mapped.uuid = index + 1;
			return mapped;
		});
		return products;
	} catch (e) {
		console.error("Error fetching products:", e);
		throw e;
	}
}

export async function seedProducts() {
	try {
		await axios.get(`${API_URL}/seed/devices`);
	} catch (e) {
		console.error("Error seeding products:", e);
		throw e;
	}
}

export async function addProduct(
	product: Partial<IProduct>,
): Promise<IProduct> {
	try {
		const resp = await axios.post<IProduct>(API_URL, product);
		return resp.data;
	} catch (e) {
		console.error("Помилка при додаванні товару:", e);
		throw e;
	}
}

export async function deleteProduct(id: string): Promise<void> {
	try {
		await axios.delete(`${API_URL}/${id}`);
	} catch (e) {
		console.error("Помилка при видаленні товару:", e);
		throw e;
	}
}

export async function updateProduct(
	id: string,
	data: Partial<IProduct>,
): Promise<IProduct> {
	try {
		const resp = await axios.put<{ data: IProduct }>(`${API_URL}/${id}`, data);
		return resp.data.data;
	} catch (e) {
		console.error("Помилка при оновленні товару:", e);
		throw e;
	}
}

export function isNumeric<T>(v: T): v is T extends number ? T : never {
	return typeof v === "number" && !isNaN(v);
}
