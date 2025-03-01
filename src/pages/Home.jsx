import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ARTWORKS, COLLECTIONS } from "../constants/data";
import Image from "../components/ui/Image";

const Home = () => {
	// Get one featured work from each collection
	const featuredWorks = COLLECTIONS.map((collection) => {
		return ARTWORKS.find((artwork) => artwork.collection === collection.title);
	}).filter(Boolean); // Remove any undefined values

	return (
		<div className="min-h-screen bg-black vintage-texture">
			{/* Hero Section - with poster-style design */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 opacity-50">
					<div className="absolute w-96 h-96 bg-[#FF1493] rounded-full blur-3xl -top-20 -left-20" />
					<div className="absolute w-96 h-96 bg-[#FDDA0D] rounded-full blur-3xl top-1/2 right-0" />
				</div>
				
				{/* Background noise texture */}
				<div className="absolute inset-0 bg-noise opacity-5 mix-blend-overlay"></div>

				<div className="container mx-auto px-6 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="max-w-4xl mx-auto text-center"
					>
						{/* Poster-style title */}
						<h1 className="font-poster text-poster font-bold mb-6 text-white text-shadow-poster uppercase tracking-wider">
							Zam
							<span className="block text-brand-yellow mt-2">Onwa</span>
						</h1>
						
						{/* Tagline with vintage flair */}
						<p className="text-xl text-gray-300 mb-8 font-serif italic">
							"Exploring identity, spirituality, and the Nigerian diaspora
							through visionary art"
						</p>
						
						{/* Button with poster-style design */}
						<Link
							to="/works"
							className="inline-block px-8 py-4 bg-brand-pink text-white border border-white/20 shadow-lg
							uppercase tracking-wider text-shadow-sm font-bold hover:bg-opacity-90 transition-colors rounded-none
							hover:shadow-xl transform hover:-translate-y-1 transition-all"
						>
							Enter Gallery
						</Link>
					</motion.div>
				</div>
				
				{/* Decorative elements for poster aesthetic */}
				<div className="absolute top-8 left-8 hidden md:block w-20 h-20 border border-brand-yellow/30 rounded-full"></div>
				<div className="absolute bottom-8 right-8 hidden md:block w-20 h-20 border border-brand-pink/30 rounded-full"></div>
			</section>

			{/* Collections Preview - with poster-style cards */}
			<section className="py-24 container mx-auto px-6">
				<h2 className="text-3xl font-poster uppercase text-white mb-12 text-shadow-sm tracking-wide border-b-2 border-brand-yellow/50 pb-4 inline-block">
					Featured Collections
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{COLLECTIONS.map((collection, index) => (
						<motion.div
							key={collection.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.2 }}
							className="bg-gray-900 overflow-hidden border border-gray-800 shadow-xl poster-filter"
						>
							<div className="aspect-[4/3] relative">
								{/* Poster frame effect */}
								<div className="absolute inset-0 border-4 border-gray-900 z-20 pointer-events-none"></div>
								<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70 z-10" />
								
								{/* Collection title with poster styling */}
								<h3 className="absolute bottom-4 left-4 text-xl font-poster uppercase text-white z-10 text-shadow-md">
									{collection.title}
								</h3>
							</div>
							<div className="p-6 bg-gradient-to-b from-gray-900 to-black">
								<p className="text-brand-yellow text-sm mb-4 font-serif">{collection.year}</p>
								<p className="text-white line-clamp-3">
									{collection.description}
								</p>
								<Link
									to={`/works#${collection.id}`}
									className="mt-4 inline-block text-brand-yellow hover:text-brand-pink transition-colors uppercase tracking-wide text-sm font-bold"
								>
									View Collection →
								</Link>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Recent Works - with art gallery poster style */}
			<section className="py-24 bg-gradient-to-b from-gray-900 to-black">
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-poster uppercase text-white mb-12 text-shadow-sm tracking-wide border-b-2 border-brand-pink/50 pb-4 inline-block">
						Recent Works
					</h2>
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
									<div className="aspect-[4/5] overflow-hidden relative shadow-xl border border-gray-800">
										{/* Artwork frame with poster styling */}
										<div className="absolute inset-0 border-[8px] border-gray-900 z-20 pointer-events-none group-hover:border-brand-pink/30 transition-colors"></div>
										
										{artwork.image && (
											<Image
												src={artwork.image}
												alt={artwork.title}
												className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 poster-style"
												index={index}
											/>
										)}
										
										{/* Enhanced hover effect with poster styling */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10">
											<div className="absolute bottom-6 left-6 right-6">
												<h3 className="text-xl font-poster uppercase text-white mb-2 text-shadow-sm">
													{artwork.title}
												</h3>
												<p className="text-brand-yellow font-serif">{artwork.year}</p>
												<div className="pt-4 mt-4 border-t border-white/20 hidden group-hover:block">
													<span className="text-sm text-white/80">Click to view details</span>
												</div>
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>
			
			{/* Artist Statement - new poster-style section */}
			<section className="py-24 bg-black">
				<div className="container mx-auto px-6">
					<div className="max-w-4xl mx-auto bg-gradient-to-b from-gray-900/50 to-black/70 p-8 md:p-12 border border-gray-800 poster-filter">
						<h2 className="font-poster uppercase text-2xl text-white mb-8 text-shadow-sm text-center">
							Artist Statement
						</h2>
						<p className="text-white/90 mb-6 font-serif leading-relaxed text-lg italic text-center">
							"My art explores the intersection of traditional Nigerian symbolism and contemporary diasporic experience, 
							creating a visual dialogue between ancestral wisdom and modern identity."
						</p>
						<div className="text-center mt-8">
							<Link to="/about" className="inline-block text-brand-yellow uppercase tracking-wide hover:text-brand-pink font-bold">
								Read More About the Artist →
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
