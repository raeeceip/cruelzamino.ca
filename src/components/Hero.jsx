import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
	return (
		<div className="min-h-screen bg-base-black text-base-white relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute w-96 h-96 bg-brand-pink rounded-full blur-3xl -top-20 -left-20" />
				<div className="absolute w-96 h-96 bg-brand-yellow rounded-full blur-3xl top-1/2 right-0" />
			</div>

			<div className="container mx-auto px-6 py-20 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="max-w-4xl"
				>
					<h1 className="text-display font-heading mb-6">
						SHINE SHINE
						<span className="block text-brand-yellow">BOBO</span>
					</h1>

					<div className="flex gap-8 mt-12">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-8 py-4 bg-brand-pink text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors"
						>
							View Gallery
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-8 py-4 border-2 border-brand-yellow text-brand-yellow rounded-lg font-bold hover:bg-brand-yellow hover:text-black transition-colors"
						>
							About Me
						</motion.button>
					</div>
				</motion.div>

				<div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
					{[
						"The Creed of a True Fraud",
						"The Pilgrimage of the Self",
						"Wahala Dey",
					].map((collection, index) => (
						<motion.div
							key={collection}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.2 }}
							className="bg-white bg-opacity-5 p-6 rounded-lg backdrop-blur-sm"
						>
							<span className="text-brand-yellow font-mono">
								{String(index + 1).padStart(2, "0")}
							</span>
							<h3 className="text-xl font-heading mt-2">{collection}</h3>
							<div className="h-1 w-12 bg-brand-pink mt-4" />
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Hero;
