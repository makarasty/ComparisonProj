import React, { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

interface ILoginPageProps {
  setRole?: (role: string | null) => void;
}

const LoginPage: React.FC<ILoginPageProps> = ({ setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Будь ласка, введіть email і пароль");
      return;
    }

    try {
      const resp = await login(email, password);
      if (resp.token && resp.user) {
        setSuccess("Успішний вхід");

        if (resp.user.role === "admin") {
          setRole?.("admin");
          navigate("/admin");
        } else {
          setRole?.("user");
          navigate("/");
        }
      } else {
        setError(resp.message || "Сталася невідома помилка авторизації");
      }
    } catch (e: unknown) {
      console.error(e);
      setError("Помилка при вході. Перевірте дані та спробуйте ще.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
        Вхід
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

      <Button variant="contained" onClick={handleLogin} fullWidth>
        Увійти
      </Button>
    </Box>
  );
};

export default LoginPage;
