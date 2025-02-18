import { fetchJSON } from "../helpers/fetchJSON";
import { IProduct } from "../../interfaces/IProduct";

type FakeStoreProduct = {
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

const FAKE_STORE_CATEGORIES = ["electronics"] as const;

export type FakeStoreCategory = (typeof FAKE_STORE_CATEGORIES)[number];

export async function getFakeStoreProductsByCategory(
	category: FakeStoreCategory,
): Promise<IProduct[]> {
	try {
		const data = await fetchJSON<FakeStoreProduct[]>(
			`https://fakestoreapi.com/products/category/${encodeURIComponent(
				category,
			)}`,
		);

		return data.map(mapFakeStoreToProduct);
	} catch (error) {
		console.error(`Error fetching products for category "${category}":`, error);
		throw new Error(
			`Failed to fetch products from Fake Store API for category "${category}"`,
		);
	}
}

export async function getAllFakeStoreProducts(): Promise<IProduct[]> {
	try {
		const productPromises = FAKE_STORE_CATEGORIES.map((category) =>
			getFakeStoreProductsByCategory(category),
		);

		const productsArrays = await Promise.all(productPromises);
		return productsArrays.flat();
	} catch (error) {
		console.error("Error fetching all Fake Store products:", error);
		throw new Error("Failed to fetch products from Fake Store API");
	}
}

function mapFakeStoreToProduct(item: FakeStoreProduct): IProduct {
	return {
		uuid: item.id,
		title: item.title,
		description: item.description,
		price: item.price,
		brand: "FakeStoreBrand",
		category: item.category,
		image: item.image,
		images: [item.image],
		rating: item.rating.rate,
		stock: 0,
		available: item.rating.count > 0,
		discount: undefined,
		dimensions: undefined,
		metadata: {
			isBrandNew: false,
			isFeatured: item.rating.rate > 4,
			isPopular: item.rating.count > 100,
		},
		createdAt: new Date(),
		tags: [item.category, "FakeStore"],
	};
}
