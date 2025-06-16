import { IProduct } from "../interfaces/IProduct";
import DummyJsonAdapter from "./adapters/DummyJsonAdapter";
import FakeStoreAdapter from "./adapters/FakeStoreAdapter";
import FakeAdapter from "./adapters/FakeAdapter";
import { IProductProvider } from "../interfaces/IProductProvider";

export class ProductAggregatorService {
	private providers: IProductProvider[];

	constructor() {
		this.providers = [new DummyJsonAdapter(), new FakeStoreAdapter(), new FakeAdapter()];
	}

	public async getAllProducts(): Promise<IProduct[]> {
		const results = await Promise.all(
			this.providers.map((provider) => provider.getProducts()),
		);

		return results.flat();
	}
}

export default new ProductAggregatorService();
