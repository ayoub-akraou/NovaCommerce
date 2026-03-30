import Link from "next/link";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/login", label: "Login" },
	{ href: "/register", label: "Register" },
];

export function MainNavbar() {
	return (
		<header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-zinc-900">
					<span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-sm">
						N
					</span>
					<span className="text-[15px]">NovaCommerce</span>
				</Link>

				<nav className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
}
