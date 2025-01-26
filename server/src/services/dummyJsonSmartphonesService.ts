import { fetchJSON } from "./httpService";
import { IProduct } from "../interfaces/Product";

interface DummyJsonCategoryResponse {
	products: DummyJsonProduct[];
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

export async function getDummyJsonSmartphones(): Promise<IProduct[]> {
	const data = await fetchJSON<DummyJsonCategoryResponse>(
		"https://dummyjson.com/products/category/smartphones",
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
