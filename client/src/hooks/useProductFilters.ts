import { useMemo } from "react";
import { IProduct } from "../types/product";

interface FilterState {
	allProducts: IProduct[];
	searchTerm?: string;
	selectedCategory?: string;
	brand?: string;
	minPrice?: number | "";
	maxPrice?: number | "";
	minRating?: number | "";
}

export function useProductFilters({
	allProducts,
	searchTerm = "",
	selectedCategory = "",
	brand = "",
	minPrice = "",
	maxPrice = "",
	minRating = "",
}: FilterState) {
	const categoryCountMap = useMemo(() => {
		const map: Record<string, number> = {};
		allProducts.forEach((p) => {
			const cat = p.category || "NOCAT";
			if (!map[cat]) map[cat] = 0;
			map[cat]++;
		});
		return map;
	}, [allProducts]);

	const filteredProducts = useMemo(() => {
		return allProducts.filter((p) => {
			if (searchTerm) {
				const term = searchTerm.toLowerCase();
				const title = p.title?.toLowerCase() || "";
				const desc = p.description?.toLowerCase() || "";
				if (!title.includes(term) && !desc.includes(term)) return false;
			}

			if (selectedCategory === "Інше") {
				const cat = p.category || "NOCAT";
				if (categoryCountMap[cat] && categoryCountMap[cat] > 3) {
					return false;
				}
			} else if (selectedCategory && p.category !== selectedCategory) {
				return false;
			}

			if (brand && p.brand !== brand) {
				return false;
			}

			if (minPrice !== "" && p.price < minPrice) return false;
			if (maxPrice !== "" && p.price > maxPrice) return false;

			if (minRating !== "" && p.rating < minRating) return false;

			return true;
		});
	}, [
		allProducts,
		searchTerm,
		selectedCategory,
		brand,
		minPrice,
		maxPrice,
		minRating,
		categoryCountMap,
	]);

	return filteredProducts;
}
