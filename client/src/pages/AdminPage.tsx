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
	Tabs,
	Tab,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import { useNavigate } from "react-router-dom";

import { IProduct } from "../types/product";
import {
	seedProducts,
	addProduct,
	deleteProduct,
	updateProduct,
} from "../services/productService";
import { IUser } from "../types/user";
import {
	fetchAllUsers,
	deleteUserById,
	updateUserName,
} from "../services/userService";

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

	const navigate = useNavigate();

	const [openImageViewer, setOpenImageViewer] = useState(false);
	const [imageToView, setImageToView] = useState<string>("");

	const [productFormOpen, setProductFormOpen] = useState(false);
	const [productFormData, setProductFormData] = useState<Partial<IProduct>>({});
	const [formTitle, setFormTitle] = useState<string>("Додати товар");

	const [users, setUsers] = useState<IUser[]>([]);
	const [activeTab, setActiveTab] = useState(0);

	const [userEditModalOpen, setUserEditModalOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string>("");
	const [userNameField, setUserNameField] = useState<string>("");

	const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
		setError(null);
		setSuccess(null);
		if (newValue === 1) {
			void loadUsers();
		}
	};

	const handleSeed = useCallback(async () => {
		try {
			setSuccess(null);
			await seedProducts();
			setSuccess("База даних успішно заповнена демо-даними!");
			await reload();
		} catch (e: unknown) {
			console.error(e);
			setError(
				"Сталася помилка при заповненні демо-даними. Спробуйте пізніше.",
			);
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
		} catch (e: unknown) {
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
		} catch (e: unknown) {
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
		navigate("/");
	};

	const filteredProducts = useProductFilters({
		allProducts: products,
		searchTerm,
	});

	const loadUsers = async () => {
		try {
			const data = await fetchAllUsers();
			setUsers(data);
		} catch (e: unknown) {
			console.error(e);
			setError("Помилка при завантаженні списку користувачів");
		}
	};

	const handleDeleteUser = async (userId: string) => {
		if (!window.confirm("Ви впевнені, що хочете видалити цього користувача?")) {
			return;
		}
		try {
			await deleteUserById(userId);
			setSuccess("Користувача успішно видалено");
			void loadUsers();
		} catch (e: unknown) {
			console.error(e);
			setError("Помилка при видаленні користувача");
		}
	};

	const handleEditUser = (u: IUser) => {
		setSelectedUserId(u._id);
		setUserNameField(u.name);
		setUserEditModalOpen(true);
	};

	const handleUpdateUserName = async () => {
		if (!userNameField.trim()) {
			alert("Ім’я не може бути порожнім");
			return;
		}
		try {
			await updateUserName(selectedUserId, userNameField.trim());
			setSuccess("Ім’я користувача оновлено");
			setUserEditModalOpen(false);
			setSelectedUserId("");
			setUserNameField("");
			void loadUsers();
		} catch (e: unknown) {
			console.error(e);
			setError("Помилка при оновленні користувача");
		}
	};

	const handleCloseUserEditModal = () => {
		setUserEditModalOpen(false);
		setSelectedUserId("");
		setUserNameField("");
	};

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

			<Tabs value={activeTab} onChange={handleChangeTab} sx={{ mb: 2 }}>
				<Tab label="Товари" />
				<Tab label="Користувачі" />
			</Tabs>

			{activeTab === 0 && (
				<>
					<Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
						<Button
							variant="contained"
							startIcon={<DataThresholdingIcon />}
							onClick={handleSeed}
						>
							Заповнити демо-даними
						</Button>
						<Button
							variant="outlined"
							startIcon={<AddCircleIcon />}
							onClick={handleAddModalOpen}
						>
							Додати товар
						</Button>

						<Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
							<PersonSearchIcon sx={{ mr: 1 }} />
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
									<TableCell>Опис</TableCell>
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
										<TableCell
											sx={{
												maxWidth: 180,
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}
										>
											<Tooltip
												componentsProps={{
													tooltip: {
														sx: {
															maxWidth: 300,
															whiteSpace: "normal",
															wordWrap: "break-word",
														},
													},
												}}
												title={prod.title || ""}
												placement="top"
											>
												<span>{prod.title}</span>
											</Tooltip>
										</TableCell>

										<TableCell
											sx={{
												maxWidth: 130,
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}
										>
											<Tooltip
												componentsProps={{
													tooltip: {
														sx: {
															maxWidth: 300,
															whiteSpace: "normal",
															wordWrap: "break-word",
														},
													},
												}}
												title={prod.brand || ""}
												placement="top"
											>
												<span>{prod.brand || "-"}</span>
											</Tooltip>
										</TableCell>

										<TableCell
											sx={{
												maxWidth: 300,
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}
										>
											<Tooltip
												componentsProps={{
													tooltip: {
														sx: {
															maxWidth: 300,
															whiteSpace: "normal",
															wordWrap: "break-word",
														},
													},
												}}
												title={prod.description || ""}
												placement="top"
											>
												<span>{prod.description || "-"}</span>
											</Tooltip>
										</TableCell>

										<TableCell>${prod.price}</TableCell>
										<TableCell>{prod.rating ?? 0}</TableCell>
										<TableCell>{prod.stock > 0 ? "так" : "ні"}</TableCell>

										<TableCell>
											<IconButton
												size="small"
												color="primary"
												onClick={() => handleEditClick(prod)}
											>
												<EditNoteIcon />
											</IconButton>
											<IconButton
												size="small"
												color="error"
												onClick={() => handleDeleteProduct(prod)}
											>
												<DeleteForeverIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}

								{filteredProducts.length === 0 && (
									<TableRow>
										<TableCell colSpan={8} align="center">
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
				</>
			)}

			{activeTab === 1 && (
				<>
					<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
						<Button
							variant="outlined"
							startIcon={<RestartAltIcon />}
							onClick={() => void loadUsers()}
						>
							Оновити список користувачів
						</Button>
					</Box>

					<TableContainer component={Paper} elevation={3} sx={{ mt: 2 }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Ім'я</TableCell>
									<TableCell>Email</TableCell>
									<TableCell>Роль</TableCell>
									<TableCell>Дії</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{users.map((u) => (
									<TableRow key={u._id}>
										<TableCell>
											<Tooltip
												componentsProps={{
													tooltip: {
														sx: {
															maxWidth: 300,
															whiteSpace: "normal",
															wordWrap: "break-word",
														},
													},
												}}
												title={u.name || ""}
												placement="top"
											>
												<span>{u.name}</span>
											</Tooltip>
										</TableCell>
										<TableCell>{u.email}</TableCell>
										<TableCell>{u.role}</TableCell>
										<TableCell>
											<IconButton
												size="small"
												color="primary"
												onClick={() => handleEditUser(u)}
											>
												<EditNoteIcon />
											</IconButton>
											<IconButton
												size="small"
												color="error"
												onClick={() => void handleDeleteUser(u._id)}
											>
												<DeleteForeverIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
								{users.length === 0 && (
									<TableRow>
										<TableCell colSpan={4} align="center">
											Немає користувачів
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</>
			)}

			<Dialog
				open={userEditModalOpen}
				onClose={handleCloseUserEditModal}
				fullWidth
			>
				<DialogTitle>Редагувати користувача</DialogTitle>
				<DialogContent dividers>
					<TextField
						label="Нове імʼя"
						fullWidth
						variant="outlined"
						value={userNameField}
						onChange={(e) => setUserNameField(e.target.value)}
						sx={{ mt: 1 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={handleCloseUserEditModal}>
						Скасувати
					</Button>
					<Button
						variant="contained"
						color="success"
						onClick={handleUpdateUserName}
					>
						Зберегти
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default AdminPage;
