export type DeviceCategory =
	| "sofa"
	| "fridge"
	| "tv"
	| "graphics-card"
	| "smartphone"
	| "laptop"
	| "other";

export interface IDevice {
	_id?: string;
	name: string;
	category: DeviceCategory;
	brand?: string;
	specifications: Record<string, any>;
	rating?: number;
	createdAt?: string;
	updatedAt?: string;
}
