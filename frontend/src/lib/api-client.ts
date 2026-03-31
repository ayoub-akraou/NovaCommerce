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

type RefreshResponse = {
	accessToken: string;
	refreshToken: string;
	id: string;
	name: string;
	email: string;
	role: "CUSTOMER" | "ADMIN";
};

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error?.config;
		const status = error?.response?.status;

		if (!originalRequest || status !== 401 || originalRequest._retry) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;
		const { refreshToken, setSession, clearSession } = useAuthStore.getState();

		if (!refreshToken) {
			clearSession();
			return Promise.reject(error);
		}

		try {
			const { data } = await axios.post<RefreshResponse>(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
				{ refreshToken },
			);

			setSession({
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				user: {
					id: data.id,
					name: data.name,
					email: data.email,
					role: data.role,
				},
			});

			originalRequest.headers = originalRequest.headers ?? {};
			originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

			return apiClient(originalRequest);
		} catch {
			clearSession();
			return Promise.reject(error);
		}
	},
);
