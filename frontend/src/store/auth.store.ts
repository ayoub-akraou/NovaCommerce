import { create } from "zustand";
import type { AuthUser } from "@/features/auth/types";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
	accessToken: string | null;
	refreshToken: string | null;
	user: AuthUser | null;
	hasHydrated: boolean;
	setHasHydrated: (v: boolean) => void;

	setSession: (payload: { accessToken: string; refreshToken: string; user: AuthUser }) => void;
	clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			accessToken: null,
			refreshToken: null,
			user: null,
			hasHydrated: false,
			setHasHydrated: (v) => set({ hasHydrated: v }),

			setSession: ({ accessToken, refreshToken, user }) => set({ accessToken, refreshToken, user }),
			clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
		}),
		{
			name: "novacommerce-auth",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
