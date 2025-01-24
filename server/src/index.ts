import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

dotenv.config();
const app: Application = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is here! ${PORT}`);
});
