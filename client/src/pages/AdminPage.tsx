import React, { useState, useCallback } from "react";
import {
	Typography,
	Box,
	Button,
	Alert,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	IconButton,
	TextField,
	Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";

import { IProduct } from "../types/product";
import {
	seedProducts,
	addProduct,
	deleteProduct,
	updateProduct,
} from "../services/productService";
import FullImageViewer from "../components/FullImageViewer";
import ProductForm from "../components/ProductForm";

import { useFetchProducts } from "../hooks/useFetchProducts";
import { useScrollToTopOnMessages } from "../hooks/useScrollToTopOnMessages";
import { useProductFilters } from "../hooks/useProductFilters";

const AdminPage: React.FC = () => {
	const { products, error, setError, reload } = useFetchProducts();

	const [success, setSuccess] = useState<string | null>(null);
	useScrollToTopOnMessages(success, error);

	const [searchTerm, setSearchTerm] = useState("");

	const [openImageViewer, setOpenImageViewer] = useState(false);
	const [imageToView, setImageToView] = useState<string>("");

	const [productFormOpen, setProductFormOpen] = useState(false);
	const [productFormData, setProductFormData] = useState<Partial<IProduct>>({});
	const [formTitle, setFormTitle] = useState<string>("Додати товар");

	const handleSeed = useCallback(async () => {
		try {
			setSuccess(null);
			await seedProducts();
			setSuccess("База даних успішно заповнена демонстраційними даними!");
			await reload();
		} catch (e) {
			console.error(e);
			setError("Сталася помилка при заповненні бази даних. Спробуйте пізніше.");
		}
	}, [reload, setError]);

	const handleAddModalOpen = () => {
		setProductFormData({});
		setFormTitle("Додати новий товар");
		setProductFormOpen(true);
	};

	const handleEditClick = (prod: IProduct) => {
		if (!prod._id) {
			alert("Немає _id, не можемо редагувати.");
			return;
		}
		setProductFormData(prod);
		setFormTitle("Редагувати товар");
		setProductFormOpen(true);
	};

	const handleCloseForm = () => {
		setProductFormOpen(false);
	};

	const handleSubmitForm = async (data: Partial<IProduct>) => {
		try {
			if (!data.title) {
				alert("Вкажіть, будь ласка, назву товару");
				return;
			}
			if (!data.description) {
				alert("Вкажіть, будь ласка, опис товару");
				return;
			}
			if (data.price === undefined) {
				alert("Вкажіть, будь ласка, ціну товару");
				return;
			}

			if (data._id) {
				await updateProduct(data._id, data);
				setSuccess(`Товар '${data.title}' оновлено.`);
			} else {
				const created = await addProduct(data);
				setSuccess(`Товар «${created.title}» успішно додано!`);
			}
			setProductFormOpen(false);
			setProductFormData({});
			await reload();
		} catch (e) {
			console.error(e);
			setError("Помилка при збереженні товару.");
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
			await reload();
		} catch (e) {
			console.error(e);
			setError("Помилка при видаленні товару.");
		}
	};

	const handleOpenImageViewer = (imageUrl: string) => {
		setImageToView(imageUrl);
		setOpenImageViewer(true);
	};
	const handleCloseImageViewer = () => {
		setOpenImageViewer(false);
		setImageToView("");
	};

	const handleGoBack = () => {
		window.history.back();
	};

	const filteredProducts = useProductFilters({
		allProducts: products,
		searchTerm,
	});

	return (
		<Box sx={{ py: 4 }}>
			<Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
				<Button
					variant="outlined"
					startIcon={<ArrowBackIcon />}
					onClick={handleGoBack}
				>
					Назад
				</Button>
				<Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
					Адміністрування
				</Typography>
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
				<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
					{error}
				</Alert>
			)}

			<Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
				<Button variant="contained" onClick={handleSeed}>
					Заповнити демо-даними
				</Button>
				<Button
					variant="outlined"
					startIcon={<AddIcon />}
					onClick={handleAddModalOpen}
				>
					Додати товар
				</Button>

				<Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
					<SearchIcon sx={{ mr: 1 }} />
					<TextField
						label="Пошук..."
						variant="outlined"
						size="small"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</Box>
			</Box>

			<TableContainer component={Paper} elevation={3}>
				<Table sx={{ "& td, & th": { fontSize: "1.1rem" } }}>
					<TableHead>
						<TableRow>
							<TableCell>Зображення</TableCell>
							<TableCell>Назва</TableCell>
							<TableCell>Бренд</TableCell>
							<TableCell>Ціна</TableCell>
							<TableCell>Рейтинг</TableCell>
							<TableCell>В наявності</TableCell>
							<TableCell>Дії</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredProducts.map((prod) => (
							<TableRow key={prod._id || prod.uuid}>
								<TableCell>
									{prod.image ? (
										<Box
											component="img"
											src={prod.image}
											alt={prod.title}
											sx={{
												width: 60,
												height: 60,
												objectFit: "contain",
												backgroundColor: "background.default",
												cursor: "pointer",
											}}
											onClick={() => handleOpenImageViewer(prod.image)}
										/>
									) : (
										"-"
									)}
								</TableCell>
								<TableCell>
									<Tooltip title={prod.title}>
										<span style={{ fontWeight: 500 }}>{prod.title}</span>
									</Tooltip>
								</TableCell>
								<TableCell>{prod.brand || "-"}</TableCell>
								<TableCell>${prod.price}</TableCell>
								<TableCell>{prod.rating ?? 0}</TableCell>
								<TableCell>{prod.stock > 0 ? "так" : "ні"}</TableCell>
								<TableCell>
									<IconButton
										size="small"
										color="primary"
										onClick={() => handleEditClick(prod)}
									>
										<EditIcon />
									</IconButton>
									<IconButton
										size="small"
										color="error"
										onClick={() => handleDeleteProduct(prod)}
									>
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}

						{filteredProducts.length === 0 && (
							<TableRow>
								<TableCell colSpan={7} align="center">
									Нічого не знайдено...
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<FullImageViewer
				open={openImageViewer}
				imageUrl={imageToView}
				onClose={handleCloseImageViewer}
			/>

			<ProductForm
				open={productFormOpen}
				initialData={productFormData}
				onClose={handleCloseForm}
				onSubmit={handleSubmitForm}
				title={formTitle}
			/>
		</Box>
	);
};

export default AdminPage;
