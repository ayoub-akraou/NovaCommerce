import type { ButtonHTMLAttributes, ReactNode } from "react";

type AppButtonVariant = "primary" | "secondary" | "danger";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: AppButtonVariant;
	fullWidth?: boolean;
	children: ReactNode;
};

const VARIANT_CLASSES: Record<AppButtonVariant, string> = {
	primary: "bg-indigo-600 text-white hover:bg-indigo-700",
	secondary: "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100",
	danger: "bg-rose-600 text-white hover:bg-rose-700",
};

export function AppButton({
	variant = "primary",
	fullWidth = false,
	className = "",
	children,
	...props
}: AppButtonProps) {
	return (
		<button
			className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
				VARIANT_CLASSES[variant]
			} ${fullWidth ? "w-full" : ""} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}

