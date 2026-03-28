export type UserRole = 'CUSTOMER' | 'ADMIN';

export type AuthUser = {
   id: string;
   name: string;
   email: string;
   role: UserRole;
}

export type LoginInput = {
   email: string;
   password: string;
}

export type RegisterInput {
   name: string;
   email: string;
   password: string;
}

export type AuthResponse = {
   accessToken: string;
   refreshToken: string;
   user: AuthUser;
}