import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
	Container,
	Typography,
	Box,
	Grid,
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
} from "@mui/material";

export interface IProduct {
	_id?: string;
	title: string;
	description: string;
	price: number;
	brand?: string;
	category?: string;
	image: string;
	rating?: number;
	stock?: number;
	dimensions?: {
		width?: number;
		height?: number;
		depth?: number;
	};
	specifications?: {
		[key: string]: unknown;
	};
	shortDescription?: string;
}

type ProductCategory = string;

const API_URL = "http://localhost:5305/api/devices";

async function fetchProducts(): Promise<IProduct[]> {
	const resp = await axios.get<{ data: IProduct[] }>(API_URL);
	const products = resp.data.data;
	return products.map((product) => ({
		...product,
		shortDescription: generateShortDescription(product),
	}));
}

async function seedProducts() {
	await axios.get(`${API_URL}/seed/devices`);
}

function generateShortDescription(product: IProduct): string {
	if (!product.specifications) {
		return product.description.slice(0, 60) + "...";
	}

	const specs = product.specifications;

	// FIXME Trash
	switch (product.category) {
		case "smartphone":
			return `${specs.screenSize || ""}" ${specs.processor || ""} ${
				specs.ram || ""
			} RAM`;
		case "laptop":
			return `${specs.processor || ""} | ${specs.ram || ""} RAM | ${
				specs.storage || ""
			}`;
		case "tv":
			return `${specs.screenSize || ""}" | ${specs.resolution || ""}`;
		case "graphics-card":
			return `${specs.chipset || ""} | ${specs.memory || ""} VRAM`;
		default:
			return product.description.slice(0, 60) + "...";
	}
}

function isNumeric<T>(value: T): value is T extends number ? T : never {
	return typeof value === "number" && !isNaN(value);
}

interface CompareTableProps {
	products: IProduct[];
	onRemove: (id: string) => void;
	onClearAll: () => void;
}

