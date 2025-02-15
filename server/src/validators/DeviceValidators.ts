import { z } from "zod";

export const deviceCreateSchema = z.object({
	uuid: z.number().optional(),
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().nonnegative(),
	brand: z.string().optional(),
	category: z.string().optional(),
	image: z.string().optional(),
	images: z.array(z.string()).optional(),
	rating: z.number().min(0).max(5).optional(),
	stock: z.number().nonnegative().optional(),
	discount: z.number().min(0).max(100).optional(),
	available: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	dimensions: z
		.object({
			width: z.number(),
			height: z.number(),
			depth: z.number(),
			weight: z.number().optional(),
			unit: z.string().optional(),
		})
		.optional(),
	specifications: z.record(z.any()).optional(),
	warranty: z
		.object({
			period: z.number(),
			unit: z.enum(["days", "months", "years"]),
			description: z.string().optional(),
		})
		.optional(),
	metadata: z
		.object({
			isBrandNew: z.boolean().optional(),
			isFeatured: z.boolean().optional(),
			isPopular: z.boolean().optional(),
		})
		.optional(),
});

export const deviceUpdateSchema = deviceCreateSchema.partial();
