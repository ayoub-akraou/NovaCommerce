"use client";

import { registerSchema } from "@/features/auth/schema";
import { registerUseCase } from "@/features/auth/use-cases";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<{
		name?: string;
		email?: string;
		password?: string;
	}>({});

	async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		setFieldErrors({});

		const parsed = registerSchema.safeParse({ name, email, password });
		if (!parsed.success) {
			const tree = z.treeifyError(parsed.error);
			setFieldErrors({
				name: tree?.properties?.name?.errors?.[0],
				email: tree?.properties?.email?.errors?.[0],
				password: tree?.properties?.password?.errors?.[0],
			});
			setLoading(false);
			return;
		}

		try {
			await registerUseCase(parsed.data);
			router.push("/login");
		} catch {
			setError("Impossible de creer le compte pour le moment.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<section className="relative isolate mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
			<div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-indigo-200/60 blur-3xl" />
			<div className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-violet-200/60 blur-3xl" />

			<div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_10px_40px_-15px_rgba(2,6,23,0.25)] backdrop-blur-xl lg:grid-cols-5">
				<div className="relative hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-10 text-white lg:col-span-2 lg:block">
					<div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
						<span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-indigo-600">
							N
						</span>
						NovaCommerce
					</div>
					<h1 className="mt-8 text-3xl font-bold leading-tight">Cree ton compte en quelques secondes.</h1>
					<p className="mt-4 text-sm leading-6 text-indigo-100">
						Inscris-toi pour sauvegarder ton panier, suivre tes commandes et profiter d&apos;une experience plus fluide.
					</p>
					<div className="mt-10 space-y-3 text-sm text-indigo-100/95">
						<p>• Inscription rapide et securisee</p>
						<p>• Suivi des commandes en temps reel</p>
						<p>• Gestion de profil et adresses</p>
					</div>
				</div>

				<div className="col-span-3 p-6 sm:p-10">
					<div className="mb-8">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Inscription</p>
						<h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">Creer un compte</h2>
						<p className="mt-2 text-sm text-zinc-500">Rejoins NovaCommerce des maintenant.</p>
					</div>

					<form onSubmit={onSubmit} className="space-y-5">
						<div className="space-y-2">
							<label htmlFor="name" className="block text-sm font-medium text-zinc-700">
								Nom complet
							</label>
							<input
								id="name"
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full rounded-xl border border-zinc-300/90 bg-white px-3.5 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
								autoComplete="name"
							/>
							{fieldErrors.name && <p className="text-xs font-medium text-rose-600">{fieldErrors.name}</p>}
						</div>

						<div className="space-y-2">
							<label htmlFor="email" className="block text-sm font-medium text-zinc-700">
								Adresse email
							</label>
							<input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-xl border border-zinc-300/90 bg-white px-3.5 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
								autoComplete="email"
							/>
							{fieldErrors.email && <p className="text-xs font-medium text-rose-600">{fieldErrors.email}</p>}
						</div>

						<div className="space-y-2">
							<label htmlFor="password" className="block text-sm font-medium text-zinc-700">
								Mot de passe
							</label>
							<input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full rounded-xl border border-zinc-300/90 bg-white px-3.5 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
								autoComplete="new-password"
							/>
							{fieldErrors.password && <p className="text-xs font-medium text-rose-600">{fieldErrors.password}</p>}
						</div>

						<button
							type="submit"
							disabled={loading}
							className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{loading ? "Creation..." : "Creer mon compte"}
						</button>
					</form>

					{error && (
						<p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
							{error}
						</p>
					)}

					<p className="mt-6 text-sm text-zinc-500">
						Tu as deja un compte ?{" "}
						<Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
							Se connecter
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
