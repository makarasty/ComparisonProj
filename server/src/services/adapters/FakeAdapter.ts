import { IProduct } from "../../interfaces/IProduct";
import { IProductProvider } from "../../interfaces/IProductProvider";

const AVAILABLE_CATEGORIES = ["Кухня"] as const;

export type ProductCategory = (typeof AVAILABLE_CATEGORIES)[number];

const HARDCODED_PRODUCTS_DATA = {
	"Кухня": [
		{
			id: 1001,
			title: "Мікрохвильова піч Samsung ME83X",
			description:
				"Потужна мікрохвильова піч з грилем, об'єм 23л, потужність 800Вт",
			price: 3299,
			brand: "Samsung",
			category: "Кухня",
			stock: 25,
			rating: 4.6,
			thumbnail:
				"https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop",
			images: [
				"https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
			],
			discountPercentage: 15,
		},
		{
			id: 1002,
			title: "Кавоварка DeLonghi Magnifica S",
			description: "Автоматична кавоварка з вбудованою кавомолкою",
			price: 12499,
			brand: "DeLonghi",
			category: "Кухня",
			stock: 12,
			rating: 4.8,
			thumbnail:
				"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
			images: [
				"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&h=600&fit=crop",
			],
			discountPercentage: 10,
		},
		{
			id: 1003,
			title: "Блендер Bosch VitaMaxx",
			description: "Потужний блендер 1200Вт з комплектом насадок",
			price: 2799,
			brand: "Bosch",
			category: "Кухня",
			stock: 35,
			rating: 4.5,
			thumbnail:
				"https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
			images: [
				"https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
			],
		},
		{
			id: 1004,
			title: "Тостер Philips HD2581",
			description: "Тостер на 2 скибочки з 8 рівнями підсмажування",
			price: 899,
			brand: "Philips",
			category: "Кухня",
			stock: 45,
			rating: 4.3,
			thumbnail:
				"https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400&h=400&fit=crop",
			images: [
				"https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&h=600&fit=crop",
			],
			discountPercentage: 5,
		},
	],
};

interface HardcodedProduct {
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

interface CategoryResponse {
	products: HardcodedProduct[];
	total: number;
	skip: number;
	limit: number;
}

const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getHouseholdProductsByCategory(
	category: ProductCategory,
): Promise<IProduct[]> {
	await simulateNetworkDelay(300);

	const categoryProducts = HARDCODED_PRODUCTS_DATA[category] || [];

	const response: CategoryResponse = {
		products: categoryProducts,
		total: categoryProducts.length,
		skip: 0,
		limit: categoryProducts.length,
	};

	return response.products.map(mapHardcodedToProduct);
}

export async function getAllHouseholdProducts(): Promise<IProduct[]> {
	try {
		await simulateNetworkDelay(800);

		const productPromises = AVAILABLE_CATEGORIES.map((category) =>
			getHouseholdProductsByCategory(category),
		);

		const productsArrays = await Promise.all(productPromises);
		return productsArrays.flat();
	} catch (error) {
		console.error("Error fetching all household products:", error);
		throw new Error("Failed to fetch products from all categories");
	}
}

export async function getProductById(id: number): Promise<IProduct | null> {
	await simulateNetworkDelay(200);

	for (const category of AVAILABLE_CATEGORIES) {
		const categoryProducts = HARDCODED_PRODUCTS_DATA[category] || [];
		const product = categoryProducts.find((p) => p.id === id);
		if (product) {
			return mapHardcodedToProduct(product);
		}
	}

	return null;
}

export async function searchProducts(query: string): Promise<IProduct[]> {
	await simulateNetworkDelay(400);

	const allProducts = Object.values(HARDCODED_PRODUCTS_DATA).flat();
	const searchQuery = query.toLowerCase();

	const filteredProducts = allProducts.filter(
		(product) =>
			product.title.toLowerCase().includes(searchQuery) ||
			product.description.toLowerCase().includes(searchQuery) ||
			product.brand.toLowerCase().includes(searchQuery) ||
			product.category.toLowerCase().includes(searchQuery),
	);

	return filteredProducts.map(mapHardcodedToProduct);
}

export async function getProductsByPriceRange(
	minPrice: number,
	maxPrice: number,
): Promise<IProduct[]> {
	await simulateNetworkDelay(300);

	const allProducts = Object.values(HARDCODED_PRODUCTS_DATA).flat();
	const filteredProducts = allProducts.filter(
		(product) => product.price >= minPrice && product.price <= maxPrice,
	);

	return filteredProducts.map(mapHardcodedToProduct);
}

export async function getFeaturedProducts(): Promise<IProduct[]> {
	await simulateNetworkDelay(250);

	const allProducts = Object.values(HARDCODED_PRODUCTS_DATA).flat();
	const featuredProducts = allProducts.filter(
		(product) => product.rating >= 4.7,
	);

	return featuredProducts.map(mapHardcodedToProduct);
}

export async function getDiscountedProducts(): Promise<IProduct[]> {
	await simulateNetworkDelay(250);

	const allProducts = Object.values(HARDCODED_PRODUCTS_DATA).flat();
	const discountedProducts = allProducts.filter(
		(product) => product.discountPercentage && product.discountPercentage > 0,
	);

	return discountedProducts.map(mapHardcodedToProduct);
}

function mapHardcodedToProduct(item: HardcodedProduct): IProduct {
	const discountedPrice = item.discountPercentage
		? item.price * (1 - item.discountPercentage / 100)
		: item.price;

	return {
		uuid: item.id,
		title: item.title,
		description: item.description,
		price: Math.round(discountedPrice),
		brand: item.brand,
		category: item.category,
		image: item.thumbnail,
		images: item.images,
		rating: item.rating,
		stock: item.stock,
		available: item.stock > 0,
		discount: item.discountPercentage,
		dimensions: generateRandomDimensions(item.category),
		metadata: {
			isBrandNew: item.stock > 80,
			isFeatured: item.rating >= 4.7,
			isPopular: item.stock < 20,
		},
		createdAt: generateRandomDate(),
		tags: generateTags(item),
	};
}

function generateRandomDimensions(
	category: string,
): { width: number; height: number; depth: number } | undefined {
	const dimensionRanges: Record<
		string,
		{ w: [number, number]; h: [number, number]; d: [number, number] }
	> = {
		"Кухня": { w: [20, 60], h: [15, 45], d: [25, 50] },
		"home-appliances": { w: [50, 200], h: [80, 200], d: [50, 80] },
		furniture: { w: [80, 250], h: [70, 200], d: [40, 120] },
		electronics: { w: [30, 150], h: [20, 80], d: [5, 40] },
		tools: { w: [10, 40], h: [15, 30], d: [5, 15] },
	};

	const range = dimensionRanges[category];
	if (!range) return undefined;

	return {
		width: Math.round(Math.random() * (range.w[1] - range.w[0]) + range.w[0]),
		height: Math.round(Math.random() * (range.h[1] - range.h[0]) + range.h[0]),
		depth: Math.round(Math.random() * (range.d[1] - range.d[0]) + range.d[0]),
	};
}

function generateRandomDate(): Date {
	const start = new Date(2023, 0, 1);
	const end = new Date();
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	);
}

