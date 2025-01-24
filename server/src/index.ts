import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import connectDB from "./config/db";
import deviceRoutes from "./routes/deviceRoutes";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors());

app.use("/api/devices", deviceRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
