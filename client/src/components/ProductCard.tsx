import React, { useState } from "react";
import {
	Card,
	CardMedia,
	CardContent,
	Box,
	Tooltip,
	Typography,
	Chip,
	Rating,
	Button,
} from "@mui/material";
import { IProduct } from "../types/product";
import FullImageViewer from "./FullImageViewer";

interface ProductCardProps {
	product: IProduct;
	showCompareButton?: boolean;
	inCompare?: boolean;
	toggleCompare?: (product: IProduct) => void;
	compareListLength?: number;
	maxCompareItems?: number;

	showAdminActions?: boolean;
	onDelete?: () => void;
	onEdit?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
	product,
	showCompareButton = true,
	inCompare = false,
	toggleCompare,
	compareListLength = 0,
	maxCompareItems = 4,

	showAdminActions = false,
	onDelete,
	onEdit,
}) => {
	const [showFullImage, setShowFullImage] = useState(false);

	const buttonLabel = inCompare
		? "Видалити з порівняння"
		: "Додати до порівняння";

	const handleToggleFullImage = () => {
		setShowFullImage((prev) => !prev);
	};

	return (
		<>
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
					image={product.image}
					alt={product.title}
					sx={{
						objectFit: "contain",
						backgroundColor: "background.default",
						cursor: "pointer",
					}}
					onClick={handleToggleFullImage}
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
						<Tooltip title={product.title}>
							<Typography variant="h6" noWrap>
								{product.title}
							</Typography>
						</Tooltip>
						{product.category && (
							<Chip label={product.category} size="small" color="primary" />
						)}
					</Box>
					<Typography variant="body2" color="text.secondary">
						{product.description.length > 60
							? `${product.description.slice(0, 60)}...`
							: product.description}
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
							${product.price}
						</Typography>
						<Rating value={product.rating} precision={0.5} readOnly />
					</Box>
				</CardContent>

				{showCompareButton && toggleCompare && (
					<Box sx={{ p: 2 }}>
						<Button
							fullWidth
							variant="contained"
							color={inCompare ? "primary" : "secondary"}
							onClick={() => toggleCompare(product)}
							disabled={!inCompare && compareListLength >= maxCompareItems}
						>
							{buttonLabel}
						</Button>
						{!inCompare && compareListLength >= maxCompareItems && (
							<span style={{ color: "red", fontSize: "0.8rem" }}>
								Максимум досягнуто
							</span>
						)}
					</Box>
				)}

				{showAdminActions && (
					<Box sx={{ display: "flex", gap: 1, p: 2, pt: 0 }}>
						<Button variant="outlined" color="error" onClick={onDelete}>
							Видалити
						</Button>
						<Button variant="outlined" onClick={onEdit}>
							Змінити
						</Button>
					</Box>
				)}
			</Card>

			<FullImageViewer
				open={showFullImage}
				imageUrl={product.image}
				onClose={handleToggleFullImage}
				title={product.title}
			/>
		</>
	);
};

export default ProductCard;
