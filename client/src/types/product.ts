export interface IProduct {
	_id?: string;
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
		isNew?: boolean;
		isFeatured?: boolean;
		isPopular?: boolean;
	};
}
