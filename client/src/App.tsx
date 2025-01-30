import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
	Container,
	Typography,
	Box,
	Button,
	TextField,
	Select,
	MenuItem,
	Fab,
	Zoom,
	IconButton,
	CssBaseline,
	Alert,
	Grid,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { IProduct } from "./types/product";
import { fetchProducts, seedProducts } from "./services/productService";

import CompareTable from "./components/CompareTable";
import ProductCard from "./components/ProductCard";

const MAX_COMPARE_ITEMS = 4;

const App: React.FC = () => {
	const [products, setProducts] = useState<IProduct[]>([]);

	const [compareUuids, setCompareUuids] = useState<number[]>(() => {
		try {
			const data = localStorage.getItem("compareList");
			return data ? JSON.parse(data) : [];
		} catch {
			return [];
		}
	});

	const [darkMode, setDarkMode] = useState<boolean>(() => {
		try {
			const storedTheme = localStorage.getItem("darkMode");
			return storedTheme ? JSON.parse(storedTheme) : false;
		} catch {
			return false;
		}
	});

	const [category, setCategory] = useState("");
	const [minPrice, setMinPrice] = useState<number | "">("");
	const [maxPrice, setMaxPrice] = useState<number | "">("");
	const [brand, setBrand] = useState("");
	const [minRating, setMinRating] = useState<number | "">("");

	const [showScrollUp, setShowScrollUp] = useState(false);
	const [showScrollDown, setShowScrollDown] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: darkMode ? "dark" : "light",
					primary: { main: "#1976d2" },
					secondary: { main: "#ff9800" },
					success: { main: "#2e7d32" },
					info: { main: "#0288d1" },
					warning: { main: "#ffeb3b" },
					error: { main: "#d32f2f" },
					background: {
						default: darkMode ? "#121212" : "#f6f9fc",
						paper: darkMode ? "#1e1e1e" : "#ffffff",
					},
					text: {
						primary: darkMode ? "#ffffff" : "#333333",
					},
				},
			}),
		[darkMode],
	);

	const compareList = useMemo(() => {
		return products.filter((p) => compareUuids.includes(p.uuid));
	}, [products, compareUuids]);

	useEffect(() => {
		localStorage.setItem("compareList", JSON.stringify(compareUuids));
	}, [compareUuids]);

	useEffect(() => {
		localStorage.setItem("darkMode", JSON.stringify(darkMode));
	}, [darkMode]);

	const loadData = useCallback(async () => {
		try {
			const data = await fetchProducts();

			if (!data || data.length === 0) {
				throw new Error("Немає даних");
			}

			setProducts(data);

			setError(null);
		} catch (e: unknown) {
			console.error(e);
			setError(
				"Сталася помилка при завантаженні продуктів. Спробуйте пізніше або перевірте з'єднання.",
			);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

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

	const toggleCompare = useCallback(
		(product: IProduct) => {
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

	const handleSeed = useCallback(async () => {
		try {
			setSuccess(null);
			await seedProducts();

			setSuccess("База даних успішно заповнена демонстраційними даними!");

			await loadData();
		} catch (e) {
			console.error(e);
			setError("Сталася помилка при заповненні бази даних. Спробуйте пізніше.");
		}
	}, [loadData]);

	const handleFilter = useCallback(async () => {
		try {
			setSuccess(null);

			await loadData();

			setProducts((prev) =>
				prev.filter((p) => {
					if (category && p.category !== category) return false;
					if (brand && p.brand !== brand) return false;
					if (minPrice !== "" && p.price < minPrice) return false;
					if (maxPrice !== "" && p.price > maxPrice) return false;
					if (minRating !== "" && p.rating < minRating) return false;
					return true;
				}),
			);
		} catch (e) {
			console.error(e);
			setError("Сталася помилка при фільтрації продуктів. Спробуйте пізніше.");
		}
	}, [category, brand, minPrice, maxPrice, minRating, loadData]);

	const resetFilters = useCallback(async () => {
		setCategory("");
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		setMinRating("");
		setSuccess(null);

		try {
			await loadData();
		} catch (e) {
			console.error(e);
			setError("Не вдалося скинути фільтри. Будь ласка, спробуйте пізніше.");
		}
	}, [loadData]);

	const categories = useMemo(() => {
		const s = new Set<string>();
		products.forEach((p) => {
			if (p.category) s.add(p.category);
		});
		return Array.from(s);
	}, [products]);

	const brands = useMemo(() => {
		const s = new Set<string>();
		products.forEach((p) => {
			if (p.brand) s.add(p.brand);
		});
		return Array.from(s);
	}, [products]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
			>
				<Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
					<Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
						<Button variant="contained" onClick={handleSeed}>
							Заповнити базу даних
						</Button>
						<Typography variant="h4" fontWeight="bold">
							Крутий сервіс
						</Typography>
						<IconButton color="inherit" onClick={() => setDarkMode((x) => !x)}>
							{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
						</IconButton>
					</Box>

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
						<Alert
							severity="error"
							sx={{ mb: 3 }}
							onClose={() => setError(null)}
						>
							{error}
						</Alert>
					)}

					<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
						<Select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							displayEmpty
							sx={{ width: 180 }}
						>
							<MenuItem value="">Усі категорії</MenuItem>
							{categories.map((cat) => (
								<MenuItem key={cat} value={cat}>
									{cat}
								</MenuItem>
							))}
						</Select>
						<Select
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
							displayEmpty
							sx={{ width: 180 }}
						>
							<MenuItem value="">Усі бренди</MenuItem>
							{brands.map((b) => (
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
						<Button variant="outlined" onClick={resetFilters} color="secondary">
							Скинути
						</Button>
					</Box>

					<Grid container spacing={3}>
						{products.map((prod) => {
							const inCompare = compareUuids.includes(prod.uuid);
							return (
								<Grid item xs={12} sm={6} md={4} key={prod.uuid}>
									<ProductCard
										product={prod}
										inCompare={inCompare}
										toggleCompare={toggleCompare}
										compareListLength={compareList.length}
										maxCompareItems={MAX_COMPARE_ITEMS}
									/>
								</Grid>
							);
						})}
					</Grid>

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
				</Container>

				<Box
					sx={{
						textAlign: "center",
						py: 2,
						bgcolor: darkMode ? "#1c1c1c" : "#e0e0e0",
					}}
				>
					<Typography variant="body2">© 2025 MKY was here</Typography>
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default App;
