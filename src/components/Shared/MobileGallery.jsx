import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ARTWORKS } from "../../constants/data";
import Image from "../ui/Image";

const MobileGallery = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const navigate = useNavigate();

	const currentArtwork = ARTWORKS[currentIndex];

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % ARTWORKS.length);
	};

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev - 1 + ARTWORKS.length) % ARTWORKS.length);
	};

	return (
		<div className="fixed inset-0 bg-black">
			<div className="relative h-full flex flex-col">
				{/* Gallery Content */}
				<div className="flex-1 relative">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 p-4"
							onClick={() => navigate(`/works/${currentArtwork.id}`)}
						>
							<Image
								src={currentArtwork.image}
								alt={currentArtwork.title}
								className="w-full h-full"
								aspectRatio="aspect-[3/4]"
							/>
						</motion.div>
					</AnimatePresence>

					{/* Navigation Buttons */}
					<button
						onClick={(e) => {
							e.stopPropagation();
							handlePrev();
						}}
						className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
					>
						<ChevronLeft size={20} />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleNext();
						}}
						className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
					>
						<ChevronRight size={20} />
					</button>
				</div>

				{/* Info Panel */}
				<div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent px-6 pt-24 pb-8">
					<h2 className="text-2xl font-bold text-white mb-2">
						{currentArtwork.title}
					</h2>
					<p className="text-brand-yellow mb-2">{currentArtwork.year}</p>
					<p className="text-gray-300 line-clamp-2">
						{currentArtwork.description}
					</p>

					{/* Progress Dots */}
					<div className="flex justify-center gap-2 mt-6">
						{ARTWORKS.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`w-2 h-2 rounded-full transition-colors ${
									index === currentIndex
										? "bg-brand-pink"
										: "bg-white/50 hover:bg-white/70"
								}`}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MobileGallery;
