import { Request, Response, NextFunction, RequestHandler } from "express";
import userRepository from "../repositories/UserRepository";
import { userUpdateSchema } from "../validators/UserValidators";

export const getAllUsers: RequestHandler = async (
	_req,
	res,
	next,
): Promise<void> => {
	try {
		const users = await userRepository.findAll();
		res.json({ data: users });
	} catch (error) {
		next(error);
	}
};

export const updateUser: RequestHandler = async (
	req,
	res,
	next,
): Promise<void> => {
	try {
		const parsed = userUpdateSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				message: parsed.error.errors.map((e) => e.message).join(", "),
			});
			return;
		}
		const { id } = req.params;
		const user = await userRepository.updateUser(id, parsed.data);
		if (!user) {
			res.status(404).json({ message: "Користувача не знайдено" });
			return;
		}
		res.json({ data: user });
	} catch (error) {
		next(error);
	}
};

export const deleteUser: RequestHandler = async (
	req,
	res,
	next,
): Promise<void> => {
	try {
		const { id } = req.params;
		const user = await userRepository.deleteUser(id);
		if (!user) {
			res.status(404).json({ message: "Користувача не знайдено" });
			return;
		}
		res.json({ message: "Користувача успішно видалено" });
	} catch (error) {
		next(error);
	}
};
