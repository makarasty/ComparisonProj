import { Request, Response, NextFunction } from "express";

export function notFoundHandler(
	req: Request,
	res: Response,
	_next: NextFunction,
): void {
	const msg = `Route ${req.originalUrl} not found`;
	res.status(404).json({ status: "error", message: msg });
}

export function globalErrorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void {
	console.error("Global Error Handler:", err);
	res.status(500).json({
		status: "error",
		message:
			"message" in (err as Error)
				? (err as Error).message
				: "Internal Server Error",
	});
}
