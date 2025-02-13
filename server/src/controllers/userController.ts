import { Request, Response, NextFunction, RequestHandler } from "express";
import UserModel, { IUserDocument } from "../models/userModel";

export const getAllUsers: RequestHandler = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const users = await UserModel.find().select("-password");
		res.json({ data: users });
	} catch (error) {
		next(error);
	}
};

export const deleteUser: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const user = await UserModel.findByIdAndDelete(id);
		if (!user) {
			res.status(404).json({ message: "Користувача не знайдено" });
			return;
		}
		res.json({ message: "Користувача успішно видалено" });
	} catch (error) {
		next(error);
	}
};

export const updateUser: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		if (!name || typeof name !== "string" || !name.trim()) {
			res.status(400).json({ message: "Невалідне ім’я" });
			return;
		}

		const user: IUserDocument | null = await UserModel.findByIdAndUpdate(
			id,
			{ name },
			{ new: true },
		).select("-password");

		if (!user) {
			res.status(404).json({ message: "Користувача не знайдено" });
			return;
		}

		res.json({ data: user });
	} catch (error) {
		next(error);
	}
};
