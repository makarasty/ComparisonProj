import { fetchJSON } from "../../utils/fetchJSON";
import { IProduct } from "../../interfaces/Product";

interface DummyJsonCategoryResponse {
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
	discountPercentage?: number;
}

const AVAILABLE_CATEGORIES = [
	"smartphones",
	"laptops",
	"motorcycle",
	"vehicle",
] as const;

type ProductCategory = (typeof AVAILABLE_CATEGORIES)[number];

export async function getDummyJsonProductsByCategory(
	category: ProductCategory,
): Promise<IProduct[]> {
	const data = await fetchJSON<DummyJsonCategoryResponse>(
		`https://dummyjson.com/products/category/${category}`,
	);

	return data.products.map(mapDummyJsonToProduct);
}

export async function getAllDummyJsonProducts(): Promise<IProduct[]> {
	try {
		const productPromises = AVAILABLE_CATEGORIES.map((category) =>
			getDummyJsonProductsByCategory(category),
		);

		const productsArrays = await Promise.all(productPromises);
		return productsArrays.flat();
	} catch (error) {
		console.error("Error fetching all products:", error);
		throw new Error("Failed to fetch products from all categories");
	}
}

function mapDummyJsonToProduct(item: DummyJsonProduct): IProduct {
	return {
		uuid: item.id,
		title: item.title,
		description: item.description,
		price: item.price,
		brand: item.brand,
		category: item.category,
		image: item.thumbnail,
		images: item.images,
		rating: item.rating,
		stock: item.stock,
		available: item.stock > 0,
		discount: item.discountPercentage,
		dimensions: undefined,
		metadata: {
			isNew: false,
			isFeatured: item.rating > 4.5,
			isPopular: item.stock < 50,
		},
		createdAt: new Date(),
		tags: [item.category, item.brand],
	};
}
