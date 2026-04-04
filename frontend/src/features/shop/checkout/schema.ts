import { z } from "zod";

export const checkoutAddressSchema = z.object({
	address: z.string().trim().min(5, "Adresse invalide (minimum 5 caractères)."),
});

export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;

