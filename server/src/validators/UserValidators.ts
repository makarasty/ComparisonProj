import { z } from "zod";

export const userUpdateSchema = z.object({
	name: z.string().min(1, "Name is required"),
});
