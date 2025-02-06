import React, {
	useState,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react";
import {
	Typography,
	Box,
	Select,
	MenuItem,
	Grid,
	Button,
	Alert,
	Fab,
	Zoom,
	TextField,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { IProduct } from "../types/product";
import {
	fetchProducts,
	seedProducts,
	addProduct,
	deleteProduct,
	updateProduct,
} from "../services/productService";

import CompareTable from "../components/CompareTable";
import ProductCard from "../components/ProductCard";

const AdminPage: React.FC = () => {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [brand, setBrand] = useState("");
	const [minPrice, setMinPrice] = useState<number | "">("");
	const [maxPrice, setMaxPrice] = useState<number | "">("");
	const [minRating, setMinRating] = useState<number | "">("");

	const [compareUuids, setCompareUuids] = useState<number[]>([]);
	const compareList = useMemo(
		() => products.filter((p) => p.uuid && compareUuids.includes(p.uuid)),
		[products, compareUuids],
	);

	const [newProductTitle, setNewProductTitle] = useState("");
	const [newProductBrand, setNewProductBrand] = useState("");
	const [newProductPrice, setNewProductPrice] = useState<number | "">("");
	const [newProductImage, setNewProductImage] = useState("");

	const [editingProduct, setEditingProduct] =
		useState<Partial<IProduct> | null>(null);

	const editFormRef = useRef<HTMLDivElement | null>(null);
	const addFormRef = useRef<HTMLDivElement | null>(null);

	const [showScrollUp, setShowScrollUp] = useState(false);
	const [showScrollDown, setShowScrollDown] = useState(false);

	const handleScroll = useCallback(() => {
		const st = window.pageYOffset || document.documentElement.scrollTop;
		const wh = window.innerHeight;
		const dh = document.documentElement.scrollHeight;
		setShowScrollUp(st > 250);
		setShowScrollDown(st + wh < dh - 100);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);
	const scrollToBottom = useCallback(() => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
	}, []);
	const scrollToEditForm = useCallback(() => {
		setTimeout(() => {
			editFormRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 200);
	}, []);
	const scrollToAddForm = useCallback(() => {
		setTimeout(() => {
			addFormRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 200);
	}, []);

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

	useEffect(() => {
		if (success || error) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [success, error]);

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
	const handleAddProduct = async () => {
		try {
			if (!newProductTitle) {
				alert("Вкажіть, будь ласка, назву товару");
				return;
			}
			const productData: Partial<IProduct> = {
				title: newProductTitle,
				brand: newProductBrand || "NoBrand",
				price: newProductPrice === "" ? 0 : newProductPrice,
				image: newProductImage,
				rating: 0,
				description: "Додано адміністратором",
				stock: 100,
				available: true,
			};
			const created = await addProduct(productData);
			setSuccess(`Товар «${created.title}» успішно додано!`);

			setNewProductTitle("");
			setNewProductBrand("");
			setNewProductPrice("");
			setNewProductImage("");

			await loadData();
		} catch (e) {
			console.error(e);
			setError("Помилка при додаванні товару.");
		}
	};

	const handleDeleteProduct = async (prod: IProduct) => {
		if (!prod._id) {
			alert("Немає _id у товару, неможливо видалити з бази.");
			return;
		}
		if (!window.confirm(`Ви впевнені, що хочете видалити '${prod.title}'?`)) {
			return;
		}
		try {
			await deleteProduct(prod._id);
			setSuccess(`Товар '${prod.title}' успішно видалено.`);
			await loadData();
		} catch (e) {
			console.error(e);
			setError("Помилка при видаленні товару.");
		}
	};

	const handleEditProduct = (prod: IProduct) => {
		if (!prod._id) {
			alert("Немає _id, не можемо редагувати.");
			return;
		}
		setEditingProduct({
			_id: prod._id,
			title: prod.title,
			brand: prod.brand,
			price: prod.price,
			image: prod.image,
			description: prod.description,
			stock: prod.stock,
			rating: prod.rating,
			available: prod.available,
		});
		scrollToEditForm();
	};

	const handleEditingFieldChange = (
		field: keyof IProduct,
		value: string | number,
	) => {
		if (!editingProduct) return;
		setEditingProduct({ ...editingProduct, [field]: value });
	};

	const handleSaveChanges = async () => {
		if (!editingProduct?._id) {
			alert("Немає _id у товару, неможливо оновити.");
			return;
		}
		try {
			await updateProduct(editingProduct._id, editingProduct);
			setSuccess(`Товар '${editingProduct.title}' оновлено.`);
			setEditingProduct(null);
			await loadData();
		} catch (e) {
			console.error(e);
			setError("Помилка при оновленні товару.");
		}
	};

	const handleCancelEdit = () => {
		setEditingProduct(null);
	};

	const allBrands = useMemo(() => {
		const s = new Set<string>();
		products.forEach((p) => {
			if (p.brand) s.add(p.brand);
		});
		return Array.from(s);
	}, [products]);

	const filteredProducts = useMemo(() => {
		return products.filter((p) => {
			if (brand && p.brand !== brand) return false;
			if (minPrice !== "" && p.price < minPrice) return false;
			if (maxPrice !== "" && p.price > maxPrice) return false;
			if (minRating !== "" && p.rating < minRating) return false;
			return true;
		});
	}, [products, brand, minPrice, maxPrice, minRating]);

	const handleFilter = async () => {
		try {
			setSuccess(null);
			await loadData();
		} catch (e) {
			console.error(e);
			setError("Сталася помилка при фільтрації. Спробуйте пізніше.");
		}
	};

	const resetFiltersAdmin = async () => {
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		setMinRating("");
		setSuccess(null);

		try {
			await loadData();
		} catch (e) {
			console.error(e);
			setError("Не вдалося скинути фільтри. Спробуйте пізніше.");
		}
	};

	const handleRemoveFromCompare = (uuid: number) => {
		setCompareUuids((prev) => prev.filter((id) => id !== uuid));
	};
	const handleClearAllCompare = () => {
		setCompareUuids([]);
	};

	return (
		<Box sx={{ py: 4 }}>
			<Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
				Адміністрування
			</Typography>

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

			<Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
				<Button variant="contained" onClick={handleSeed}>
					Заповнити базу даних демо-товарами
				</Button>
				<Button variant="outlined" onClick={scrollToAddForm}>
					Перейти до додавання товару
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
					{allBrands.map((b) => (
						<MenuItem key={b} value={b}>
							{b}
						</MenuItem>
					))}
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
				<TextField
					label="Мін. рейтинг"
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
					onClick={resetFiltersAdmin}
					color="secondary"
				>
					Скинути
				</Button>
			</Box>

			<Grid container spacing={2}>
				{filteredProducts.map((prod) => (
					<Grid item xs={12} sm={6} md={4} key={prod._id || prod.uuid}>
						<ProductCard
							product={prod}
							showCompareButton={false}
							showAdminActions
							onDelete={() => handleDeleteProduct(prod)}
							onEdit={() => handleEditProduct(prod)}
						/>
					</Grid>
				))}
			</Grid>

			<CompareTable
				products={compareList}
				onRemove={handleRemoveFromCompare}
				onClearAll={handleClearAllCompare}
			/>

			<Box
				ref={addFormRef}
				sx={{
					mt: 5,
					p: 2,
					border: "1px solid #ccc",
					borderRadius: 2,
				}}
			>
				<Typography variant="h5" sx={{ mb: 2 }}>
					Додати новий товар
				</Typography>
				<Grid container spacing={2} sx={{ mb: 2 }}>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Назва"
							fullWidth
							value={newProductTitle}
							onChange={(e) => setNewProductTitle(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Бренд"
							fullWidth
							value={newProductBrand}
							onChange={(e) => setNewProductBrand(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Ціна"
							fullWidth
							type="number"
							value={newProductPrice}
							onChange={(e) =>
								setNewProductPrice(
									e.target.value ? parseInt(e.target.value, 10) : "",
								)
							}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Посилання на зображення"
							fullWidth
							value={newProductImage}
							onChange={(e) => setNewProductImage(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Button
							variant="contained"
							color="success"
							sx={{ height: "100%" }}
							onClick={handleAddProduct}
							fullWidth
						>
							Додати товар
						</Button>
					</Grid>
				</Grid>
			</Box>

			{editingProduct && (
				<Box
					ref={editFormRef}
					sx={{
						mt: 5,
						p: 2,
						border: "1px solid #ccc",
						borderRadius: 2,
					}}
				>
					<Typography variant="h5" sx={{ mb: 2 }}>
						Редагувати товар
					</Typography>
					<Grid container spacing={2} sx={{ mb: 2 }}>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Назва"
								fullWidth
								value={editingProduct.title || ""}
								onChange={(e) =>
									handleEditingFieldChange("title", e.target.value)
								}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Бренд"
								fullWidth
								value={editingProduct.brand || ""}
								onChange={(e) =>
									handleEditingFieldChange("brand", e.target.value)
								}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Ціна"
								fullWidth
								type="number"
								value={editingProduct.price || ""}
								onChange={(e) =>
									handleEditingFieldChange(
										"price",
										parseFloat(e.target.value) || 0,
									)
								}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Зображення (URL)"
								fullWidth
								value={editingProduct.image || ""}
								onChange={(e) =>
									handleEditingFieldChange("image", e.target.value)
								}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Опис"
								fullWidth
								value={editingProduct.description || ""}
								onChange={(e) =>
									handleEditingFieldChange("description", e.target.value)
								}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Рейтинг"
								fullWidth
								type="number"
								value={editingProduct.rating || ""}
								onChange={(e) =>
									handleEditingFieldChange(
										"rating",
										parseFloat(e.target.value) || 0,
									)
								}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="К-сть на складі (stock)"
								fullWidth
								type="number"
								value={editingProduct.stock || ""}
								onChange={(e) =>
									handleEditingFieldChange(
										"stock",
										parseInt(e.target.value) || 0,
									)
								}
							/>
						</Grid>
					</Grid>
					<Box sx={{ display: "flex", gap: 2 }}>
						<Button
							variant="contained"
							color="success"
							onClick={handleSaveChanges}
						>
							Зберегти
						</Button>
						<Button
							variant="outlined"
							color="inherit"
							onClick={handleCancelEdit}
						>
							Скасувати
						</Button>
					</Box>
				</Box>
			)}

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

export default AdminPage;
