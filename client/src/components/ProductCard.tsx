import React from "react";
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

interface ProductCardProps {
	product: IProduct;
	inCompare: boolean;
	toggleCompare: (product: IProduct) => void;
	compareListLength: number;
	maxCompareItems: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
	product,
	inCompare,
	toggleCompare,
	compareListLength,
	maxCompareItems,
}) => {
	const buttonLabel = inCompare
		? "Видалити з порівняння"
		: "Додати до порівняння";

	return (
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
		</Card>
	);
};

export default ProductCard;
