import { useAuthStore } from "@/store/auth.store";
import { login, mapAuthResponseToSession, register } from "./api";
import { LoginSchemaInput, RegisterSchemaInput } from "./schema";

export async function loginUseCase(payload: LoginSchemaInput) {
	const data = await login(payload);
	const session = mapAuthResponseToSession(data);
	useAuthStore.getState().setSession(session);
}

export async function registerUseCase(payload: RegisterSchemaInput) {
	return register(payload);
}
