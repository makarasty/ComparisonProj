import axios, { AxiosResponse } from "axios";
import { IProduct } from "../types/product";

const API_URL = "http://localhost:5305/api/devices";

function extractFirstLink(str: string): string | null {
	const regex = /https?:\/\/[^,"']+|\/[^,"']+/;
	const match = str?.match(regex);
	return match ? match[0] : null;
}

function getAuthConfig() {
	const token = localStorage.getItem("token");
	return {
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
		},
	};
}

export async function fetchProducts(q?: string): Promise<IProduct[]> {
	let url = API_URL;
	if (q) {
		url += `?q=${encodeURIComponent(q)}`;
	}
	const resp: AxiosResponse<{ data: IProduct[] }> = await axios.get(url);
	const products = resp.data.data.map((product, index) => {
		const mapped: IProduct = {
			...product,
			image: extractFirstLink(product.image) || "/images/unknown.jpg",
		};
		if (!mapped.uuid) {
			mapped.uuid = index + 1;
		}
		return mapped;
	});
	return products;
}

export async function seedProducts(): Promise<void> {
	await axios.get(`${API_URL}/seed/devices`, getAuthConfig());
}

export async function addProduct(
	product: Partial<IProduct>,
): Promise<IProduct> {
	const resp: AxiosResponse<{ data: IProduct }> = await axios.post(
		API_URL,
		product,
		getAuthConfig(),
	);
	return resp.data.data;
}

export async function deleteProduct(id: string): Promise<void> {
	await axios.delete(`${API_URL}/${id}`, getAuthConfig());
}

export async function updateProduct(
	id: string,
	data: Partial<IProduct>,
): Promise<IProduct> {
	const resp: AxiosResponse<{ data: IProduct }> = await axios.put(
		`${API_URL}/${id}`,
		data,
		getAuthConfig(),
	);
	return resp.data.data;
}

export function isNumeric(value: unknown): value is number {
	return typeof value === "number" && !isNaN(value);
}
