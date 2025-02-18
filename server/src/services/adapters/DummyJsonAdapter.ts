import { IProductProvider } from "../../interfaces/IProductProvider";
import { IProduct } from "../../interfaces/IProduct";
import { getAllDummyJsonProducts } from "../api/dummyJsonService";

export class DummyJsonAdapter implements IProductProvider {
	async getProducts(): Promise<IProduct[]> {
		return getAllDummyJsonProducts();
	}
}

export default DummyJsonAdapter;
