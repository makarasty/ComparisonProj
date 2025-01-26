export interface IProduct {
	title: string;
	description: string;
	price: number;
	brand?: string;
	category?: string;
	image: string;
	rating?: number;
	stock?: number;
	dimensions?: {
		width?: number;
		height?: number;
		depth?: number;
	};
	specifications?: {
		[key: string]: any;
	};
}
