import { Request, Response, NextFunction, RequestHandler } from "express";
import UserModel, { IUserDocument } from "../models/userModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface ILoginResponse {
	message: string;
	token?: string;
	user?: {
		id: string;
		email: string;
		role: string;
		name: string;
	};
}

export const registerUser: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { name, email, password, confirmPassword } = req.body;

		if (!name || !email || !password || !confirmPassword) {
			res.status(400).json({ message: "Всі поля обов'язкові" });
			return;
		}
		if (password.length < 6) {
			res.status(400).json({ message: "Пароль має бути не менше 6 символів" });
			return;
		}
		if (password !== confirmPassword) {
			res.status(400).json({ message: "Паролі не співпадають" });
			return;
		}

		const existing = await UserModel.findOne({ email }).exec();
		if (existing) {
			res.status(400).json({ message: "Користувач з таким email вже існує" });
			return;
		}

		const newUser = await UserModel.create({
			name,
			email,
			password,
			role: "user",
		});

		res.status(201).json({
			message: "Реєстрація пройшла успішно",
			userId: newUser._id,
		});
	} catch (error: unknown) {
		console.error("Error registering user:", error);
		if (error instanceof Error) {
			next(error);
		} else {
			next(
				new Error("Unknown error in registerUser: " + JSON.stringify(error)),
			);
		}
	}
};

export const loginUser: RequestHandler = async (
	req: Request,
	res: Response<ILoginResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).json({ message: "Email і пароль обов'язкові" });
			return;
		}

		const user: IUserDocument | null = await UserModel.findOne({
			email,
		}).exec();
		if (!user) {
			res.status(401).json({ message: "Невірний email або пароль" });
			return;
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			res.status(401).json({ message: "Невірний email або пароль" });
			return;
		}

		const secret = process.env.JWT_SECRET;
		if (!secret) {
			res.status(500).json({ message: "JWT_SECRET не задано на сервері" });
			return;
		}

		const userIdStr =
			user._id instanceof mongoose.Types.ObjectId
				? user._id.toHexString()
				: String(user._id);

		const token = jwt.sign(
			{
				userId: userIdStr,
				role: user.role,
			},
			secret,
			{ expiresIn: "2h" },
		);

		res.json({
			message: "Успішний вхід",
			token,
			user: {
				id: userIdStr,
				email: user.email,
				role: user.role,
				name: user.name,
			},
		});
	} catch (error: unknown) {
		console.error("Error logging in user:", error);
		if (error instanceof Error) {
			next(error);
		} else {
			next(new Error("Unknown error in loginUser: " + JSON.stringify(error)));
		}
	}
};
