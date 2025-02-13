import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import deviceRoutes from "./routes/deviceRoutes";
import userRoutes from "./routes/userRoutes";
import {
	notFoundHandler,
	globalErrorHandler,
} from "./middlewares/errorMiddleware";

import { createAdminUserIfNotExists } from "./utils/initAdmin";

dotenv.config();

const app = express();

connectDB()
	.then(() => {
		void createAdminUserIfNotExists();
	})
	.catch((err) => {
		console.error("DB connection error:", err);
	});

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);

app.use(globalErrorHandler);

const PORT = process.env.PORT || "5305";
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
