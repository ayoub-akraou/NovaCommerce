"use client";

import { loginSchema } from "@/features/auth/schema";
import { loginUseCase } from "@/features/auth/use-cases";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<{
		email?: string;
		password?: string;
	}>({});

	async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		setFieldErrors({});

		const parsed = loginSchema.safeParse({ email, password });
		if (!parsed.success) {
			const tree = z.treeifyError(parsed.error);

			setFieldErrors({
				email: tree?.properties?.email?.errors?.[0],
				password: tree?.properties?.password?.errors?.[0],
			});
			setLoading(false);
			return;
		}

		try {
			await loginUseCase(parsed.data);
			router.push("/");
		} catch {
			setError("Email ou mot de passe invalide.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={onSubmit}>
			<input value={email} onChange={(e) => setEmail(e.target.value)} />
			<input value={password} onChange={(e) => setPassword(e.target.value)} />
			<button type="submit" disabled={loading}>
				{loading ? "Connexion..." : "Se connecter"}
			</button>
			{fieldErrors.email && <p>{fieldErrors.email}</p>}
			{fieldErrors.password && <p>{fieldErrors.password}</p>}
			{error && <p>{error}</p>}
		</form>
	);
}
