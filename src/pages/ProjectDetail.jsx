import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, ExternalLink } from "lucide-react";
import { ARTWORKS } from "../constants/data";
import ImageComponent from "../components/ui/Image";

const ArtworkDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [artwork, setArtwork] = useState(null);

	useEffect(() => {
		const found = ARTWORKS.find((art) => art.id === id);
		if (!found) {
			navigate("/works");
			return;
		}
		setArtwork(found);
	}, [id, navigate]);

	if (!artwork) return null;

	const handleShare = async () => {
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
		<div className="min-h-screen pt-20">
			<div className="container mx-auto px-4 md:px-6 py-8">
				{/* Back Button */}
				<motion.button
					onClick={() => navigate("/works")}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex items-center text-brand-yellow mb-8 hover:text-brand-pink transition-colors"
				>
					<ChevronLeft size={20} className="mr-2" />
					<span>Back to Gallery</span>
				</motion.button>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Image Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="relative"
					>
						<ImageComponent
							src={artwork.image}
							alt={artwork.title}
							className="rounded-lg shadow-2xl"
							aspectRatio="aspect-[4/5]"
						/>
					</motion.div>

					{/* Info Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="space-y-8"
					>
						<div>
							<h1 className="text-4xl md:text-5xl font-heading mb-4">
								{artwork.title}
							</h1>
							<p className="text-brand-yellow text-xl mb-6">{artwork.year}</p>
							<p className="text-gray-300 text-lg leading-relaxed">
								{artwork.description}
							</p>
						</div>

						{/* Details */}
						<div className="grid grid-cols-2 gap-6">
							<div>
								<h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
									Technique
								</h3>
								<p className="text-white">{artwork.technique}</p>
							</div>
							<div>
								<h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
									Medium
								</h3>
								<p className="text-white">{artwork.medium}</p>
							</div>
							<div>
								<h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
									Dimensions
								</h3>
								<p className="text-white">
									{artwork.dimensions.width}m × {artwork.dimensions.height}m
								</p>
							</div>
							<div>
								<h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
									Collection
								</h3>
								<p className="text-white">{artwork.collection}</p>
							</div>
						</div>

						{/* Purchase/Contact Section */}
						<div className="bg-black/30 rounded-lg p-6 border border-brand-pink/20">
							<h3 className="text-xl font-heading mb-4">
								Interested in this piece?
							</h3>
							<p className="text-gray-300 mb-6">
								This artwork is available for purchase. Contact us for pricing
								and availability.
							</p>
							<div className="flex flex-wrap gap-4">
								<a
									href="/contact"
									className="inline-flex items-center px-6 py-3 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors"
								>
									<ExternalLink size={18} className="mr-2" />
									Inquire Now
								</a>
								<button
									onClick={handleShare}
									className="inline-flex items-center px-6 py-3 bg-transparent border border-brand-pink text-white rounded-lg hover:bg-brand-pink/10 transition-colors"
								>
									<Share2 size={18} className="mr-2" />
									Share Artwork
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default ArtworkDetail;
