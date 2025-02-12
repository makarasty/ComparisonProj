import { useCallback, useState, useEffect } from "react";
import { IProduct } from "../types/product";
import { fetchProducts } from "../services/productService";

export function useFetchProducts() {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [error, setError] = useState<string | null>(null);

	const loadData = useCallback(async () => {
		try {
			setError(null);
			const data = await fetchProducts();
			setProducts(data);
		} catch (e) {
			console.error(e);
			setError("Помилка при завантаженні товарів");
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return { products, setProducts, error, setError, reload: loadData };
}
