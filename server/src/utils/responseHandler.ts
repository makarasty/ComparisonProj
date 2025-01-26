import { Response } from "express";

interface SuccessResponse<T> {
	status: "success";
	data: T;
}
interface ErrorResponse {
	status: "error";
	message: string;
}

export function success<T>(res: Response, data: T, sc = 200) {
	const r: SuccessResponse<T> = { status: "success", data };

	return res.status(sc).json(r);
}
export function error(res: Response, message: string, sc = 400) {
	const r: ErrorResponse = { status: "error", message };

	return res.status(sc).json(r);
}
