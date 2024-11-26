// src/components/Details.jsx
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { X, Share, ArrowLeft, ArrowRight } from "lucide-react";
import { useKeyPress } from "../hooks/useKeyPress";

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.95);
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20px;
`;

const Container = styled(motion.div)`
	width: 100%;
	max-width: 1200px;
	height: 90vh;
	background: #1a1a1a;
	border-radius: 20px;
	overflow: hidden;
	position: relative;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr;

	@media (min-width: 768px) {
		grid-template-columns: 1.2fr 1fr;
		grid-template-rows: 1fr;
	}
`;

const ImageSection = styled.div`
	position: relative;
	background: #111;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;

	img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
`;

const InfoSection = styled.div`
	padding: 2rem;
	overflow-y: auto;
	color: white;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background: #111;
	}

	&::-webkit-scrollbar-thumb {
		background: #333;
		border-radius: 4px;
	}
`;

const Title = styled.h1`
	font-size: 2.5rem;
	font-weight: 600;
	margin: 0;
	line-height: 1.2;
`;

const Artist = styled.h2`
	font-size: 1.25rem;
	color: #888;
	margin: 0.5rem 0 0 0;
`;

const Description = styled.p`
	font-size: 1.1rem;
	line-height: 1.8;
	color: #ddd;
`;

const MetaGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 1.5rem;
	background: rgba(0, 0, 0, 0.2);
	padding: 1.5rem;
	border-radius: 12px;
`;

const MetaItem = styled.div`
	h3 {
		font-size: 0.875rem;
		color: #888;
		margin: 0 0 0.5rem 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	p {
		font-size: 1rem;
		color: white;
		margin: 0;
	}
`;

const ButtonGroup = styled.div`
	display: flex;
	gap: 1rem;
	margin-top: auto;
	flex-wrap: wrap;
`;

const Button = styled(motion.button)`
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: white;
	padding: 0.75rem 1.5rem;
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	transition: all 0.2s;
	font-size: 1rem;

	&:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	svg {
		width: 18px;
		height: 18px;
	}
`;

const CloseButton = styled(motion.button)`
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: rgba(0, 0, 0, 0.5);
	border: none;
	color: white;
	width: 40px;
	height: 40px;
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 10;

	&:hover {
		background: rgba(0, 0, 0, 0.8);
	}
`;

export function Details({
	artwork,
	onClose,
	onNext,
	onPrevious,
	hasNext = true,
	hasPrevious = true,
}) {
	useKeyPress("Escape", onClose);
	useKeyPress("ArrowRight", () => hasNext && onNext?.());
	useKeyPress("ArrowLeft", () => hasPrevious && onPrevious?.());

	const shareArtwork = async () => {
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
		<AnimatePresence>
			<Overlay
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			>
				<Container
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{ type: "spring", duration: 0.5 }}
					onClick={(e) => e.stopPropagation()}
				>
					<CloseButton
						onClick={onClose}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						<X size={24} />
					</CloseButton>

					<ImageSection>
						<motion.img
							src={artwork.image}
							alt={artwork.title}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
						/>
					</ImageSection>

					<InfoSection>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<Title>{artwork.title}</Title>
							<Artist>
								{artwork.artist}, {artwork.year}
							</Artist>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
						>
							<Description>{artwork.description}</Description>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
						>
							<MetaGrid>
								<MetaItem>
									<h3>Technique</h3>
									<p>{artwork.technique || "Mixed Media"}</p>
								</MetaItem>
								<MetaItem>
									<h3>Dimensions</h3>
									<p>{artwork.dimensions || "100 x 100 cm"}</p>
								</MetaItem>
								<MetaItem>
									<h3>Medium</h3>
									<p>{artwork.medium || "Digital"}</p>
								</MetaItem>
								{artwork.price && (
									<MetaItem>
										<h3>Price</h3>
										<p>{artwork.price}</p>
									</MetaItem>
								)}
							</MetaGrid>
						</motion.div>

						<ButtonGroup>
							<Button
								onClick={shareArtwork}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Share size={18} />
								Share Artwork
							</Button>
							{hasPrevious && (
								<Button
									onClick={onPrevious}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<ArrowLeft size={18} />
									Previous
								</Button>
							)}
							{hasNext && (
								<Button
									onClick={onNext}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									Next
									<ArrowRight size={18} />
								</Button>
							)}
						</ButtonGroup>
					</InfoSection>
				</Container>
			</Overlay>
		</AnimatePresence>
	);
}
