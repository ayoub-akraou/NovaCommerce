"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const user = useAuthStore((s) => s.user);

	useEffect(() => {
		if (!user) {
			router.replace("/login");
			return;
		}

		if (user.role !== "ADMIN") {
			router.replace("/");
		}
	}, [user, router]);

	if (!user || user.role !== "ADMIN") {
		return null;
	}

	const links = [
		{ href: "/admin", label: "Dashboard" },
		{ href: "/admin/users", label: "Users" },
	];

	return (
		<section className="mx-auto w-full max-w-6xl p-6">
			<nav className="mb-6 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2">
				{links.map((link) => {
					const isActive = pathname === link.href;
					return (
						<Link
							key={link.href}
							href={link.href}
							className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
								isActive
									? "bg-indigo-600 text-white"
									: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
							}`}
						>
							{link.label}
						</Link>
					);
				})}
			</nav>
			{children}
		</section>
	);
}
