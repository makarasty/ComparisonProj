import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import userRepository from "../../repositories/UserRepository";

export function generateAuthToken(
	userId: Types.ObjectId,
	role: string,
): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET не задано на сервері");
	}

	const userIdStr = userId.toHexString();

	return jwt.sign({ userId: userIdStr, role }, secret, { expiresIn: "2h" });
}

export async function registerUserService(
	name: string,
	email: string,
	password: string,
): Promise<string> {
	const existing = await userRepository.findByEmail(email);
	if (existing) {
		throw new Error("Користувач з таким email вже існує");
	}

	const newUser = await userRepository.createUser({
		name,
		email,
		password,
		role: "user",
	});
	return newUser._id.toHexString();
}

export async function loginUserService(
	email: string,
	password: string,
): Promise<{
	token: string;
	userInfo: {
		id: string;
		email: string;
		role: string;
		name: string;
	};
}> {
	const user = await userRepository.findByEmail(email);
	if (!user) {
		throw new Error("Невірний email або пароль");
	}

	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		throw new Error("Невірний email або пароль");
	}

	const token = generateAuthToken(user._id, user.role);

	return {
		token,
		userInfo: {
			id: user._id.toHexString(),
			email: user.email,
			role: user.role,
			name: user.name,
		},
	};
}
