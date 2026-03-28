import { apiClient } from "@/lib/api-client";
import type { LoginResponse, AuthUser, RegisterResponse } from "./types";
import { LoginShemaInput, RegisterShemaInput } from "./schema";

export async function login(payload: LoginShemaInput): Promise<LoginResponse> {
	const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
	return data;
}
