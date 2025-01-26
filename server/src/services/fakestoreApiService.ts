import { fetchJSON } from "./httpService";
import { IProduct } from "../interfaces/Product";

type FakeStoreApiProduct = {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
	rating: {
		rate: number;
		count: number;
	};
};

export async function getFakeStoreApiProducts(): Promise<IProduct[]> {
	const data = await fetchJSON<FakeStoreApiProduct[]>(
		"https://fakestoreapi.com/products",
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
