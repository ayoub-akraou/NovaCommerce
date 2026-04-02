"use client";

import { useEffect, useState } from "react";
import {
	createAdminCategoryUseCase,
	deleteAdminCategoryUseCase,
	getAdminCategoriesUseCase,
	updateAdminCategoryUseCase,
} from "@/features/admin/categories/use-cases";
import type { AdminCategory } from "@/features/admin/categories/types";
import { SimpleModal } from "@/components/ui/simple-modal";

export default function AdminCategoriesPage() {
	const [categories, setCategories] = useState<AdminCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [name, setName] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
	const [editName, setEditName] = useState("");

	useEffect(() => {
		async function loadCategories() {
			setLoading(true);
			setError(null);
			try {
				const data = await getAdminCategoriesUseCase();
				setCategories(Array.isArray(data) ? data : []);
			} catch {
				setError("Impossible de charger les categories.");
				setCategories([]);
			} finally {
				setLoading(false);
			}
		}

		void loadCategories();
	}, []);

	async function handleCreate(e: { preventDefault: () => void }) {
		e.preventDefault();
		const cleanName = name.trim();
		if (!cleanName) return;

		setSubmitting(true);
		setError(null);
		try {
			const created = await createAdminCategoryUseCase({ name: cleanName });
			setCategories((current) => [created, ...current]);
			setName("");
			setIsCreateModalOpen(false);
		} catch {
			setError("Creation de categorie echouee.");
		} finally {
			setSubmitting(false);
		}
	}

	function startEdit(category: AdminCategory) {
		setEditingCategoryId(category.id);
		setEditName(category.name);
	}

	function cancelEdit() {
		setEditingCategoryId(null);
		setEditName("");
	}

	async function handleUpdate(e: { preventDefault: () => void }) {
		e.preventDefault();
		if (!editingCategoryId) return;

		const cleanName = editName.trim();
		if (!cleanName) return;

		setUpdating(true);
		setError(null);
		try {
			const updated = await updateAdminCategoryUseCase(editingCategoryId, { name: cleanName });
			setCategories((current) =>
				current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
			);
			cancelEdit();
		} catch {
			setError("Mise a jour de categorie echouee.");
		} finally {
			setUpdating(false);
		}
	}

	async function handleDelete(category: AdminCategory) {
		const ok = window.confirm(`Supprimer la categorie "${category.name}" ?`);
		if (!ok) return;

		setError(null);
		try {
			await deleteAdminCategoryUseCase(category.id);
			setCategories((current) => current.filter((item) => item.id !== category.id));
		} catch {
			setError("Suppression de categorie echouee.");
		}
	}

	return (
		<section className="space-y-5">
			<div className="flex items-center justify-between gap-3">
				<h1 className="text-2xl font-bold">Gestion des categories</h1>
				<div className="flex items-center gap-3">
					<span className="text-sm text-zinc-500">{categories.length} categorie(s)</span>
					<button
						type="button"
						onClick={() => setIsCreateModalOpen(true)}
						className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
					>
						Ajouter
					</button>
				</div>
			</div>

			<SimpleModal open={isCreateModalOpen} title="Ajouter categorie" onClose={() => setIsCreateModalOpen(false)}>
				<form onSubmit={handleCreate} className="space-y-3">
					<div>
						<label htmlFor="category-name" className="mb-1 block text-sm font-medium text-zinc-700">
							Nom
						</label>
						<input
							id="category-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Ex: Electronics"
							className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
						/>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="submit"
							disabled={submitting || name.trim() === ""}
							className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{submitting ? "Creation..." : "Ajouter"}
						</button>
						<button
							type="button"
							onClick={() => setIsCreateModalOpen(false)}
							className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
						>
							Annuler
						</button>
					</div>
				</form>
			</SimpleModal>

			<SimpleModal open={Boolean(editingCategoryId)} title="Modifier categorie" onClose={cancelEdit}>
				<form onSubmit={handleUpdate} className="space-y-3">
					<div>
						<label htmlFor="category-edit-name" className="mb-1 block text-sm font-medium text-zinc-700">
							Nom
						</label>
						<input
							id="category-edit-name"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
						/>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="submit"
							disabled={updating || editName.trim() === ""}
							className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
							{updating ? "Mise a jour..." : "Enregistrer"}
						</button>
						<button
							type="button"
							onClick={cancelEdit}
							className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
							Annuler
						</button>
					</div>
				</form>
			</SimpleModal>

			{error && (
				<p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
					{error}
				</p>
			)}

			{loading ? (
				<div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">Chargement...</div>
			) : (
				<div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
					<table className="min-w-full text-left text-sm">
						<thead className="bg-zinc-50">
							<tr>
								<th className="px-4 py-3 font-semibold text-zinc-600">Nom</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Slug</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Produits</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Actions</th>
							</tr>
						</thead>
						<tbody>
							{categories.length === 0 ? (
								<tr>
									<td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
										Aucune categorie pour le moment.
									</td>
								</tr>
							) : (
								categories.map((category) => (
									<tr key={category.id} className="border-t border-zinc-100">
										<td className="px-4 py-3 font-medium text-zinc-800">{category.name}</td>
										<td className="px-4 py-3 text-zinc-600">{category.slug}</td>
										<td className="px-4 py-3 text-zinc-600">{category.products?.length ?? 0}</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() => startEdit(category)}
													className="rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
												>
													Modifier
												</button>
												<button
													type="button"
													onClick={() => void handleDelete(category)}
													className="rounded-lg border border-rose-300 px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
												>
													Supprimer
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
