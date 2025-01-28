import React, { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import {
	Container,
	Typography,
	Box,
	Card,
	CardMedia,
	CardContent,
	Button,
	Chip,
	Rating,
	TextField,
	Select,
	MenuItem,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableContainer,
	Fab,
	Zoom,
	IconButton,
	CssBaseline,
	Tooltip,
	Alert,
	Grid,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
	createTheme,
	ThemeProvider,
	alpha,
	useTheme,
} from "@mui/material/styles";

////////////////////////////////////////////////////////
// Interfaces
////////////////////////////////////////////////////////

export interface IProduct {
	uuid: number;
	title: string;
	description: string;
	price: number;
	brand: string;
	category: string;
	image: string;
	images: string[];
	rating: number;
	stock: number;
	discount?: number;
	available: boolean;
	tags?: string[];
	dimensions?: {
		width: number;
		height: number;
		depth: number;
		weight?: number;
		unit?: string;
	};
	specifications?: Record<string, unknown>;
	createdAt?: Date;
	updatedAt?: Date;
	warranty?: {
		period: number;
		unit: "days" | "months" | "years";
		description?: string;
	};
	metadata?: {
		isNew?: boolean;
		isFeatured?: boolean;
		isPopular?: boolean;
	};
}

////////////////////////////////////////////////////////
// API and helpers
////////////////////////////////////////////////////////

const API_URL = "http://localhost:5305/api/devices";

function extractFirstLink(str: string): string | null {
	const regex = /https?:\/\/[^,"']+|\/[^,"']+/;
	const match = str.match(regex);
	return match ? match[0] : null;
}

async function fetchProducts(): Promise<IProduct[]> {
	try {
		const resp = await axios.get<{ data: IProduct[] }>(API_URL);
		return resp.data.data.map((product) => ({
			...product,
			image: extractFirstLink(product.image) || "/images/unknown.jpg",
		}));
	} catch (e) {
		console.error("Error fetching products:", e);
		throw e;
	}
}

async function seedProducts() {
	try {
		await axios.get(`${API_URL}/seed/devices`);
	} catch (e) {
		console.error("Error seeding products:", e);
		throw e;
	}
}

function isNumeric<T>(v: T): v is T extends number ? T : never {
	return typeof v === "number" && !isNaN(v);
}

////////////////////////////////////////////////////////
// Comparison Table
////////////////////////////////////////////////////////
interface CompareTableProps {
	products: IProduct[];
	onRemove: (uuid: number) => void;
	onClearAll: () => void;
}

const MAX_COMPARE_ITEMS = 4;

const universalFields = [
	"image",
	"title",
	"brand",
	"category",
	"price",
	"rating",
];

const numericPreferences: Record<string, "min" | "max"> = {
	price: "min",
	rating: "max",
};

function getUniversalValue(prod: IProduct, field: string): unknown {
	switch (field) {
		case "image":
			return prod.image || "-";
		case "title":
			return prod.title || "-";
		case "brand":
			return prod.brand || "-";
		case "category":
			return prod.category || "-";
		case "price":
			return prod.price;
		case "rating":
			return prod.rating;
		default:
			return "-";
	}
}

const CompareTable: React.FC<CompareTableProps> = ({
	products,
	onRemove,
	onClearAll,
}) => {
	const theme = useTheme();

	if (!products.length) return null;

	const allFields = new Set<string>(universalFields);
	products.forEach((p) => {
		Object.keys(p.specifications || {}).forEach((key) => allFields.add(key));
	});
	const fieldList = Array.from(allFields);

	const valuesByProduct: Record<number, Record<string, unknown>> = {};
	products.forEach((p) => {
		const map: Record<string, unknown> = {};
		fieldList.forEach((field) => {
			if (universalFields.includes(field)) {
				map[field] = getUniversalValue(p, field);
			} else {
				map[field] = p.specifications?.[field] ?? "-";
			}
		});
		valuesByProduct[p.uuid] = map;
	});

	const bestValues: Record<string, number> = {};
	fieldList.forEach((field) => {
		let best =
			numericPreferences[field] === "min"
				? Number.POSITIVE_INFINITY
				: Number.NEGATIVE_INFINITY;

		products.forEach((p) => {
			const val = valuesByProduct[p.uuid][field];
			if (isNumeric(val)) {
				if (numericPreferences[field] === "min") {
					if (val < best) best = val;
				} else {
					if (val > best) best = val;
				}
			}
		});

		if (
			best !== Number.POSITIVE_INFINITY &&
			best !== Number.NEGATIVE_INFINITY
		) {
			bestValues[field] = best;
		}
	});

	const winsCount: Record<number, number> = {};
	products.forEach((p) => {
		winsCount[p.uuid] = 0;
	});

	fieldList.forEach((field) => {
		if (bestValues[field] !== undefined) {
			products.forEach((p) => {
				const val = valuesByProduct[p.uuid][field];
				if (isNumeric(val) && val === bestValues[field]) {
					winsCount[p.uuid] += 1;
				}
			});
		}
	});

	const columnStyles = products.map((_, index) => {
		const isEven = index % 2 === 0;
		return {
			backgroundColor: isEven
				? theme.palette.mode === "dark"
					? theme.palette.grey[900]
					: theme.palette.grey[100]
				: theme.palette.mode === "dark"
				? theme.palette.grey[800]
				: theme.palette.grey[200],
			color: theme.palette.text.primary,
		};
	});

	return (
		<Box sx={{ mt: 6, overflowX: "auto" }}>
			<Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
				<Typography variant="h5" fontWeight="bold">
					Порівняння
				</Typography>
				<Button variant="outlined" color="error" onClick={onClearAll}>
					Очистити все
				</Button>
			</Box>
			<TableContainer
				component={Paper}
				elevation={3}
				sx={{ borderRadius: 2, minWidth: 800, overflowX: "auto" }}
			>
				<Table stickyHeader sx={{ tableLayout: "fixed", minWidth: 800 }}>
					<TableHead>
						<TableRow
							sx={{
								backgroundColor:
									theme.palette.mode === "dark"
										? theme.palette.primary.dark
										: theme.palette.primary.main,
							}}
						>
							<TableCell
								sx={{
									position: "sticky",
									left: 0,
									width: "200px",
									minWidth: "200px",
									backgroundColor:
										theme.palette.mode === "dark"
											? theme.palette.primary.dark
											: theme.palette.primary.main,
									color: theme.palette.common.white,
									fontWeight: 600,
									fontSize: "1rem",
									border: "none",
									whiteSpace: "nowrap",
									zIndex: 3,
								}}
							>
								Властивість
							</TableCell>
							{products.map((p, idx) => {
								const colStyle = columnStyles[idx];
								return (
									<TableCell
										key={p.uuid}
										sx={{
											...colStyle,
											fontWeight: 600,
											fontSize: "1rem",
											borderLeft: `1px solid ${alpha(
												theme.palette.common.white,
												0.2,
											)}`,
											whiteSpace: "nowrap",
										}}
									>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												gap: 1,
											}}
										>
											<Tooltip title={p.title}>
												<Typography
													sx={{
														color: colStyle.color,
														whiteSpace: "nowrap",
														overflow: "hidden",
														textOverflow: "ellipsis",
														flexGrow: 1,
														mr: 1,
													}}
													noWrap
												>
													{p.title}
												</Typography>
											</Tooltip>
											<Button
												size="small"
												variant="outlined"
												onClick={() => onRemove(p.uuid)}
												sx={{
													minWidth: 30,
													borderColor: theme.palette.error.main,
													color: theme.palette.error.main,
													"&:hover": {
														borderColor: theme.palette.error.dark,
														backgroundColor: alpha(
															theme.palette.error.dark,
															0.1,
														),
													},
												}}
											>
												✕
											</Button>
										</Box>
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{fieldList.map((field) => (
							<TableRow key={field}>
								<TableCell
									sx={{
										position: "sticky",
										left: 0,
										width: "200px",
										minWidth: "200px",
										backgroundColor:
											theme.palette.mode === "dark"
												? theme.palette.grey[800]
												: theme.palette.grey[200],
										color: theme.palette.text.primary,
										fontWeight: 600,
										whiteSpace: "nowrap",
										zIndex: 2,
									}}
								>
									{field}
								</TableCell>
								{products.map((p, idx) => {
									const val = valuesByProduct[p.uuid][field];
									const numericVal = isNumeric(val) ? val : null;
									const bestVal = bestValues[field];
									const isBest =
										numericVal !== null &&
										bestVal !== undefined &&
										numericVal === bestVal;
									const colStyle = columnStyles[idx];
									const highlightBg = isBest
										? alpha(theme.palette.warning.main, 0.3)
										: colStyle.backgroundColor;

									if (field === "image") {
										return (
											<TableCell
												key={p.uuid}
												sx={{
													...colStyle,
													backgroundColor: highlightBg,
													textAlign: "center",
													overflow: "hidden",
												}}
											>
												{val !== "-" ? (
													<img
														src={String(val)}
														alt={p.title}
														style={{
															maxWidth: "100px",
															maxHeight: "100px",
															objectFit: "contain",
														}}
													/>
												) : (
													"-"
												)}
											</TableCell>
										);
									}

									return (
										<TableCell
											key={p.uuid}
											sx={{
												...colStyle,
												backgroundColor: highlightBg,
												verticalAlign: "middle",
												wordBreak: "break-word",
												padding: "8px",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{typeof val === "string" && val.length > 50 ? (
												<Tooltip title={val}>
													<span>{val.slice(0, 50)}...</span>
												</Tooltip>
											) : (
												String(val)
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))}
						<TableRow>
							<TableCell
								sx={{
									position: "sticky",
									left: 0,
									width: "200px",
									minWidth: "200px",
									backgroundColor:
										theme.palette.mode === "dark"
											? theme.palette.grey[800]
											: theme.palette.grey[200],
									color: theme.palette.text.primary,
									fontWeight: 700,
									whiteSpace: "nowrap",
									zIndex: 2,
								}}
							>
								Перемоги
							</TableCell>
							{products.map((p, idx) => {
								const colStyle = columnStyles[idx];
								return (
									<TableCell
										key={p.uuid}
										sx={{
											...colStyle,
											fontWeight: 700,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{winsCount[p.uuid]}
									</TableCell>
								);
							})}
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

////////////////////////////////////////////////////////
// Main App
////////////////////////////////////////////////////////

const App: React.FC = () => {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [compareList, setCompareList] = useState<IProduct[]>([]);

	const [category, setCategory] = useState("");
	const [minPrice, setMinPrice] = useState<number | "">("");
	const [maxPrice, setMaxPrice] = useState<number | "">("");
	const [brand, setBrand] = useState("");
	const [minRating, setMinRating] = useState<number | "">("");

	const [showScrollUp, setShowScrollUp] = useState(false);
	const [showScrollDown, setShowScrollDown] = useState(false);
	const [darkMode, setDarkMode] = useState(false);

	const [error, setError] = useState<string | null>(null);

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

	const loadData = useCallback(async () => {
		try {
			const data = await fetchProducts();
			setProducts(data);
			setError(null);
		} catch (e) {
			console.error(e);
			setError("Не вдалося завантажити продукти. Спробуйте пізніше.");
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
			if (compareList.some((p) => p.uuid === product.uuid)) {
				setCompareList((prev) => prev.filter((p) => p.uuid !== product.uuid));
			} else {
				if (compareList.length >= MAX_COMPARE_ITEMS) {
					alert(`Можна порівняти максимум ${MAX_COMPARE_ITEMS} товарів.`);
					return;
				}
				setCompareList((prev) => [...prev, product]);
			}
		},
		[compareList],
	);

	const handleRemoveFromCompare = useCallback((uuid: number) => {
		setCompareList((prev) => prev.filter((p) => p.uuid !== uuid));
	}, []);

	const handleClearAllCompare = useCallback(() => {
		setCompareList([]);
	}, []);

	const handleSeed = useCallback(async () => {
		try {
			await seedProducts();
			await loadData();
			alert("База даних заповнена демонстраційними даними!");
		} catch (e) {
			console.error(e);
			alert("Помилка при заповненні бази даних.");
		}
	}, [loadData]);

	const handleFilter = useCallback(async () => {
		try {
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
			setError(null);
		} catch (e) {
			console.error(e);
			setError("Помилка при фільтрації продуктів.");
		}
	}, [category, brand, minPrice, maxPrice, minRating, loadData]);

	const resetFilters = useCallback(async () => {
		setCategory("");
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		setMinRating("");
		try {
			await loadData();
			setError(null);
		} catch (e) {
			console.error(e);
			setError("Не вдалося скинути фільтри.");
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

	const renderProductCard = (prod: IProduct) => {
		const inCompare = compareList.some((p) => p.uuid === prod.uuid);
		const buttonLabel = inCompare
			? "Видалити з порівняння"
			: "Додати до порівняння";

		return (
			<Grid item xs={12} sm={6} md={4} key={prod.uuid}>
				<Card
					sx={{
						height: "100%",
						display: "flex",
						flexDirection: "column",
						transition: "transform 0.3s",
						borderRadius: 2,
						"&:hover": { transform: "scale(1.01)" },
					}}
					elevation={4}
				>
					<CardMedia
						component="img"
						height="200"
						image={prod.image}
						alt={prod.title}
						sx={{ objectFit: "contain", bgcolor: "background.default" }}
					/>
					<CardContent sx={{ flexGrow: 1 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 1,
							}}
						>
							<Tooltip title={prod.title}>
								<Typography variant="h6" noWrap>
									{prod.title}
								</Typography>
							</Tooltip>
							{prod.category && (
								<Chip label={prod.category} size="small" color="primary" />
							)}
						</Box>
						<Typography variant="body2" color="text.secondary">
							{prod.description.length > 60
								? `${prod.description.slice(0, 60)}...`
								: prod.description}
						</Typography>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mt: 2,
							}}
						>
							<Typography variant="subtitle1" color="primary">
								${prod.price}
							</Typography>
							<Rating value={prod.rating} precision={0.5} readOnly />
						</Box>
					</CardContent>
					<Box sx={{ p: 2 }}>
						<Button
							fullWidth
							variant="contained"
							color={inCompare ? "primary" : "secondary"}
							onClick={() => toggleCompare(prod)}
							disabled={!inCompare && compareList.length >= MAX_COMPARE_ITEMS}
						>
							{buttonLabel}
						</Button>
						{!inCompare && compareList.length >= MAX_COMPARE_ITEMS && (
							<Tooltip
								title={`Максимум ${MAX_COMPARE_ITEMS} товарів для порівняння`}
							>
								<span style={{ color: "red", fontSize: "0.8rem" }}>
									Максимум досягнуто
								</span>
							</Tooltip>
						)}
					</Box>
				</Card>
			</Grid>
		);
	};

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
							Технічний магазин
						</Typography>
						<IconButton color="inherit" onClick={() => setDarkMode((x) => !x)}>
							{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
						</IconButton>
					</Box>
					{error && (
						<Alert severity="error" sx={{ mb: 3 }}>
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
						{products.map(renderProductCard)}
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
