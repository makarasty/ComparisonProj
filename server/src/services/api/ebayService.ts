import { fetchJSON } from "../../utils/fetchJSON";
import { IProduct } from "../../interfaces/Product";

const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID; // App ID (Client ID)
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET; // Cert ID (Client Secret)

const EBAY_OAUTH_ENDPOINT =
	"https://api.sandbox.ebay.com/identity/v1/oauth2/token";

const EBAY_BROWSE_SEARCH_ENDPOINT =
	"https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search";

const EBAY_OAUTH_SCOPE = "https://api.ebay.com/oauth/api_scope";

let cachedEbayToken: {
	accessToken: string;
	expiryDate: number;
} | null = null;

export async function getEbayAccessToken(): Promise<string> {
	try {
		if (cachedEbayToken && Date.now() < cachedEbayToken.expiryDate) {
			return cachedEbayToken.accessToken;
		}

		const authString = `${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`;
		const basicAuth = Buffer.from(authString).toString("base64");

		const params = new URLSearchParams();
		params.append("grant_type", "client_credentials");
		params.append("scope", EBAY_OAUTH_SCOPE);

		const response = await fetch(EBAY_OAUTH_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${basicAuth}`,
			},
			body: params.toString(),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Error obtaining eBay token: ${response.status} ${response.statusText}\n${errorText}`,
			);
		}

		interface EbayTokenResponse {
			access_token: string;
			expires_in: number;
			token_type: string;
		}

		const data = (await response.json()) as EbayTokenResponse;

		const expiresInMs = data.expires_in * 1000;
		cachedEbayToken = {
			accessToken: data.access_token,
			expiryDate: Date.now() + expiresInMs,
		};

		return data.access_token;
	} catch (error) {
		console.error("getEbayAccessToken error:", error);
		throw error;
	}
}

interface EbayItemSummary {
	itemId: string;
	title: string;
	categoryId: string;
	shortDescription?: string;
	price?: {
		value: string;
		currency: string;
	};
	image?: {
		imageUrl?: string;
	};
	brand?: string;
	condition?: string;
}

interface EbaySearchResponse {
	total?: number;
	itemSummaries?: EbayItemSummary[];
	next?: string;
	limit?: number;
	offset?: number;
	href?: string;
}

const EBAY_CATEGORIES = ["9355"] as const;
type EbayCategory = (typeof EBAY_CATEGORIES)[number];

export async function getEbayProductsByCategory(
	category: EbayCategory,
): Promise<IProduct[]> {
	try {
		const token = await getEbayAccessToken();

		const url = new URL(EBAY_BROWSE_SEARCH_ENDPOINT);
		url.searchParams.set("limit", "100");
		url.searchParams.set("category_ids", category);
		url.searchParams.set("sort", "newlyListed");
		url.searchParams.set("offset", "0");

		console.log(url.toString());

		const data = await fetchJSON<EbaySearchResponse>(url.toString(), {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		console.log(data);

		const items = data.itemSummaries || [];

		return items.map(mapEbayItemToProduct);
	} catch (error) {
		console.error(
			`Error fetching products for eBay category "${category}":`,
			error,
		);
		throw new Error(
			`Failed to fetch products from eBay for category "${category}"`,
		);
	}
}

export async function getAllEbayProducts(): Promise<IProduct[]> {
	try {
		const productPromises = EBAY_CATEGORIES.map((cat) =>
			getEbayProductsByCategory(cat),
		);

		const productsArrays = await Promise.all(productPromises);

		return productsArrays.flat();
	} catch (error) {
		console.error("Error fetching all eBay products:", error);
		throw new Error("Failed to fetch products from eBay API");
	}
}

function mapEbayItemToProduct(item: EbayItemSummary): IProduct {
	const priceValue = item.price?.value ? parseFloat(item.price.value) : 0;

	const numericId = parseInt(item.itemId.replace(/\D+/g, ""), 10);

	return {
		uuid: Number.isNaN(numericId) ? Date.now() : numericId,
		title: item.title,
		description: item.shortDescription || "",
		price: priceValue,
		brand: item.brand || "Unknown",
		category: item.categoryId,
		image: item.image?.imageUrl || "",
		images: item.image?.imageUrl ? [item.image.imageUrl] : [],
		rating: 0,
		stock: 0,
		available: true,
		discount: undefined,
		dimensions: undefined,
		tags: [item.condition || "unknown condition", "ebaySandbox"],
		createdAt: new Date(),
		metadata: {
			isNew: item.condition?.toLowerCase().includes("new") ?? false,
			isFeatured: false,
			isPopular: false,
		},
	};
}
