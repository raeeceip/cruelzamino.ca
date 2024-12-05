import React from "react";
import { motion } from "framer-motion";

const Preloader = ({ isLoading }) => {
	if (!isLoading) return null;

	const circleVariants = {
		hidden: {
			pathLength: 0,
			opacity: 0,
		},
		visible: {
			pathLength: 1,
			opacity: 1,
			transition: {
				pathLength: { duration: 2, ease: "easeInOut" },
				opacity: { duration: 0.2 },
			},
		},
	};

	return (
		<motion.div
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black"
		>
			<div className="relative w-32 h-32">
				<svg
					className="w-full h-full absolute top-0 left-0"
					viewBox="0 0 100 100"
				>
					<motion.circle
						cx="50"
						cy="50"
						r="45"
						stroke="#FF1493"
						strokeWidth="2"
						fill="none"
						variants={circleVariants}
						initial="hidden"
						animate="visible"
					/>
				</svg>

				<div className="absolute inset-0 flex items-center justify-center">
					<h1 className="text-2xl font-bold text-white">
						ZAM<span className="text-brand-yellow">.</span>
					</h1>
				</div>
			</div>
		</motion.div>
	);
};

export default Preloader;
