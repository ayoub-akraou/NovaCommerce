import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use((request) => {
	const token = useAuthStore.getState().accessToken;

	if (token) {
		request.headers.Authorization = `Bearer ${token}`;
	}

	return request;
});
