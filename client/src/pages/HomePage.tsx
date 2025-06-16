import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
	Typography,
	Box,
	TextField,
	Select,
	MenuItem,
	Grid,
	Button,
	Alert,
	Fab,
	Zoom,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { IProduct } from "../types/product";
import CompareTable from "../components/CompareTable";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";

import { useFetchProducts } from "../hooks/useFetchProducts";
import { useScrollToTopOnMessages } from "../hooks/useScrollToTopOnMessages";
import { useProductFilters } from "../hooks/useProductFilters";

const MAX_COMPARE_ITEMS = 4;

const HomePage: React.FC = () => {
	const { products, error, setError } = useFetchProducts();
	const [success, setSuccess] = useState<string | null>(null);
	useScrollToTopOnMessages(success, error);

	const [compareUuids, setCompareUuids] = useState<number[]>(() => {
		try {
			const data = localStorage.getItem("compareList");
			return data ? JSON.parse(data) : [];
		} catch {
			return [];
		}
	});

	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [brand, setBrand] = useState<string>("");
	const [minPrice, setMinPrice] = useState<number | "">("");
	const [maxPrice, setMaxPrice] = useState<number | "">("");
	const [minRating, setMinRating] = useState<number | "">("");

	const [showScrollUp, setShowScrollUp] = useState(false);
	const [showScrollDown, setShowScrollDown] = useState(false);

	useEffect(() => {
		function handleScroll() {
			const st = window.pageYOffset || document.documentElement.scrollTop;
			const wh = window.innerHeight;
			const dh = document.documentElement.scrollHeight;
			setShowScrollUp(st > 250);
			setShowScrollDown(st + wh < dh - 100);
		}
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const scrollToBottom = useCallback(() => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
	}, []);

	useEffect(() => {
		localStorage.setItem("compareList", JSON.stringify(compareUuids));
	}, [compareUuids]);

	const toggleCompare = useCallback(
		(product: IProduct) => {
			if (!product.uuid) return;
			if (compareUuids.includes(product.uuid)) {
				setCompareUuids((prev) => prev.filter((id) => id !== product.uuid));
			} else {
				if (compareUuids.length >= MAX_COMPARE_ITEMS) {
					alert(`Можна порівняти максимум ${MAX_COMPARE_ITEMS} товарів.`);
					return;
				}
				setCompareUuids((prev) => [...prev, product.uuid]);
			}
		},
		[compareUuids],
	);

	const handleRemoveFromCompare = useCallback((uuid: number) => {
		setCompareUuids((prev) => prev.filter((id) => id !== uuid));
	}, []);

	const handleClearAllCompare = useCallback(() => {
		setCompareUuids([]);
	}, []);

	const categories = useMemo(() => {
		const categoryMap: Record<string, IProduct[]> = {};
		products.forEach((p) => {
			const cat = p.category || "NOCAT";
			if (!categoryMap[cat]) categoryMap[cat] = [];
			categoryMap[cat].push(p);
		});

		const mainCategories: { name: string; products: IProduct[] }[] = [];
		const smallCategories: { name: string; products: IProduct[] }[] = [];

		Object.entries(categoryMap).forEach(([catName, catProducts]) => {
			if (catProducts.length > 3) {
				mainCategories.push({ name: catName, products: catProducts });
			} else {
				smallCategories.push({ name: catName, products: catProducts });
			}
		});

		function getRandomImage(catProducts: IProduct[]): string {
			const withImages = catProducts.filter((p) => p.image && p.image !== "-");
			if (!withImages.length) return "/images/unknown.jpg";
			const randIdx = Math.floor(Math.random() * withImages.length);
			return withImages[randIdx].image;
		}

		const result = mainCategories.map((c, index) => ({
			id: index + 1,
			name: c.name,
			image: getRandomImage(c.products),
		}));

		if (smallCategories.length) {
			let allSmall: IProduct[] = [];
			smallCategories.forEach((sc) => {
				allSmall = allSmall.concat(sc.products);
			});
			result.push({
				id: 999999,
				name: "Інше",
				image: getRandomImage(allSmall),
			});
		}
		return result;
	}, [products]);

	const brandOptions = useMemo(() => {
		if (!selectedCategory) {
			return Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
		} else if (selectedCategory === "Інше") {
			const smallCats: string[] = [];
			const catCount: Record<string, number> = {};
			products.forEach((p) => {
				const cat = p.category || "NOCAT";
				catCount[cat] = (catCount[cat] || 0) + 1;
			});
			Object.entries(catCount).forEach(([cat, count]) => {
				if (count <= 3) smallCats.push(cat);
			});
			return Array.from(
				new Set(
					products
						.filter((p) => smallCats.includes(p.category || "NOCAT"))
						.map((p) => p.brand)
						.filter(Boolean),
				),
			);
		} else {
			return Array.from(
				new Set(
					products
						.filter((p) => p.category === selectedCategory)
						.map((p) => p.brand)
						.filter(Boolean),
				),
			);
		}
	}, [selectedCategory, products]);

	const filteredProducts = useProductFilters({
		allProducts: products,
		selectedCategory,
		brand,
		minPrice,
		maxPrice,
		minRating,
	});

	const handleSelectCategory = (catName: string) => {
		setSelectedCategory(catName === "Інше" ? "Інше" : catName);
	};

	const handleFilter = useCallback(() => {
		setSuccess(null);
	}, []);

	const resetFiltersMain = useCallback(() => {
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		setMinRating("");
		setSuccess(null);
	}, []);

	const compareList = useMemo(() => {
		return products.filter((p) => p.uuid && compareUuids.includes(p.uuid));
	}, [products, compareUuids]);

	return (
		<Box sx={{ py: 4 }}>
			{success && (
				<Alert
					severity="success"
					sx={{ mb: 3 }}
					onClose={() => setSuccess(null)}
				>
					{success}
				</Alert>
			)}
			{error && (
				<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
					{error}
				</Alert>
			)}

			{!selectedCategory && (
				<Box sx={{ mb: 4 }}>
					<Typography variant="h4" sx={{ mb: 2 }}>
						<strong>Категорії</strong>
					</Typography>
					<Grid container spacing={2}>
						{categories.map((cat) => (
							<Grid item key={cat.id}>
								<CategoryCard
									category={cat}
									onClick={() => handleSelectCategory(cat.name)}
								/>
							</Grid>
						))}
					</Grid>
				</Box>
			)}

			{selectedCategory && (
				<>
					<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
						<Button
							variant="outlined"
							startIcon={<ArrowBackIcon />}
							onClick={() => setSelectedCategory("")}
						>
							Назад до категорій
						</Button>
					</Box>

					<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
						<Select
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
							displayEmpty
							sx={{ width: 180 }}
						>
							<MenuItem value="">Усі бренди</MenuItem>
							{brandOptions.map((b) => (
								<MenuItem key={b} value={b}>
									{b}
								</MenuItem>
							))}
						</Select>
						<TextField
							label="Мінімальна ціна"
							type="number"
							value={minPrice}
							onChange={(e) =>
								setMinPrice(e.target.value ? parseInt(e.target.value, 10) : "")
							}
						/>
						<TextField
							label="Максимальна ціна"
							type="number"
							value={maxPrice}
							onChange={(e) =>
								setMaxPrice(e.target.value ? parseInt(e.target.value, 10) : "")
							}
						/>
						<TextField
							label="Мінімальний рейтинг"
							type="number"
							value={minRating}
							onChange={(e) =>
								setMinRating(e.target.value ? parseInt(e.target.value, 10) : "")
							}
						/>
						<Button variant="outlined" onClick={handleFilter} color="primary">
							Фільтрувати
						</Button>
						<Button
							variant="outlined"
							onClick={resetFiltersMain}
							color="secondary"
						>
							Скинути
						</Button>
					</Box>

					<Grid container spacing={3} sx={{ mb: 2 }}>
						{filteredProducts.map((prod) => {
							const inCompare = prod.uuid
								? compareUuids.includes(prod.uuid)
								: false;
							return (
								<Grid item xs={12} sm={6} md={4} key={prod._id || prod.uuid}>
									<ProductCard
										product={prod}
										showCompareButton={true}
										inCompare={inCompare}
										toggleCompare={toggleCompare}
										compareListLength={compareList.length}
										maxCompareItems={MAX_COMPARE_ITEMS}
									/>
								</Grid>
							);
						})}
					</Grid>
				</>
			)}

			<CompareTable
				products={compareList}
				onRemove={handleRemoveFromCompare}
				onClearAll={handleClearAllCompare}
			/>

			<Zoom in={showScrollUp}>
				<Fab
					color="primary"
					size="small"
					onClick={scrollToTop}
					sx={{ position: "fixed", bottom: 80, right: 20, zIndex: 1000 }}
				>
					<KeyboardArrowUpIcon />
				</Fab>
			</Zoom>
			<Zoom in={showScrollDown}>
				<Fab
					color="secondary"
					size="small"
					onClick={scrollToBottom}
					sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
				>
					<KeyboardArrowDownIcon />
				</Fab>
			</Zoom>
		</Box>
	);
};

export default HomePage;
