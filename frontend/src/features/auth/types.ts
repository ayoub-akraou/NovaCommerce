export type UserRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
};

export type AuthTokens = {
	accessToken: string;
	refreshToken: string;
};

export type LoginResponse = AuthTokens & AuthUser;
export type RefreshResponse = AuthTokens & AuthUser;

export type RegisterResponse = AuthUser & {
	createdAt: string;
};

export type LogoutResponse = {
	success: boolean;
};
