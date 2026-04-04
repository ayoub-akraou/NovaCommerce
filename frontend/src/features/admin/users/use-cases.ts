import { deleteAdminUser, getAdminUsers, updateAdminUserRole } from "./api";
import type { UserRole } from "@/features/auth/types";

export async function getAdminUsersUseCase() {
	return getAdminUsers();
}

export async function updateAdminUserRoleUseCase(userId: string, role: UserRole) {
	return updateAdminUserRole(userId, role);
}

export async function deleteAdminUserUseCase(userId: string) {
	return deleteAdminUser(userId);
}
