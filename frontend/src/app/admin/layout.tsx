"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
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

	return <>{children}</>;
}
