import { z } from "zod";

const envSchema = z.object({
	VITE_API_URL: z.url().default("http://localhost:3000/api"),
});

export const env = envSchema.parse(import.meta.env);
