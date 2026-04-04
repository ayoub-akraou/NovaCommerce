"use client";

import { useEffect, useState } from "react";
import { type AdminUser } from "@/features/admin/users/api";
import {
	deleteAdminUserUseCase,
	getAdminUsersUseCase,
	updateAdminUserRoleUseCase,
} from "@/features/admin/users/use-cases";
import type { UserRole } from "@/features/auth/types";

export default function AdminUsersPage() {
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
	const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

	useEffect(() => {
		async function loadUsers() {
			setError(null);
			try {
				const data = await getAdminUsersUseCase();
				setUsers(Array.isArray(data) ? data : []);
			} catch {
				setError("Impossible de charger les utilisateurs.");
			} finally {
				setLoading(false);
			}
		}

		void loadUsers();
	}, []);

	async function handleRoleChange(userId: string, role: UserRole) {
		setUpdatingUserId(userId);
		setError(null);

		try {
			const updatedUser = await updateAdminUserRoleUseCase(userId, role);
			setUsers((current) => current.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
		} catch {
			setError("La mise a jour du role a echoue.");
		} finally {
			setUpdatingUserId(null);
		}
	}

	async function handleDeleteUser(userId: string) {
		const confirmed = window.confirm("Supprimer cet utilisateur ?");
		if (!confirmed) return;

		setDeletingUserId(userId);
		setError(null);

		try {
			await deleteAdminUserUseCase(userId);
			setUsers((current) => current.filter((user) => user.id !== userId));
		} catch {
			setError("La suppression de l'utilisateur a echoue.");
		} finally {
			setDeletingUserId(null);
		}
	}

	if (loading) {
		return <div className="mx-auto max-w-6xl p-6">Chargement des utilisateurs...</div>;
	}

	return (
		<section className="mx-auto max-w-6xl space-y-5 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
				<p className="text-sm text-zinc-500">{users.length} utilisateur(s)</p>
			</div>

			{error && (
				<p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
					{error}
				</p>
			)}

			<div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
				<table className="min-w-full text-left text-sm">
					<thead className="bg-zinc-50">
						<tr>
							<th className="px-4 py-3 font-semibold text-zinc-600">Nom</th>
							<th className="px-4 py-3 font-semibold text-zinc-600">Email</th>
							<th className="px-4 py-3 font-semibold text-zinc-600">Role</th>
							<th className="px-4 py-3 font-semibold text-zinc-600">Cree le</th>
							<th className="px-4 py-3 font-semibold text-zinc-600">Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.length === 0 ? (
							<tr>
								<td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
									Aucun utilisateur a afficher.
								</td>
							</tr>
						) : (
							users.map((user) => (
								<tr key={user.id} className="border-t border-zinc-100">
									<td className="px-4 py-3 text-zinc-800">{user.name}</td>
									<td className="px-4 py-3 text-zinc-600">{user.email}</td>
									<td className="px-4 py-3">
										<select
											value={user.role}
											onChange={(e) => void handleRoleChange(user.id, e.target.value as UserRole)}
											disabled={updatingUserId === user.id}
											className="rounded-lg border border-zinc-300 px-2 py-1 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
										>
											<option value="CUSTOMER">CUSTOMER</option>
											<option value="ADMIN">ADMIN</option>
										</select>
									</td>
									<td className="px-4 py-3 text-zinc-500">{new Date(user.createdAt).toLocaleDateString()}</td>
									<td className="px-4 py-3">
										<button
											type="button"
											onClick={() => void handleDeleteUser(user.id)}
											disabled={deletingUserId === user.id}
											className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
										>
											{deletingUserId === user.id ? "Suppression..." : "Supprimer"}
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}
