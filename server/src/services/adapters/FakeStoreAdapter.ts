import { IProductProvider } from "../../interfaces/IProductProvider";
import { IProduct } from "../../interfaces/IProduct";
import { getAllFakeStoreProducts } from "../api/fakeStoreApiService";

export class FakeStoreAdapter implements IProductProvider {
	async getProducts(): Promise<IProduct[]> {
		return getAllFakeStoreProducts();
	}
}

export default FakeStoreAdapter;
