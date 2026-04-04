import { toAbsoluteImageUrl } from "@/features/shop/products/image-url";

type ProductImageGalleryProps = {
	title: string;
	images: string[];
	selectedImageIndex: number;
	onSelectImage: (index: number) => void;
};

export function ProductImageGallery({
	title,
	images,
	selectedImageIndex,
	onSelectImage,
}: ProductImageGalleryProps) {
	const parsedImages = images
		.map((image) => toAbsoluteImageUrl(image))
		.filter((image): image is string => Boolean(image));
	const activeImage = parsedImages[selectedImageIndex] ?? null;

	return (
		<div className="space-y-3">
			<div className="flex h-96 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
				{activeImage ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={activeImage} alt={title} className="h-full w-full object-contain" />
				) : (
					<span className="text-sm text-zinc-500">Aucune image</span>
				)}
			</div>

			{parsedImages.length > 1 && (
				<div className="grid grid-cols-4 gap-2">
					{parsedImages.map((image, index) => (
						<button
							type="button"
							key={`${image}-${index}`}
							onClick={() => onSelectImage(index)}
							className={`overflow-hidden rounded-xl border ${selectedImageIndex === index ? "border-indigo-500" : "border-zinc-200"}`}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={image} alt={`${title} ${index + 1}`} className="h-20 w-full object-cover" />
						</button>
					))}
				</div>
			)}
		</div>
	);
}
