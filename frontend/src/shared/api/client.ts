import axios from "axios";
import { env } from "@/app/config/env.ts";

export const baseApi = axios.create({
	baseURL: env.VITE_API_URL,
	withCredentials: true,
});
