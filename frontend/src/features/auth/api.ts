import { apiClient } from "@/lib/api-client";
import type { LoginResponse, RegisterResponse, RefreshResponse, LogoutResponse, AuthUser } from "./types";
import type { LoginSchemaInput, RegisterSchemaInput } from "./schema";

export async function login(payload: LoginSchemaInput): Promise<LoginResponse> {
	const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
	return data;
}

export async function register(payload: RegisterSchemaInput): Promise<RegisterResponse> {
	const { data } = await apiClient.post<RegisterResponse>("/auth/register", payload);
	return data;
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
	const { data } = await apiClient.post<RefreshResponse>("/auth/refresh", {
		refreshToken,
	});
	return data;
}

export async function logout(refreshToken: string): Promise<LogoutResponse> {
	const { data } = await apiClient.post<LogoutResponse>("/auth/logout", {
		refreshToken,
	});
	return data;
}

export function mapAuthResponseToSession(data: LoginResponse | RefreshResponse): {
	accessToken: string;
	refreshToken: string;
	user: AuthUser;
} {
	return {
		accessToken: data.accessToken,
		refreshToken: data.refreshToken,
		user: {
			id: data.id,
			name: data.name,
			email: data.email,
			role: data.role,
		},
	};
}
