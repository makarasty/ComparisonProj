import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
	CssBaseline,
	AppBar,
	Toolbar,
	Typography,
	Box,
	Button,
	IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

const App: React.FC = () => {
	const [darkMode, setDarkMode] = useState<boolean>(() => {
		try {
			const stored = localStorage.getItem("darkMode");
			return stored ? JSON.parse(stored) : false;
		} catch {
			return false;
		}
	});

	React.useEffect(() => {
		localStorage.setItem("darkMode", JSON.stringify(darkMode));
	}, [darkMode]);

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: darkMode ? "dark" : "light",
					primary: { main: "#1976d2" },
					secondary: { main: "#ff9800" },
					success: { main: "#2e7d32" },
					info: { main: "#0288d1" },
					warning: { main: "#ffeb3b" },
					error: { main: "#d32f2f" },
					background: {
						default: darkMode ? "#121212" : "#f6f9fc",
						paper: darkMode ? "#1e1e1e" : "#ffffff",
					},
					text: {
						primary: darkMode ? "#ffffff" : "#333333",
					},
				},
			}),
		[darkMode],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<Router>
					<AppBar position="static">
						<Toolbar>
							<Typography variant="h6" sx={{ flexGrow: 1 }}>
								Магазин
							</Typography>
							<IconButton
								color="inherit"
								onClick={() => setDarkMode(!darkMode)}
							>
								{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
							</IconButton>
							<Box sx={{ display: "flex", gap: 2, ml: 2 }}>
								<Button component={Link} to="/" color="inherit">
									Головна
								</Button>
								<Button component={Link} to="/admin" color="inherit">
									Адміністрування
								</Button>
							</Box>
						</Toolbar>
					</AppBar>

					<Box sx={{ flexGrow: 1, px: { xs: 2, md: 4 } }}>
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/admin" element={<AdminPage />} />
						</Routes>
					</Box>

					<Box
						sx={{
							textAlign: "center",
							py: 2,
							bgcolor: darkMode ? "#1c1c1c" : "#e0e0e0",
						}}
					>
						<Typography variant="body2">© 2025 MKY was here</Typography>
					</Box>
				</Router>
			</Box>
		</ThemeProvider>
	);
};

export default App;
