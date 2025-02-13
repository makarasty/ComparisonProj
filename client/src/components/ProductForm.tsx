import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid,
	TextField,
	Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { IProduct } from "../types/product";

interface ProductFormProps {
	open: boolean;
	initialData?: Partial<IProduct>;
	onClose: () => void;
	onSubmit: (data: Partial<IProduct>) => void;
	title: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
	open,
	initialData = {},
	onClose,
	onSubmit,
	title,
}) => {
	const [formData, setFormData] = useState<Partial<IProduct>>(initialData);

	useEffect(() => {
		setFormData(initialData);
	}, [initialData]);

	const handleChange = (field: keyof IProduct, value: unknown) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = () => {
		onSubmit(formData);
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Назва"
							fullWidth
							value={formData.title || ""}
							onChange={(e) => handleChange("title", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Бренд"
							fullWidth
							value={formData.brand || ""}
							onChange={(e) => handleChange("brand", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Ціна"
							fullWidth
							type="number"
							value={formData.price ?? ""}
							onChange={(e) =>
								handleChange("price", parseFloat(e.target.value) || 0)
							}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Зображення (URL)"
							fullWidth
							value={formData.image || ""}
							onChange={(e) => handleChange("image", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Опис"
							fullWidth
							multiline
							rows={2}
							value={formData.description || ""}
							onChange={(e) => handleChange("description", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Рейтинг"
							fullWidth
							type="number"
							value={formData.rating ?? ""}
							onChange={(e) =>
								handleChange("rating", parseFloat(e.target.value) || 0)
							}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="К-сть (stock)"
							fullWidth
							type="number"
							value={formData.stock ?? ""}
							onChange={(e) =>
								handleChange("stock", parseInt(e.target.value) || 0)
							}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Скасувати</Button>
				<Button
					variant="contained"
					color="success"
					onClick={handleSubmit}
					startIcon={<CheckCircleIcon />}
				>
					Зберегти
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ProductForm;
