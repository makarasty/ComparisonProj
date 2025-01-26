import { fetchJSON } from "./httpService";
import { IProduct } from "../interfaces/Product";

interface DummyJsonResponse {
	products: DummyJsonProduct[];
	total: number;
	skip: number;
	limit: number;
}

interface DummyJsonProduct {
	id: number;
	title: string;
	description: string;
	price: number;
	brand: string;
	category: string;
	stock: number;
	rating: number;
	thumbnail: string;
	images: string[];
}

export async function getDummyJsonProducts(): Promise<IProduct[]> {
	const data = await fetchJSON<DummyJsonResponse>(
		"https://dummyjson.com/products",
	);

	return data.products.map((item) => ({
		id: item.id,
		title: item.title,
		description: item.description,
		price: item.price,
		brand: item.brand,
		category: item.category,
		image: item.thumbnail,
		rating: item.rating,
		stock: item.stock,
		dimensions: undefined,
	}));
}
