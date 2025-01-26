import { fetchJSON } from "./httpService";
import { IProduct } from "../interfaces/Product";

interface BeeceptorProduct {
	id: number;
	title: string;
	description: string;
	price: number;
	category: string;
	image: string;
	rating?: {
		rate: number;
		count: number;
	};
}

export async function getBeeceptorProducts(): Promise<IProduct[]> {
	const data = await fetchJSON<BeeceptorProduct[]>(
		"https://fake-store-api.mock.beeceptor.com/api/products",
	);

	return data.map((item) => ({
		id: item.id,
		title: item.title,
		description: item.description,
		price: item.price,
		brand: undefined,
		category: item.category,
		image: item.image,
		rating: item.rating?.rate,
		stock: undefined,
		dimensions: undefined,
	}));
}