function generateTags(item: HardcodedProduct): string[] {
	const baseTags = [item.category, item.brand.toLowerCase()];

	const additionalTags: Record<string, string[]> = {
		"Кухня": ["кухня", "техніка", "приготування"],
		"home-appliances": ["дім", "побутова техніка", "електротехніка"],
		"cleaning-supplies": ["прибирання", "чистота", "догляд"],
		furniture: ["меблі", "інтер'єр", "дизайн"],
		electronics: ["електроніка", "розваги", "технології"],
		"bathroom-accessories": ["ванна", "аксесуари", "сантехніка"],
		tools: ["інструменти", "ремонт", "будівництво"],
		"garden-equipment": ["сад", "город", "рослини"],
		textiles: ["текстиль", "тканини", "дім"],
		lighting: ["освітлення", "світло", "декор"],
	};

	const categoryTags = additionalTags[item.category] || [];

	if (item.discountPercentage && item.discountPercentage > 0) {
		baseTags.push("знижка", "акція");
	}

	if (item.rating >= 4.7) {
		baseTags.push("топ", "рекомендовано");
	}

	return [...baseTags, ...categoryTags.slice(0, 2)];
}

export const CATEGORIES_INFO = {
	"Кухня": {
		name: "Кухонна техніка",
		description: "Техніка для приготування та зберігання їжі",
	},
	"home-appliances": {
		name: "Побутова техніка",
		description: "Великі побутові прилади для дому",
	},
	"cleaning-supplies": {
		name: "Засоби для прибирання",
		description: "Техніка та засоби для підтримання чистоти",
	},
	furniture: {
		name: "Меблі",
		description: "Меблі для дому та офісу",
	},
	electronics: {
		name: "Електроніка",
		description: "Електронні пристрої та гаджети",
	},
	"bathroom-accessories": {
		name: "Аксесуари для ванної",
		description: "Сантехніка та аксесуари для ванних кімнат",
	},
	tools: {
		name: "Інструменти",
		description: "Ручні та електричні інструменти",
	},
	"garden-equipment": {
		name: "Садова техніка",
		description: "Обладнання для саду та городу",
	},
	textiles: {
		name: "Текстиль",
		description: "Постільна білизна та домашній текстиль",
	},
	lighting: {
		name: "Освітлення",
		description: "Світильники та лампи для дому",
	},
};

export function getProductStats(): {
	totalProducts: number;
	categoriesCount: number;
	averagePrice: number;
	topBrands: string[];
} {
	const allProducts = Object.values(HARDCODED_PRODUCTS_DATA).flat();

	const totalProducts = allProducts.length;
	const categoriesCount = AVAILABLE_CATEGORIES.length;
	const averagePrice = Math.round(
		allProducts.reduce((sum, product) => sum + product.price, 0) /
			totalProducts,
	);

	const brandCounts = allProducts.reduce((acc, product) => {
		acc[product.brand] = (acc[product.brand] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const topBrands = Object.entries(brandCounts)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5)
		.map(([brand]) => brand);

	return {
		totalProducts,
		categoriesCount,
		averagePrice,
		topBrands,
	};
}

export class HouseholdProductsAdapter implements IProductProvider {
	async getProducts(): Promise<IProduct[]> {
		return getAllHouseholdProducts();
	}

	async getProductsByCategory(category: ProductCategory): Promise<IProduct[]> {
		return getHouseholdProductsByCategory(category);
	}

	async getProductById(id: number): Promise<IProduct | null> {
		return getProductById(id);
	}

	async searchProducts(query: string): Promise<IProduct[]> {
		return searchProducts(query);
	}

	async getProductsByPriceRange(
		minPrice: number,
		maxPrice: number,
	): Promise<IProduct[]> {
		return getProductsByPriceRange(minPrice, maxPrice);
	}

	async getFeaturedProducts(): Promise<IProduct[]> {
		return getFeaturedProducts();
	}

	async getDiscountedProducts(): Promise<IProduct[]> {
		return getDiscountedProducts();
	}

	getAvailableCategories(): readonly ProductCategory[] {
		return AVAILABLE_CATEGORIES;
	}

	getCategoriesInfo() {
		return CATEGORIES_INFO;
	}

	getProductStats() {
		return getProductStats();
	}
}

export default HouseholdProductsAdapter;
