export interface IProduct {
	uuid: number;
	title: string;
	description: string;
	price: number;
	brand: string;
	category: string;
	image: string;
	images: string[];
	rating: number;
	stock: number;
	discount?: number;
	available: boolean;
	tags?: string[];
	dimensions?: {
		width: number;
		height: number;
		depth: number;
		weight?: number;
		unit?: string;
	};
	specifications?: Record<string, unknown>;
	createdAt?: Date;
	updatedAt?: Date;
	warranty?: {
		period: number;
		unit: "days" | "months" | "years";
		description?: string;
	};
	metadata?: {
		isBrandNew?: boolean;
		isFeatured?: boolean;
		isPopular?: boolean;
	};
}
