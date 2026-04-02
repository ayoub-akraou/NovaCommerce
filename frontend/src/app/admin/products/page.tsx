"use client";

import { useEffect, useState } from "react";
import {
	createAdminProductUseCase,
	deleteAdminProductUseCase,
	getAdminProductsUseCase,
	updateAdminProductUseCase,
} from "@/features/admin/products/use-cases";
import type { AdminProduct } from "@/features/admin/products/types";
import { getAdminCategoriesUseCase } from "@/features/admin/categories/use-cases";
import type { AdminCategory } from "@/features/admin/categories/types";
import { SimpleModal } from "@/components/ui/simple-modal";

export default function AdminProductsPage() {
	const [products, setProducts] = useState<AdminProduct[]>([]);
	const [categories, setCategories] = useState<AdminCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [search, setSearch] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const [formCategoryId, setFormCategoryId] = useState("");
	const [formTitle, setFormTitle] = useState("");
	const [formDescription, setFormDescription] = useState("");
	const [formPrice, setFormPrice] = useState("");
	const [formStock, setFormStock] = useState("0");
	const [formImages, setFormImages] = useState("");

	const [editingProductId, setEditingProductId] = useState<string | null>(null);
	const [editCategoryId, setEditCategoryId] = useState("");
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [editPrice, setEditPrice] = useState("");
	const [editStock, setEditStock] = useState("0");
	const [editImages, setEditImages] = useState("");

	useEffect(() => {
		async function loadBaseData() {
			setLoading(true);
			setError(null);
			try {
				const [categoriesData, productsData] = await Promise.all([
					getAdminCategoriesUseCase(),
					getAdminProductsUseCase({ page: 1, limit: 50 }),
				]);

				const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];
				setCategories(safeCategories);
				setProducts(Array.isArray(productsData?.items) ? productsData.items : []);

				if (safeCategories.length > 0) {
					setFormCategoryId((current) => current || safeCategories[0].id);
				}
			} catch {
				setError("Impossible de charger les produits/categorie.");
				setCategories([]);
				setProducts([]);
			} finally {
				setLoading(false);
			}
		}

		void loadBaseData();
	}, []);

	async function handleCreate(e: { preventDefault: () => void }) {
		e.preventDefault();
		const title = formTitle.trim();
		const price = Number(formPrice);
		const stock = Number(formStock);
		const images = formImages
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);

		if (!formCategoryId || !title || Number.isNaN(price)) {
			setError("Category, title et price sont obligatoires.");
			return;
		}

		setCreating(true);
		setError(null);
		try {
			const created = await createAdminProductUseCase({
				categoryId: formCategoryId,
				title,
				description: formDescription.trim() || undefined,
				price,
				stock: Number.isNaN(stock) ? 0 : stock,
				images,
			});
			setProducts((current) => [created, ...current]);
			setFormTitle("");
			setFormDescription("");
			setFormPrice("");
			setFormStock("0");
			setFormImages("");
			setIsCreateModalOpen(false);
		} catch {
			setError("Creation du produit echouee.");
		} finally {
			setCreating(false);
		}
	}

	function startEdit(product: AdminProduct) {
		setEditingProductId(product.id);
		setEditCategoryId(product.categoryId);
		setEditTitle(product.title);
		setEditDescription(product.description ?? "");
		setEditPrice(String(product.price));
		setEditStock(String(product.stock));
		setEditImages((product.images ?? []).join(", "));
	}

	function cancelEdit() {
		setEditingProductId(null);
		setEditCategoryId("");
		setEditTitle("");
		setEditDescription("");
		setEditPrice("");
		setEditStock("0");
		setEditImages("");
	}

	async function handleUpdate(e: { preventDefault: () => void }) {
		e.preventDefault();
		if (!editingProductId) return;

		const title = editTitle.trim();
		const price = Number(editPrice);
		const stock = Number(editStock);
		const images = editImages
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);

		if (!editCategoryId || !title || Number.isNaN(price) || Number.isNaN(stock)) {
			setError("Category, title, price et stock sont obligatoires.");
			return;
		}

		setUpdating(true);
		setError(null);
		try {
			const updated = await updateAdminProductUseCase(editingProductId, {
				categoryId: editCategoryId,
				title,
				description: editDescription.trim() || undefined,
				price,
				stock,
				images,
			});
			setProducts((current) =>
				current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
			);
			cancelEdit();
		} catch {
			setError("Mise a jour du produit echouee.");
		} finally {
			setUpdating(false);
		}
	}

	async function handleDelete(product: AdminProduct) {
		const ok = window.confirm(`Supprimer le produit "${product.title}" ?`);
		if (!ok) return;

		setError(null);
		try {
			await deleteAdminProductUseCase(product.id);
			setProducts((current) => current.filter((item) => item.id !== product.id));
		} catch {
			setError("Suppression du produit echouee.");
		}
	}

	const displayedProducts = products.filter((product) => {
		const q = search.trim().toLowerCase();
		if (!q) return true;
		return product.title.toLowerCase().includes(q) || product.slug.toLowerCase().includes(q);
	});

	return (
		<section className="space-y-5">
			<div className="flex items-center justify-between gap-3">
				<h1 className="text-2xl font-bold">Gestion des produits</h1>
				<div className="flex items-center gap-3">
					<span className="text-sm text-zinc-500">{products.length} produit(s)</span>
					<button
						type="button"
						onClick={() => setIsCreateModalOpen(true)}
						className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
					>
						Ajouter
					</button>
				</div>
			</div>

			<SimpleModal open={isCreateModalOpen} title="Ajouter produit" onClose={() => setIsCreateModalOpen(false)}>
				<form onSubmit={handleCreate} className="space-y-3">
					<div className="grid gap-3 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm font-medium text-zinc-700">Category</label>
							<select
								value={formCategoryId}
								onChange={(e) => setFormCategoryId(e.target.value)}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
								<option value="">Selectionner</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-zinc-700">Title</label>
							<input
								value={formTitle}
								onChange={(e) => setFormTitle(e.target.value)}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-zinc-700">Price</label>
							<input
								type="number"
								min="0"
								step="0.01"
								value={formPrice}
								onChange={(e) => setFormPrice(e.target.value)}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-zinc-700">Stock</label>
							<input
								type="number"
								min="0"
								value={formStock}
								onChange={(e) => setFormStock(e.target.value)}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="mb-1 block text-sm font-medium text-zinc-700">Description</label>
							<textarea
								value={formDescription}
								onChange={(e) => setFormDescription(e.target.value)}
								rows={3}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="mb-1 block text-sm font-medium text-zinc-700">
								Images (URL, separees par virgule)
							</label>
							<input
								value={formImages}
								onChange={(e) => setFormImages(e.target.value)}
								placeholder="https://img-1.jpg, https://img-2.jpg"
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
					</div>
					<div className="mt-3 flex items-center gap-2">
						<button
							type="submit"
							disabled={creating}
							className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
							{creating ? "Creation..." : "Ajouter produit"}
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

			<SimpleModal open={Boolean(editingProductId)} title="Modifier produit" onClose={cancelEdit}>
				<form onSubmit={handleUpdate} className="space-y-3">
					<div className="grid gap-3 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm font-medium text-zinc-700">Category</label>
							<select
								value={editCategoryId}
								onChange={(e) => setEditCategoryId(e.target.value)}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
								<option value="">Selectionner</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-zinc-700">Title</label>
							<input
								value={editTitle}
								onChange={(e) => setEditTitle(e.target.value)}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-zinc-700">Price</label>
							<input
								type="number"
								min="0"
								step="0.01"
								value={editPrice}
								onChange={(e) => setEditPrice(e.target.value)}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-zinc-700">Stock</label>
							<input
								type="number"
								min="0"
								value={editStock}
								onChange={(e) => setEditStock(e.target.value)}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="mb-1 block text-sm font-medium text-zinc-700">Description</label>
							<textarea
								value={editDescription}
								onChange={(e) => setEditDescription(e.target.value)}
								rows={3}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="mb-1 block text-sm font-medium text-zinc-700">
								Images (URL, separees par virgule)
							</label>
							<input
								value={editImages}
								onChange={(e) => setEditImages(e.target.value)}
								className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							/>
						</div>
					</div>
					<div className="mt-3 flex items-center gap-2">
						<button
							type="submit"
							disabled={updating}
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

			<div className="rounded-2xl border border-zinc-200 bg-white p-4">
				<label className="mb-1 block text-sm font-medium text-zinc-700">Recherche</label>
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Titre ou slug"
					className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
				/>
			</div>

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
								<th className="px-4 py-3 font-semibold text-zinc-600">Titre</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Category</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Prix</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Stock</th>
								<th className="px-4 py-3 font-semibold text-zinc-600">Actions</th>
							</tr>
						</thead>
						<tbody>
							{displayedProducts.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
										Aucun produit a afficher.
									</td>
								</tr>
							) : (
								displayedProducts.map((product) => (
									<tr key={product.id} className="border-t border-zinc-100">
										<td className="px-4 py-3">
											<p className="font-medium text-zinc-800">{product.title}</p>
											<p className="text-xs text-zinc-500">{product.slug}</p>
										</td>
										<td className="px-4 py-3 text-zinc-600">{product.category?.name ?? "-"}</td>
										<td className="px-4 py-3 text-zinc-600">{Number(product.price).toFixed(2)} MAD</td>
										<td className="px-4 py-3 text-zinc-600">{product.stock}</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() => startEdit(product)}
													className="rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100">
													Modifier
												</button>
												<button
													type="button"
													onClick={() => void handleDelete(product)}
													className="rounded-lg border border-rose-300 px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-50">
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
