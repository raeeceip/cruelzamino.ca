import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import Gallery3D from "../components/Shared/Gallery3D";
import MobileGallery from "../components/Shared/MobileGallery";

const Works = () => {
	const navigate = useNavigate();
	const isMobile = useMediaQuery("(max-width: 768px)");

	const handleArtworkSelect = (artwork) => {
		navigate(`/works/${artwork.id}`);
	};

	if (isMobile) {
		return <MobileGallery />;
	}

	return (
		<div className="w-full h-screen relative bg-black">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 px-6 py-3 rounded-full text-white text-center"
			>
				Click to start | WASD to move | Mouse to look
			</motion.div>

			<Gallery3D onArtworkSelect={handleArtworkSelect} />
		</div>
	);
};

export default Works;
