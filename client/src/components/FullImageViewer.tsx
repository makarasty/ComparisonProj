import React from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	useMediaQuery,
	useTheme,
	Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FullImageViewerProps {
	open: boolean;
	imageUrl: string;
	onClose: () => void;
	title?: string;
}

const FullImageViewer: React.FC<FullImageViewerProps> = ({
	open,
	imageUrl,
	onClose,
	title,
}) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

	return (
		<Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="xl">
			<DialogTitle
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					pr: 2,
				}}
			>
				{title || "Перегляд зображення"}
				<IconButton onClick={onClose} size="large">
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent
				dividers
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					p: 2,
					backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#fff",
				}}
			>
				<Box
					component="img"
					src={imageUrl}
					alt={title}
					sx={{
						maxWidth: "90vw",
						maxHeight: "80vh",
						objectFit: "contain",
						backgroundColor: theme.palette.mode === "dark" ? "#000" : "#fff",
					}}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default FullImageViewer;
