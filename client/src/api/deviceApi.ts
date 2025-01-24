import axios from "axios";
import { IDevice } from "../types";

const API_URL = "http://localhost:5305/api/devices";

export async function fetchDevices(): Promise<IDevice[]> {
	const response = await axios.get<{ data: IDevice[] }>(API_URL);
	return response.data.data;
}

export async function fetchDeviceById(id: string): Promise<IDevice> {
	const response = await axios.get<{ data: IDevice }>(`${API_URL}/${id}`);
	return response.data.data;
}

export async function createDevice(device: IDevice): Promise<IDevice> {
	const response = await axios.post<{ data: IDevice }>(API_URL, device);
	return response.data.data;
}

export async function updateDevice(
	id: string,
	data: Partial<IDevice>,
): Promise<IDevice> {
	const response = await axios.put<{ data: IDevice }>(`${API_URL}/${id}`, data);
	return response.data.data;
}

export async function deleteDevice(id: string): Promise<void> {
	await axios.delete(`${API_URL}/${id}`);
}

export async function loadExternalDevices(): Promise<IDevice[]> {
	const response = await axios.get<{ data: IDevice[] }>(
		`${API_URL}/external/load`,
	);
	return response.data.data;
}
