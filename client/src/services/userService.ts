import axios, { AxiosResponse } from "axios";
import { IUser } from "../types/user";

const USERS_API_URL = "http://localhost:5305/api/users";

function getAuthConfig() {
	const token = localStorage.getItem("token");
	return {
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
		},
	};
}

export async function fetchAllUsers(): Promise<IUser[]> {
	const resp: AxiosResponse<{ data: IUser[] }> = await axios.get(
		USERS_API_URL,
		getAuthConfig(),
	);
	return resp.data.data;
}

export async function deleteUserById(id: string): Promise<void> {
	await axios.delete(`${USERS_API_URL}/${id}`, getAuthConfig());
}

export async function updateUserName(
	id: string,
	newName: string,
): Promise<IUser> {
	const resp: AxiosResponse<{ data: IUser }> = await axios.put(
		`${USERS_API_URL}/${id}`,
		{ name: newName },
		getAuthConfig(),
	);
	return resp.data.data;
}
