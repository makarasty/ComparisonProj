import { Request, Response, NextFunction } from "express";
import { error } from "../utils/responseHandler";

export function notFoundHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const msg = `Route ${req.originalUrl} not found`;

	return error(res, msg, 404);
}

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

	const s = err.statusCode || 500;
	const m = err.message || "Internal Server Error";

	return error(res, m, s);
}
