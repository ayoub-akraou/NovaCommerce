import { email, z } from "zod";

export const loginSchema = z.object({
	email: z.email("Email is invalide"),
	password: z
		.string()
		.min(8, "Le mot de passe doit contenir au moins 8 caractères")
		.max(128, "Le mot de passe est trop long"),
});

export const registerSchema = z.object({
   name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(40, 'Le nom est trop long'),,
   email: z.email('Email invalide'),
   password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').max(128, 'Le mot de passe est trop long'),
})

export type LoginShemaInput = z.infer<typeof loginSchema>;
export type RegisterShemaInput = z.infer<typeof registerSchema>;