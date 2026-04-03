const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function toAbsoluteImageUrl(raw?: string): string | null {
	const value = raw?.trim().replace(/\\/g, "/");
	if (!value) return null;
	if (value.startsWith("data:image/")) return value;
	if (value.startsWith("http://") || value.startsWith("https://")) return value;
	if (value.startsWith("//")) return `https:${value}`;
	return `${API_URL}/${value.replace(/^\/+/, "")}`;
}
