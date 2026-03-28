import { apiClient } from "@/lib/api-client";
import type { LoginResponse, AuthUser, RegisterResponse } from "./types";
import { LoginShemaInput, RegisterShemaInput } from "./schema";

export async function login(payload: LoginShemaInput): Promise<LoginResponse> {
	const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
	return data;
}

export async function register(payload: RegisterShemaInput): Promise<RegisterResponse> {
	const { data } = await apiClient.post<RegisterResponse>("/auth/register", payload);
	return data;
}
