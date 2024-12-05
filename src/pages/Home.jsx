import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ARTWORKS, COLLECTIONS } from "../constants/data";

const Home = () => {
	// Get one featured work from each collection
	const featuredWorks = COLLECTIONS.map((collection) => {
		return ARTWORKS.find((artwork) => artwork.collection === collection.title);
	}).filter(Boolean); // Remove any undefined values

	return (
		<div className="min-h-screen bg-black">
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 opacity-50">
					<div className="absolute w-96 h-96 bg-[#FF1493] rounded-full blur-3xl -top-20 -left-20" />
					<div className="absolute w-96 h-96 bg-[#FDDA0D] rounded-full blur-3xl top-1/2 right-0" />
				</div>

				<div className="container mx-auto px-6 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="max-w-4xl mx-auto text-center"
					>
						<h1 className="text-7xl font-bold mb-6 text-white">
							Zam
							<span className="block text-[#FDDA0D]">Onwa</span>
						</h1>
						<p className="text-xl text-gray-300 mb-8">
							Exploring identity, spirituality, and the Nigerian diaspora
							through art
						</p>
						<Link
							to="/works"
							className="inline-block px-8 py-4 bg-[#FF1493] text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors"
						>
							View Gallery
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Collections Preview */}
			<section className="py-24 container mx-auto px-6">
				<h2 className="text-3xl font-bold text-white mb-12">
					Featured Collections
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{COLLECTIONS.map((collection, index) => (
						<motion.div
							key={collection.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.2 }}
							className="bg-gray-900 rounded-lg overflow-hidden"
						>
							<div className="aspect-[4/3] relative">
								<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
								<h3 className="absolute bottom-4 left-4 text-xl font-bold text-white z-10">
									{collection.title}
								</h3>
							</div>
							<div className="p-6">
								<p className="text-gray-400 text-sm mb-4">{collection.year}</p>
								<p className="text-white line-clamp-3">
									{collection.description}
								</p>
								<Link
									to={`/works#${collection.id}`}
									className="mt-4 inline-block text-[#FDDA0D] hover:text-[#FF1493] transition-colors"
								>
									View Collection →
								</Link>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Recent Works */}
			<section className="py-24 bg-gray-900">
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-bold text-white mb-12">Recent Works</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{ARTWORKS.slice(0, 3).map((artwork, index) => (
							<motion.div
								key={artwork.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.2 }}
								className="group relative"
							>
								<Link to={`/works/${artwork.id}`}>
									<div className="aspect-[4/5] rounded-lg overflow-hidden relative">
										{artwork.image && (
											<img
												src={artwork.image}
												alt={artwork.title}
												className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
											/>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
											<div className="absolute bottom-6 left-6">
												<h3 className="text-xl font-bold text-white mb-2">
													{artwork.title}
												</h3>
												<p className="text-[#FDDA0D]">{artwork.year}</p>
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
