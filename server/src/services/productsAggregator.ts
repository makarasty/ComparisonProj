import { IProduct } from "../interfaces/Product";
import { getFakeStoreApiProducts } from "./fakestoreApiService";
import { getDummyJsonProducts } from "./dummyJsonService";
import { getDummyJsonSmartphones } from "./dummyJsonSmartphonesService";
import { getEscuelaJsProducts } from "./escuelajsService";
import { getBeeceptorProducts } from "./beeceptorService";

export async function getAllProducts(): Promise<IProduct[]> {
	const [
		fakeStoreApiProducts,
		dummyJsonProducts,
		dummyJsonSmartphones,
		escuelaJsProducts,
		beeceptorProducts,
	] = await Promise.all([
		getFakeStoreApiProducts(),
		getDummyJsonProducts(),
		getDummyJsonSmartphones(),
		getEscuelaJsProducts(),
		getBeeceptorProducts(),
	]);

	return [
		...fakeStoreApiProducts,
		...dummyJsonProducts,
		...dummyJsonSmartphones,
		...escuelaJsProducts,
		...beeceptorProducts,
	];
}
