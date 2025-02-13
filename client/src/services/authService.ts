import axios, { AxiosResponse } from "axios";

const AUTH_API_URL = "http://localhost:5305/api/auth";

export interface IRegisterData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface IRegisterResponse {
	message: string;
	userId?: string;
}

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
	data: IRegisterData,
): Promise<IRegisterResponse> {
	const resp: AxiosResponse<IRegisterResponse> = await axios.post(
		`${AUTH_API_URL}/register`,
		data,
	);
	return resp.data;
}

export async function login(
	email: string,
	password: string,
): Promise<ILoginResponse> {
	const resp: AxiosResponse<ILoginResponse> = await axios.post(
		`${AUTH_API_URL}/login`,
		{
			email,
			password,
		},
	);
	if (resp.data.token) {
		localStorage.setItem("token", resp.data.token);
	}
	return resp.data;
}

export function logout(): void {
	localStorage.removeItem("token");
}

export function getCurrentUser(): {
	id: string;
	role: string;
	exp?: number;
	iat?: number;
} | null {
	try {
		const token = localStorage.getItem("token");
		if (!token) return null;

		const base64Url = token.split(".")[1];
		if (!base64Url) return null;

		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join(""),
		);
		const parsed = JSON.parse(jsonPayload);
		return {
			id: parsed.userId,
			role: parsed.role,
			exp: parsed.exp,
			iat: parsed.iat,
		};
	} catch {
		return null;
	}
}
