import { IProduct } from "../interfaces/Product";

//import { getFakeStoreApiProducts } from "./api/trash/fakestoreApiService";
//import { getEscuelaJsProducts } from "./api/trash/escuelajsService";
//import { getBeeceptorProducts } from "./api/trash/beeceptorService";
import { getAllDummyJsonProducts } from "./api/dummyJsonService";
import { getAllFakeStoreProducts } from "./api/fakestoreApiService";
import { getAllEbayProducts } from "./api/ebayService";

export async function getAllProducts(): Promise<IProduct[]> {
	const [dummyJsonProducts, fakeStoreProducts, ebayProducts] =
		await Promise.all([
			getAllDummyJsonProducts(),
			getAllFakeStoreProducts(),
			getAllEbayProducts(),
		]);

	console.log(ebayProducts);

	return [...dummyJsonProducts, ...fakeStoreProducts, ...ebayProducts];
}
