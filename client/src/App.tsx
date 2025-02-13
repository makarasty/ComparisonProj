import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
} from "react-router-dom";
import {
	CssBaseline,
	AppBar,
	Toolbar,
	Typography,
	Box,
	Button,
	IconButton,
	CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { getCurrentUser, logout } from "./services/authService";

const App: React.FC = () => {
	const [darkMode, setDarkMode] = useState<boolean>(() => {
		try {
			const stored = localStorage.getItem("darkMode");
			return stored ? JSON.parse(stored) : false;
		} catch {
			return false;
		}
	});

	const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		localStorage.setItem("darkMode", JSON.stringify(darkMode));
	}, [darkMode]);

	useEffect(() => {
		const user = getCurrentUser();
		if (user?.role === "admin") {
			setCurrentUserRole("admin");
		} else if (user?.role === "user") {
			setCurrentUserRole("user");
		} else {
			setCurrentUserRole(null);
		}

		setIsLoading(false);
	}, []);

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: darkMode ? "dark" : "light",
				},
			}),
		[darkMode],
	);

	const handleLogout = () => {
		logout();
		setCurrentUserRole(null);
		window.location.href = "/";
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
			>
				<Router>
					<AppBar position="static">
						<Toolbar>
							<Typography
								variant="h6"
								sx={{ cursor: "pointer", flexGrow: 1 }}
								onClick={() => {
									window.location.href = "/";
								}}
							>
								МАГАЗИН
							</Typography>
							<IconButton
								color="inherit"
								onClick={() => setDarkMode(!darkMode)}
							>
								{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
							</IconButton>

							<Box sx={{ display: "flex", gap: 2, ml: 2 }}>
								{currentUserRole === "admin" && (
									<Button component={Link} to="/admin" color="inherit">
										Адміністрування
									</Button>
								)}
								{currentUserRole ? (
									<Button onClick={handleLogout} color="inherit">
										Вийти
									</Button>
								) : (
									<>
										<Button component={Link} to="/login" color="inherit">
											Увійти
										</Button>
										<Button component={Link} to="/register" color="inherit">
											Реєстрація
										</Button>
									</>
								)}
							</Box>
						</Toolbar>
					</AppBar>

					<Box sx={{ flexGrow: 1, px: { xs: 2, md: 4 } }}>
						<Routes>
							<Route path="/" element={<HomePage />} />

							<Route
								path="/login"
								element={<LoginPage setRole={setCurrentUserRole} />}
							/>
							<Route path="/register" element={<RegisterPage />} />
							<Route
								path="/admin"
								element={
									isLoading ? (
										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												mt: 10,
											}}
										>
											<CircularProgress />
										</Box>
									) : currentUserRole === "admin" ? (
										<AdminPage />
									) : (
										<Navigate to="/login" replace />
									)
								}
							/>
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
