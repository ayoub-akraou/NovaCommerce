"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutUseCase } from "@/features/auth/use-cases";
import { getMyCartUseCase } from "@/features/shop/cart/use-cases";
import { getMyOrdersUseCase } from "@/features/shop/orders/use-cases";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

export function MainNavbar() {
	const router = useRouter();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const user = useAuthStore((state) => state.user);
	const hasHydrated = useAuthStore((state) => state.hasHydrated);
	const itemsCount = useCartStore((state) => state.itemsCount);
	const setFromCart = useCartStore((state) => state.setFromCart);
	const clearCart = useCartStore((state) => state.clearCart);
	const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

	const navLinks = user
		? [
				{ href: "/", label: "Home" },
				{ href: "/products", label: "Products" },
				{ href: "/orders", label: "Orders" },
				...(user.role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
			]
		: [
				{ href: "/", label: "Home" },
				{ href: "/products", label: "Products" },
				{ href: "/login", label: "Login" },
				{ href: "/register", label: "Register" },
			];

	useEffect(() => {
		if (!hasHydrated) return;
		if (!user) {
			clearCart();
			setPendingOrdersCount(0);
			return;
		}

		async function syncCartCount() {
			try {
				const cart = await getMyCartUseCase();
				setFromCart(cart);
			} catch {
				clearCart();
			}
		}

		void syncCartCount();
	}, [hasHydrated, user, setFromCart, clearCart]);

	useEffect(() => {
		if (!hasHydrated) return;
		if (!user) {
			setPendingOrdersCount(0);
			return;
		}

		async function syncOrdersBadge() {
			try {
				const orders = await getMyOrdersUseCase();
				const pendingCount = orders.filter((order) => order.status === "PENDING").length;
				setPendingOrdersCount(pendingCount);
			} catch {
				setPendingOrdersCount(0);
			}
		}

		void syncOrdersBadge();
	}, [hasHydrated, user]);

	async function handleLogout() {
		setIsLoggingOut(true);
		try {
			await logoutUseCase();
			clearCart();
			router.replace("/login");
		} finally {
			setIsLoggingOut(false);
		}
	}

	return (
		<header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl">
			<div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-zinc-900">
					<span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-sm">
						N
					</span>
					<span className="text-[15px]">NovaCommerce</span>
				</Link>

				<nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-sm md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="relative rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
						>
							{link.label}
							{link.href === "/orders" && pendingOrdersCount > 0 && (
								<span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
									{pendingOrdersCount > 99 ? "99+" : pendingOrdersCount}
								</span>
							)}
						</Link>
					))}
				</nav>

				<div className="ml-auto flex items-center gap-2">
					<Link
						href="/cart"
						aria-label="Cart"
						className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 transition hover:border-indigo-500 hover:text-indigo-700"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-5 w-5"
						>
							<circle cx="9" cy="20" r="1" />
							<circle cx="17" cy="20" r="1" />
							<path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7H7" />
						</svg>
						{itemsCount > 0 && (
							<span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white">
								{itemsCount > 99 ? "99+" : itemsCount}
							</span>
						)}
					</Link>

					{user && (
						<button
							type="button"
							onClick={handleLogout}
							disabled={isLoggingOut}
							aria-label="Logout"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-5 w-5"
							>
								<path d="M12 2v10" />
								<path d="M18.36 5.64a9 9 0 1 1-12.72 0" />
							</svg>
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
