import { apiClient } from "@/lib/api-client";
import type { UserRole } from "@/features/auth/types";

export type AdminUser = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	createdAt: string;
};

export async function getAdminUsers(): Promise<AdminUser[]> {
	const { data } = await apiClient.get<AdminUser[]>("/admin/users");
	return data;
}

export async function updateAdminUserRole(userId: string, role: UserRole): Promise<AdminUser> {
	const { data } = await apiClient.patch<AdminUser>(`/admin/users/${userId}/role`, { role });
	return data;
}
