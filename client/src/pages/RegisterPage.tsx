import React, { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import axios from "axios";

const RegisterPage: React.FC = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const navigate = useNavigate();

	const handleRegister = async () => {
		setError(null);
		setSuccess(null);

		if (!name || !email || !password || !confirmPassword) {
			setError("Будь ласка, заповніть усі поля");
			return;
		}
		if (password !== confirmPassword) {
			setError("Паролі не співпадають");
			return;
		}

		try {
			const resp = await registerUser({
				name,
				email,
				password,
				confirmPassword,
			});
			if (resp.userId) {
				setSuccess(
					"Реєстрація пройшла успішно! Зараз ви будете перенаправлені на сторінку входу...",
				);
				setTimeout(() => {
					navigate("/login");
				}, 1500);
			} else {
				setError(resp.message || "Сталася невідома помилка реєстрації");
			}
		} catch (e: unknown) {
			console.error(e);
			if (axios.isAxiosError(e)) {
				if (e.response?.data && typeof e.response.data.message === "string") {
					setError(e.response.data.message);
				} else {
					setError(e.message);
				}
			} else {
				setError("Сталася помилка при реєстрації. Спробуйте пізніше.");
			}
		}
	};

	return (
		<Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
			<Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
				Реєстрація
			</Typography>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}
			{success && (
				<Alert severity="success" sx={{ mb: 2 }}>
					{success}
				</Alert>
			)}

			<TextField
				label="Ім'я"
				fullWidth
				variant="outlined"
				value={name}
				onChange={(e) => setName(e.target.value)}
				sx={{ mb: 2 }}
			/>
			<TextField
				label="Email"
				type="email"
				fullWidth
				variant="outlined"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				sx={{ mb: 2 }}
			/>
			<TextField
				label="Пароль"
				type="password"
				fullWidth
				variant="outlined"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				sx={{ mb: 2 }}
			/>
			<TextField
				label="Повторіть пароль"
				type="password"
				fullWidth
				variant="outlined"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				sx={{ mb: 2 }}
			/>

			<Button variant="contained" onClick={handleRegister} fullWidth>
				Зареєструватися
			</Button>
		</Box>
	);
};

export default RegisterPage;
