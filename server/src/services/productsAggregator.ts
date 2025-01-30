import { IProduct } from "../interfaces/Product";

//import { getFakeStoreApiProducts } from "./api/trash/fakestoreApiService";
//import { getEscuelaJsProducts } from "./api/trash/escuelajsService";
//import { getBeeceptorProducts } from "./api/trash/beeceptorService";
import { getAllDummyJsonProducts } from "./api/dummyJsonService";
import { getAllFakeStoreProducts } from "./api/fakestoreApiService";

export async function getAllProducts(): Promise<IProduct[]> {
	const [dummyJsonProducts, fakeStoreProducts] = await Promise.all([
		getAllDummyJsonProducts(),
		getAllFakeStoreProducts(),
	]);

	return [...dummyJsonProducts, ...fakeStoreProducts];
}
