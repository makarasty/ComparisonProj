import { Response } from "express";

interface SuccessResponse<T> {
	status: "success";
	data: T;
}

interface ErrorResponse {
	status: "error";
	message: string;
}

export function success<T>(res: Response, data: T, statusCode = 200) {
	const response: SuccessResponse<T> = { status: "success", data };
	return res.status(statusCode).json(response);
}

export function error(res: Response, message: string, statusCode = 400) {
	const response: ErrorResponse = { status: "error", message };
	return res.status(statusCode).json(response);
}
