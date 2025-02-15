export async function fetchJSON<T>(
	url: string,
	init?: RequestInit,
): Promise<T> {
	const response = await fetch(url, init);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch: ${response.status} ${response.statusText}`,
		);
	}

	return (await response.json()) as T;
}