const CompareTable: React.FC<CompareTableProps> = ({
	products,
	onRemove,
	onClearAll,
}) => {
	if (products.length === 0) return null;

	const allSpecs = new Set<string>();
	products.forEach((p) => {
		if (!p.specifications) return;
		Object.keys(p.specifications).forEach((k) => allSpecs.add(k));
	});
	const specList = Array.from(allSpecs);

	// FIXME Trash
	const bestValues: Record<string, number> = {};
	specList.forEach((key) => {
		let maxVal = Number.NEGATIVE_INFINITY;
		products.forEach((p) => {
			const val = p.specifications?.[key];
			if (isNumeric(val) && val > maxVal) {
				maxVal = val;
			}
		});
		bestValues[key] = maxVal;
	});

	const winsCount: Record<string, number> = {};
	products.forEach((p) => {
		winsCount[p._id || ""] = 0;
	});
	products.forEach((p) => {
		specList.forEach((key) => {
			const val = p.specifications?.[key];
			if (isNumeric(val) && val === bestValues[key]) {
				if (p._id) winsCount[p._id] += 1;
			}
		});
	});

	return (
		<Box sx={{ mt: 4 }}>
			<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
				<Typography variant="h5">Порівняння обраних товарів</Typography>
				<Button variant="outlined" color="error" onClick={onClearAll}>
					Видалити всі
				</Button>
			</Box>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Характеристика</TableCell>
							{products.map((prod) => (
								<TableCell key={prod._id}>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Typography>{prod.title}</Typography>
										<Button
											size="small"
											variant="outlined"
											color="error"
											onClick={() => onRemove(prod._id!)}
										>
											Видалити
										</Button>
									</Box>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{specList.map((key) => (
							<TableRow key={key}>
								<TableCell>{key}</TableCell>
								{products.map((prod) => {
									const val = prod.specifications?.[key];
									const highlight = isNumeric(val) && val === bestValues[key];
									return (
										<TableCell
											key={prod._id}
											sx={{ bgcolor: highlight ? "primary.light" : "inherit" }}
										>
											{val !== undefined ? String(val) : "-"}
										</TableCell>
									);
								})}
							</TableRow>
						))}
						<TableRow>
							<TableCell>Перемог у характеристиках</TableCell>
							{products.map((prod) => (
								<TableCell key={prod._id}>
									{winsCount[prod._id || ""]}
								</TableCell>
							))}
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

const App: React.FC = () => {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [compareList, setCompareList] = useState<IProduct[]>([]);

	const [category, setCategory] = useState<ProductCategory>("");
	const [minPrice, setMinPrice] = useState<number | "">("");
	const [maxPrice, setMaxPrice] = useState<number | "">("");

	const loadData = useCallback(async () => {
		try {
			const data = await fetchProducts();
			setProducts(data);
		} catch (error) {
			console.error("Помилка завантаження:", error);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleAddToCompare = useCallback(
		(product: IProduct) => {
			setCompareList((prev) => {
				if (prev.some((p) => p._id === product._id)) {
					return prev;
				}
				if (prev.length >= 4) {
					alert("Не можна порівнювати більше 4-х товарів одночасно");
					return prev;
				}
				return [...prev, product];
			});
		},
		[setCompareList],
	);

	const handleRemoveFromCompare = useCallback((id: string) => {
		setCompareList((prev) => prev.filter((p) => p._id !== id));
	}, []);

	const handleClearAllCompare = useCallback(() => {
		setCompareList([]);
	}, []);

	const handleSeed = async () => {
		try {
			await seedProducts();
			await loadData();
			alert("Базу успішно заповнено демо-даними!");
		} catch (error) {
			alert("Помилка при заповненні бази");
			console.error(error);
		}
	};

	const handleFilter = useCallback(async () => {
		try {
			await loadData();

			setProducts((prev) =>
				prev.filter((p) => {
					if (category && p.category !== category) return false;
					const priceVal = p.price;
					if (minPrice !== "" && priceVal < minPrice) return false;
					if (maxPrice !== "" && priceVal > maxPrice) return false;
					return true;
				}),
			);
		} catch (error) {
			console.error("Помилка фільтрації:", error);
		}
	}, [category, minPrice, maxPrice, loadData]);

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
				<Button variant="contained" onClick={handleSeed}>
					Заповнити базу (Seed)
				</Button>
				<Typography variant="h4">Список товарів</Typography>
			</Box>

			<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
				<Select
					value={category}
					onChange={(e) => setCategory(e.target.value as ProductCategory)}
					displayEmpty
					sx={{ width: 180 }}
				>
					<MenuItem value="">Усі категорії</MenuItem>
					<MenuItem value="tv">TV</MenuItem>
					<MenuItem value="graphics-card">Відеокарта</MenuItem>
					<MenuItem value="smartphone">Смартфон</MenuItem>
					<MenuItem value="laptop">Ноутбук</MenuItem>
					<MenuItem value="sofa">Диван</MenuItem>
					<MenuItem value="fridge">Холодильник</MenuItem>
					<MenuItem value="other">Інше</MenuItem>
				</Select>
				<TextField
					label="Мін. ціна"
					type="number"
					value={minPrice}
					onChange={(e) =>
						setMinPrice(e.target.value ? parseInt(e.target.value, 10) : "")
					}
				/>
				<TextField
					label="Макс. ціна"
					type="number"
					value={maxPrice}
					onChange={(e) =>
						setMaxPrice(e.target.value ? parseInt(e.target.value, 10) : "")
					}
				/>
				<Button variant="outlined" onClick={handleFilter}>
					Фільтрувати
				</Button>
			</Box>

			<Grid container spacing={3}>
				{products.map((prod) => (
					<Grid item xs={12} sm={6} md={4} key={prod._id}>
						<Card
							sx={{
								height: "100%",
								display: "flex",
								flexDirection: "column",
								transition: "transform 0.3s",
								"&:hover": { transform: "scale(1.02)" },
							}}
						>
							<CardMedia
								component="img"
								height="200"
								image={prod.image || "/default-placeholder.jpg"}
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
									<Typography variant="h6">{prod.title}</Typography>
									{!!prod.category && (
										<Chip label={prod.category} size="small" color="primary" />
									)}
								</Box>
								<Typography variant="body2" color="text.secondary">
									{prod.shortDescription}
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
									<Rating value={prod.rating || 0} precision={0.5} readOnly />
								</Box>
							</CardContent>
							<Box sx={{ p: 2 }}>
								<Button
									fullWidth
									variant="contained"
									color="secondary"
									onClick={() => handleAddToCompare(prod)}
								>
									Додати до порівняння
								</Button>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>

			<CompareTable
				products={compareList}
				onRemove={handleRemoveFromCompare}
				onClearAll={handleClearAllCompare}
			/>
		</Container>
	);
};

export default App;
