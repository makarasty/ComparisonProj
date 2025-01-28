import { fetchJSON } from "../../../utils/fetchJSON";
import { IProduct } from "../../../interfaces/Product";

interface EscuelaJsProduct {
	id: number;
	title: string;
	price: number;
	description: string;
	images: string[];
	category: {
		id: number;
		name: string;
		image: string;
	};
}

//export async function getEscuelaJsProducts(): Promise<IProduct[]> {
	//const data = await fetchJSON<EscuelaJsProduct[]>(
		//"https://api.escuelajs.co/api/v1/products",
	//);
//
	//return data.map((item) => ({
		//id: item.id,
		//title: item.title,
		//description: item.description,
		//price: item.price,
		//brand: undefined,
		//category: item.category?.name || undefined,
		//image: item.images?.[0] || "",
		//rating: undefined,
		//stock: undefined,
		//dimensions: undefined,
	//}));
//}
