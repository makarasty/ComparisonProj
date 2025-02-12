import React from "react";
import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Typography,
} from "@mui/material";
import { ICategory } from "../types/category";

interface CategoryCardProps {
	category: ICategory;
	onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
	return (
		<Card
			variant="outlined"
			sx={{
				width: 280,
				borderRadius: 2,
				overflow: "hidden",
				mx: "auto",
				"&:hover": { boxShadow: 6 },
			}}
		>
			<CardActionArea onClick={onClick}>
				<CardMedia
					component="img"
					height="160"
					image={category.image || "/images/unknown.jpg"}
					alt={category.name}
					sx={{ objectFit: "cover" }}
				/>
				<CardContent sx={{ textAlign: "center" }}>
					<Typography variant="h6" noWrap fontWeight="bold">
						{category.name}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default CategoryCard;
