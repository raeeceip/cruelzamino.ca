import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

/**
 * Enhanced Image component with error handling and placeholder support
 *
 * @param {Object} props Component props
 * @param {string} props.src Image source URL
 * @param {string} props.alt Alternative text for the image
 * @param {string} props.className CSS classes for the image
 * @param {number} props.index Index for generating placeholder gradient color
 * @param {React.ReactNode} props.fallback Custom fallback component to render if image fails to load
 * @returns {React.ReactElement} The image component
 */
const Image = ({
	src,
	alt,
	className = "",
	index = 0,
	fallback = null,
	aspectRatio = null,
	...props
}) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState(false);
	const imgRef = useRef(null);

	// Generate a placeholder color based on the index
	const generatePlaceholderGradient = (idx) => {
		const colors = [
			"linear-gradient(135deg, #FF1493 0%, #333 100%)",
			"linear-gradient(135deg, #FDDA0D 0%, #333 100%)",
			"linear-gradient(135deg, #6B46C1 0%, #333 100%)",
			"linear-gradient(135deg, #38B2AC 0%, #333 100%)",
			"linear-gradient(135deg, #ED8936 0%, #333 100%)",
		];
		return colors[idx % colors.length];
	};

	// Reset connection on visibility change (helps prevent texture loss when tab switches)
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible' && imgRef.current && src) {
				// Force image reload to help with Three.js texture connections
				setTimeout(() => {
					if (imgRef.current) {
						const currentSrc = imgRef.current.src;
						imgRef.current.src = '';
						imgRef.current.src = currentSrc;
					}
				}, 100);
			}
		};
		
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [src]);

	useEffect(() => {
		// Reset states when src changes
		setIsLoaded(false);
		setError(false);

		if (!src) {
			setError(true);
			return;
		}

		// Use HTMLImageElement instead of Image constructor to avoid naming conflict
		const img = document.createElement('img');
		img.src = src;
		// Add crossOrigin to help with textures in Three.js
		img.crossOrigin = "anonymous";

		img.onload = () => {
			setIsLoaded(true);
			setError(false);
		};

		img.onerror = () => {
			setError(true);
			console.warn(`Failed to load image: ${src}`);
		};

		return () => {
			img.onload = null;
			img.onerror = null;
		};
	}, [src]);

	// Apply aspect ratio class if provided
	const containerClasses = `relative overflow-hidden ${
		aspectRatio ? aspectRatio : ""
	} ${className}`;

	// Add poster-style effects when applicable
	const posterEffectClass = className.includes('poster-style') ? 
		'shadow-lg saturate-125 contrast-105 poster-filter' : '';

	return (
		<div className={`${containerClasses} ${posterEffectClass}`} {...props}>
			<AnimatePresence mode="wait">
				{!isLoaded && !error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0"
						style={{
							background: generatePlaceholderGradient(index),
						}}
					/>
				)}
			</AnimatePresence>

			{error ? (
				fallback || (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-center p-4">
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 mx-auto mb-2 text-brand-pink"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h .01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<p className="text-sm">{alt || "Image not available"}</p>
						</div>
					</div>
				)
			) : (
				<motion.img
					ref={imgRef}
					src={src}
					alt={alt}
					initial={{ opacity: 0 }}
					animate={{ opacity: isLoaded ? 1 : 0 }}
					crossOrigin="anonymous"
					className={`w-full h-full object-cover ${className}`}
					onError={() => setError(true)}
				/>
			)}
		</div>
	);
};

export default Image;
