import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImageComponent = ({
	src,
	alt,
	className = "",
	aspectRatio = "aspect-[4/3]",
}) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const imageElement = document.createElement("img");
		imageElement.src = src;
		imageElement.onload = () => setIsLoaded(true);
		imageElement.onerror = () => setError(true);

		return () => {
			imageElement.onload = null;
			imageElement.onerror = null;
		};
	}, [src]);

	return (
		<div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
			<AnimatePresence>
				{!isLoaded && !error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-gradient-to-br from-brand-pink/10 to-black/30"
					/>
				)}
			</AnimatePresence>

			{error ? (
				<div className="absolute inset-0 flex items-center justify-center bg-black">
					<span className="text-white">Failed to load image</span>
				</div>
			) : (
				<motion.img
					src={src}
					alt={alt}
					initial={{ opacity: 0 }}
					animate={{ opacity: isLoaded ? 1 : 0 }}
					className={`w-full h-full object-cover ${className}`}
				/>
			)}
		</div>
	);
};

export default ImageComponent;
