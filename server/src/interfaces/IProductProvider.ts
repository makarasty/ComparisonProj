import { IProduct } from "./IProduct";

export interface IProductProvider {
	getProducts(): Promise<IProduct[]>;
}
