import Link from "next/link";

export default function Home() {
	return (
		<div className="overflow-hidden bg-zinc-50">
			<section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
				<div className="absolute -left-16 top-14 h-56 w-56 animate-float-slow rounded-full bg-indigo-300/35 blur-3xl" />
				<div className="absolute -right-10 top-24 h-52 w-52 animate-float-medium rounded-full bg-fuchsia-300/30 blur-3xl" />

				<div className="relative grid items-center gap-10 lg:grid-cols-2">
					<div className="space-y-6">
						<span className="inline-flex rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm">
							New Experience
						</span>

						<h1 className="text-balance text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
							Your next favorite product is one scroll away.
						</h1>

						<p className="max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
							NovaCommerce combines curated products, smooth checkout flow, and a premium visual experience built for modern shoppers.
						</p>

						<div className="flex flex-wrap items-center gap-3">
							<Link
								href="/products"
								className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
							>
								Shop now
							</Link>
							<Link
								href="/register"
								className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
							>
								Create account
							</Link>
						</div>

						<div className="grid max-w-lg grid-cols-3 gap-3 pt-2">
							{[
								{ label: "Products", value: "1.2k+" },
								{ label: "Happy clients", value: "18k+" },
								{ label: "Avg rating", value: "4.9/5" },
							].map((item) => (
								<div key={item.label} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
									<p className="text-lg font-bold text-zinc-900">{item.value}</p>
									<p className="text-xs text-zinc-500">{item.label}</p>
								</div>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-indigo-400/40 via-violet-400/30 to-fuchsia-400/30 blur-2xl" />
						<div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white p-3 shadow-2xl">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80"
								alt="Modern ecommerce hero"
								className="h-[420px] w-full rounded-2xl object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
				<div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
					<div className="mb-6 flex items-end justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Categories</p>
							<h2 className="mt-1 text-2xl font-bold text-zinc-900">Explore by mood</h2>
						</div>
						<Link href="/products" className="text-sm font-semibold text-indigo-700 hover:text-indigo-800">
							View all
						</Link>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{
								title: "Tech Essentials",
								image:
									"https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
							},
							{
								title: "Home & Living",
								image:
									"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
							},
							{
								title: "Fashion Picks",
								image:
									"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
							},
							{
								title: "Accessories",
								image:
									"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
							},
						].map((category) => (
							<Link
								key={category.title}
								href="/products"
								className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
							>
								<div className="overflow-hidden">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={category.image}
										alt={category.title}
										className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
									/>
								</div>
								<div className="p-4">
									<h3 className="text-sm font-semibold text-zinc-900">{category.title}</h3>
									<p className="mt-1 text-xs text-zinc-500">Fresh arrivals every week</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
				<div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-xl">
					<div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">NovaCommerce Prime</p>
							<h2 className="mt-2 text-3xl font-bold tracking-tight">Fast delivery, exclusive drops, premium support.</h2>
							<p className="mt-2 max-w-2xl text-sm text-white/90">
								Unlock weekly members-only offers and save more on every order.
							</p>
						</div>
						<Link
							href="/register"
							className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-indigo-700 transition hover:bg-zinc-100"
						>
							Join now
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
