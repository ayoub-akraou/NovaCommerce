export type UserRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
};

export type LoginInput = {
	email: string;
	password: string;
};
