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
		return resp.data.data.map((product) => ({
			...product,
			image: extractFirstLink(product.image) || "/images/unknown.jpg",
		}));
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

export function isNumeric<T>(v: T): v is T extends number ? T : never {
	return typeof v === "number" && !isNaN(v);
}
