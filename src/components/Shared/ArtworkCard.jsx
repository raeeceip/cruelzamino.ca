import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ArtworkCard = ({ artwork }) => {
	return (
		<motion.div
			whileHover={{ y: -10 }}
			className="group relative overflow-hidden rounded-lg bg-base-black"
		>
			<Link to={`/works/${artwork.id}`}>
				<div className="aspect-[4/5] overflow-hidden">
					<img
						src={artwork.images[0]}
						alt={artwork.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
						<div className="absolute bottom-0 p-6">
							<h3 className="text-2xl font-heading text-white">
								{artwork.title}
							</h3>
							<p className="text-brand-yellow mt-2">{artwork.year}</p>
							<p className="text-white/70 mt-2 line-clamp-2">
								{artwork.description}
							</p>
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
};

export default ArtworkCard;
