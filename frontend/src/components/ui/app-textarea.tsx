import type { TextareaHTMLAttributes } from "react";

type AppTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	error?: string | null;
};

export function AppTextarea({ error, className = "", ...props }: AppTextareaProps) {
	return (
		<div className="space-y-1">
			<textarea
				className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
					error
						? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
						: "border-zinc-300 focus:border-indigo-500 focus:ring-indigo-100"
				} ${className}`}
				{...props}
			/>
			{error && <p className="text-xs text-rose-700">{error}</p>}
		</div>
	);
}

