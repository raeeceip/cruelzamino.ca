import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const GalleryContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: #111;
	overflow: hidden;
`;

const ArtworkImage = styled(motion.img)`
	width: 100%;
	height: 100%;
	object-fit: contain;
`;

const ArtworkInfo = styled(motion.div)`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20px;
	background: linear-gradient(
		to top,
		rgba(0, 0, 0, 0.8) 0%,
		rgba(0, 0, 0, 0) 100%
	);
	color: white;
`;

const NavigationButton = styled.button`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: rgba(255, 255, 255, 0.2);
	color: white;
	border: none;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	cursor: pointer;
	transition: background 0.3s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

const PrevButton = styled(NavigationButton)`
	left: 10px;
`;

const NextButton = styled(NavigationButton)`
	right: 10px;
`;

export default function MobileGallery({ artworks, onArtworkSelect }) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const preloadImages = async () => {
			const imagePromises = artworks.map((artwork) => {
				return new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = resolve;
					img.onerror = reject;
					img.src = artwork.image;
				});
			});

			await Promise.all(imagePromises);
			setIsLoading(false);
		};

		preloadImages();
	}, [artworks]);

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % artworks.length);
	};

	const handlePrevious = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + artworks.length) % artworks.length
		);
	};

	if (isLoading) {
		return (
			<GalleryContainer>
				<div
					style={{ color: "white", textAlign: "center", paddingTop: "50vh" }}
				>
					Loading Gallery...
				</div>
			</GalleryContainer>
		);
	}

	const currentArtwork = artworks[currentIndex];

	return (
		<GalleryContainer>
			<AnimatePresence mode="wait">
				<motion.div
					key={currentArtwork.id}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
					style={{ width: "100%", height: "100%" }}
				>
					<ArtworkImage
						src={currentArtwork.image}
						alt={currentArtwork.title}
						onClick={() => onArtworkSelect(currentArtwork)}
					/>
					<ArtworkInfo
						initial={{ y: 100 }}
						animate={{ y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h2 style={{ margin: 0, fontSize: "1.5rem" }}>
							{currentArtwork.title}
						</h2>
						<p
							style={{ margin: "0.5rem 0 0 0", fontSize: "1rem", opacity: 0.8 }}
						>
							{currentArtwork.artist}, {currentArtwork.year}
						</p>
					</ArtworkInfo>
				</motion.div>
			</AnimatePresence>
			<PrevButton onClick={handlePrevious} disabled={artworks.length <= 1}>
				&#8249;
			</PrevButton>
			<NextButton onClick={handleNext} disabled={artworks.length <= 1}>
				&#8250;
			</NextButton>
		</GalleryContainer>
	);
}
