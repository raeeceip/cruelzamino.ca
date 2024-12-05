import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, ArrowLeft, ArrowRight } from "lucide-react";
import { useKeyPress } from "../hooks/useKeyPress";

export function Details({
	artwork,
	onClose,
	onNext,
	onPrevious,
	hasNext = true,
	hasPrevious = true,
}) {
	useKeyPress("Escape", onClose);
	useKeyPress("ArrowRight", () => hasNext && onNext?.());
	useKeyPress("ArrowLeft", () => hasPrevious && onPrevious?.());

	const shareArtwork = async () => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: artwork.title,
					text: `Check out "${artwork.title}" by ${artwork.artist}`,
					url: window.location.href,
				});
			} else {
				await navigator.clipboard.writeText(window.location.href);
				alert("Link copied to clipboard!");
			}
		} catch (error) {
			console.error("Error sharing:", error);
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black bg-opacity-95 z-50 flex justify-center items-center p-4"
				onClick={onClose}
			>
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{ type: "spring", duration: 0.5 }}
					className="w-full max-w-6xl h-[90vh] bg-gray-900 rounded-2xl overflow-hidden relative grid md:grid-cols-[1.2fr,1fr] grid-rows-[auto,1fr] md:grid-rows-1"
					onClick={(e) => e.stopPropagation()}
				>
					<motion.button
						onClick={onClose}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 hover:bg-opacity-80"
					>
						<X size={24} />
					</motion.button>

					<div className="relative bg-gray-950 flex items-center justify-center">
						<motion.img
							src={artwork.image}
							alt={artwork.title}
							className="max-w-full max-h-full object-contain"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
						/>
					</div>

					<div className="p-8 overflow-y-auto flex flex-col gap-6">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<h1 className="text-4xl font-semibold text-white">
								{artwork.title}
							</h1>
							<h2 className="text-xl text-gray-400 mt-2">
								{artwork.artist}, {artwork.year}
							</h2>
						</motion.div>

						<motion.p
							className="text-lg leading-relaxed text-gray-300"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
						>
							{artwork.description}
						</motion.p>

						<motion.div
							className="grid grid-cols-2 gap-6 bg-black bg-opacity-20 p-6 rounded-xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
						>
							<div>
								<h3 className="text-sm text-gray-400 uppercase tracking-wider">
									Technique
								</h3>
								<p className="text-white mt-1">
									{artwork.technique || "Mixed Media"}
								</p>
							</div>
							<div>
								<h3 className="text-sm text-gray-400 uppercase tracking-wider">
									Dimensions
								</h3>
								<p className="text-white mt-1">{`${artwork.dimensions.width}m × ${artwork.dimensions.height}m`}</p>
							</div>
							<div>
								<h3 className="text-sm text-gray-400 uppercase tracking-wider">
									Medium
								</h3>
								<p className="text-white mt-1">{artwork.medium}</p>
							</div>
							{artwork.price && (
								<div>
									<h3 className="text-sm text-gray-400 uppercase tracking-wider">
										Price
									</h3>
									<p className="text-white mt-1">{artwork.price}</p>
								</div>
							)}
						</motion.div>

						<div className="flex flex-wrap gap-4 mt-auto">
							<motion.button
								onClick={shareArtwork}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-20"
							>
								<Share size={18} />
								Share Artwork
							</motion.button>

							{hasPrevious && (
								<motion.button
									onClick={onPrevious}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="flex items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-20"
								>
									<ArrowLeft size={18} />
									Previous
								</motion.button>
							)}

							{hasNext && (
								<motion.button
									onClick={onNext}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="flex items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-20"
								>
									Next
									<ArrowRight size={18} />
								</motion.button>
							)}
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
