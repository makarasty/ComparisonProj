import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../validators/AuthValidators";
import { registerUserService, loginUserService } from "../services/AuthService";

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

export async function registerUser(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const parsed = registerSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				message: parsed.error.errors.map((e) => e.message).join(", "),
			});
			return;
		}
		const { name, email, password } = parsed.data;

		const newUserId = await registerUserService(name, email, password);

		res.status(201).json({
			message: "Реєстрація пройшла успішно",
			userId: newUserId,
		});
	} catch (error: unknown) {
		console.error("Error registering user:", error);
		if (error instanceof Error) {
			next(error);
			return;
		}
		next(new Error("Unknown error in registerUser"));
	}
}

export async function loginUser(
	req: Request,
	res: Response<ILoginResponse>,
	next: NextFunction,
): Promise<void> {
	try {
		const parsed = loginSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				message: parsed.error.errors.map((e) => e.message).join(", "),
			});
			return;
		}
		const { email, password } = parsed.data;

		const { token, userInfo } = await loginUserService(email, password);

		res.json({
			message: "Успішний вхід",
			token,
			user: userInfo,
		});
	} catch (error: unknown) {
		console.error("Error logging in user:", error);
		if (error instanceof Error) {
			res.status(401).json({ message: error.message });
			return;
		}
		next(new Error("Unknown error in loginUser"));
	}
}
