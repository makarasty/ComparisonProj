import { useEffect } from "react";

export const useScrollToTopOnMessages = (
	success: string | null,
	error: string | null,
) => {
	useEffect(() => {
		if (success || error) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [success, error]);
};
