import { useAuthStore } from "@/store/auth.store";
import { login, logout, mapAuthResponseToSession, refresh, register } from "./api";
import type { LoginSchemaInput, RegisterSchemaInput } from "./schema";

export async function loginUseCase(payload: LoginSchemaInput) {
	const data = await login(payload);
	const session = mapAuthResponseToSession(data);
	useAuthStore.getState().setSession(session);
	return data;
}

export async function registerUseCase(payload: RegisterSchemaInput) {
	return register(payload);
}

export async function refreshUseCase() {
	const { refreshToken } = useAuthStore.getState();

	if (!refreshToken) return null;

	const data = await refresh(refreshToken);
	const session = mapAuthResponseToSession(data);
	useAuthStore.getState().setSession(session);

	return data;
}

export async function logoutUseCase() {
	const { refreshToken, clearSession } = useAuthStore.getState();
	if (refreshToken) {
		await logout(refreshToken);
	}
	clearSession();
}
