import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
	userId: string;
	role: string;
}

export const authMiddleware: RequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(401).json({ message: "Authorization header missing" });
			return;
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			res.status(401).json({ message: "Token missing" });
			return;
		}

		const secret = process.env.JWT_SECRET;
		if (!secret) {
			res.status(500).json({ message: "JWT_SECRET not set on server" });
			return;
		}

		const decoded = jwt.verify(token, secret) as JwtPayload;
		(req as any).user = {
			id: decoded.userId,
			role: decoded.role,
		};

		next();
	} catch (error) {
		console.error("authMiddleware error:", error);
		res.status(401).json({ message: "Invalid or expired token" });
	}
};
