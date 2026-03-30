"use client";

import { useEffect } from "react";
import { refreshUseCase } from "@/features/auth/use-cases";

export function AuthBootstrap() {
	useEffect(() => {
		void refreshUseCase();
	}, []);

	return null;
}
