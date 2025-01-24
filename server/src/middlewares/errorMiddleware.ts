import { Request, Response, NextFunction } from "express";
import { error } from "../utils/responseHandler";

// 404 Not Found
export function notFoundHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const message = `Route ${req.originalUrl} not found`;
	return error(res, message, 404);
}

// Else
export function globalErrorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (err.isJoi) {
		const details = err.details.map((d: any) => d.message).join(", ");
		return error(res, `Validation error: ${details}`, 422);
	}

	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	return error(res, message, statusCode);
}
