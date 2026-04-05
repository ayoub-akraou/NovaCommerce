import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "@/components/shop/product-details/product-details-client";
import { getShopProductByIdServer } from "@/features/shop/products/server";

type ProductDetailsPageProps = {
	params: Promise<{ id: string }>;
};

// Récupère le produit par id côté serveur et affiche la page détail (ou 404).
export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
	const { id } = await params;
	const product = await getShopProductByIdServer(id);

	if (!product) {
		notFound();
	}

	return (
		<section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<Link href="/products" className="inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-800">
				{"<-"} Retour aux produits
			</Link>

			<ProductDetailsClient product={product} />
		</section>
	);
}
