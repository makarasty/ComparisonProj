import React from "react";
import {
	Box,
	Typography,
	Button,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableContainer,
	Tooltip,
	alpha,
	useTheme,
} from "@mui/material";
import { IProduct } from "../types/product";
import { isNumeric } from "../services/productService";
import { stickyCellStyles } from "../utils/tableStyles";

interface CompareTableProps {
	products: IProduct[];
	onRemove: (uuid: number) => void;
	onClearAll: () => void;
}

const universalFields = [
	"image",
	"title",
	"brand",
	"category",
	"price",
	"rating",
	"inStock",
];

const fieldTranslations: Record<string, string> = {
	image: "Зображення",
	title: "Назва",
	brand: "Бренд",
	category: "Категорія",
	price: "Ціна",
	rating: "Рейтинг",
	inStock: "Ще продається",
};

const numericPreferences: Record<string, "min" | "max"> = {
	price: "min",
	rating: "max",
	inStock: "max",
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
		case "inStock":
			return prod.stock > 0 ? 1 : 0;
		default:
			return "-";
	}
}

function renderTableCellContent(
	field: string,
	val: unknown,
	isBest: boolean,
	colStyle: React.CSSProperties,
	product: IProduct,
) {
	if (field === "image") {
		const imgUrl = val !== "-" ? String(val) : null;
		return imgUrl ? (
			<img
				src={imgUrl}
				alt={product.title}
				style={{
					maxWidth: "100px",
					maxHeight: "100px",
					objectFit: "contain",
				}}
			/>
		) : (
			"-"
		);
	}

	if (field === "inStock") {
		return val === 1 ? "так" : "ні";
	}

	const display = String(val);
	return display.length > 50 ? (
		<Tooltip title={display}>
			<span>{display.slice(0, 50)}...</span>
		</Tooltip>
	) : (
		display
	);
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
		if (!p.uuid) return;
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
			if (!p.uuid) return;
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
		if (p.uuid) winsCount[p.uuid] = 0;
	});

	fieldList.forEach((field) => {
		const best = bestValues[field];
		if (best !== undefined) {
			products.forEach((p) => {
				if (!p.uuid) return;
				const val = valuesByProduct[p.uuid][field];
				if (isNumeric(val) && val === best) {
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
		} as React.CSSProperties;
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
									...stickyCellStyles,
									backgroundColor:
										theme.palette.mode === "dark"
											? theme.palette.primary.dark
											: theme.palette.primary.main,
									color: theme.palette.common.white,
									fontWeight: 600,
									fontSize: "1rem",
									border: "none",
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
												onClick={() => onRemove(p.uuid!)}
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
										...stickyCellStyles,
										backgroundColor:
											theme.palette.mode === "dark"
												? theme.palette.grey[800]
												: theme.palette.grey[200],
										color: theme.palette.text.primary,
										fontWeight: 600,
										zIndex: 2,
									}}
								>
									{fieldTranslations[field] ?? field}
								</TableCell>
								{products.map((p, idx) => {
									if (!p.uuid) return null;
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
											{renderTableCellContent(field, val, isBest, colStyle, p)}
										</TableCell>
									);
								})}
							</TableRow>
						))}
						<TableRow>
							<TableCell
								sx={{
									...stickyCellStyles,
									backgroundColor:
										theme.palette.mode === "dark"
											? theme.palette.grey[800]
											: theme.palette.grey[200],
									color: theme.palette.text.primary,
									fontWeight: 700,
									zIndex: 2,
								}}
							>
								Перемоги
							</TableCell>
							{products.map((p, idx) => {
								if (!p.uuid) return null;
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

export default CompareTable;
