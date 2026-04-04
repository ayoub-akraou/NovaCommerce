import { useState } from "react";
import { validateCheckoutAddress } from "./use-cases";

type UseCheckoutFormResult = {
	address: string;
	addressError: string | null;
	setAddress: (value: string) => void;
	validateNow: () => boolean;
};

export function useCheckoutForm(initialAddress = ""): UseCheckoutFormResult {
	const [address, setAddressState] = useState(initialAddress);
	const [addressError, setAddressError] = useState<string | null>(null);

	function setAddress(value: string) {
		setAddressState(value);
		if (addressError) setAddressError(null);
	}

	function validateNow(): boolean {
		const validation = validateCheckoutAddress(address);
		setAddressError(validation.error);
		return validation.isValid;
	}

	return {
		address,
		addressError,
		setAddress,
		validateNow,
	};
}

