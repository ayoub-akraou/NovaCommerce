import { useAuthStore } from "@/store/auth.store";
import { login, mapAuthResponseToSession } from "./api";
import { LoginSchemaInput } from "./schema";

export async function loginUseCase(payload: LoginSchemaInput) {
	const data = await login(payload);
	const session = mapAuthResponseToSession(data);
	useAuthStore.getState().setSession(session);
}
