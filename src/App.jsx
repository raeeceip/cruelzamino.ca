import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import MobileGallery from "./components/MobileGallery";
import { DesktopGallery } from "./components/DesktopGallery";
import { Details } from "./components/Details";
import { About } from "./components/About";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { Loader } from "./components/Loader";
import SampleArtwork from "./components/SampleArtwork";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

// Generate sample artworks with SVG images
const artworks = Array.from({ length: 6 }, (_, i) => ({
	id: i + 1,
	title: `Digital Dreamscape ${i + 1}`,
	artist: "Zam Onwa",
	year: 2024,
	description:
		"A mesmerizing exploration of digital and traditional art forms, creating a dreamlike landscape that bridges reality and imagination.",
	technique: "Digital Mixed Media",
	dimensions: { width: 2, height: 1.5 },
	medium: "Digital Canvas",
	price: `$${(5000 + i * 1000).toLocaleString()}`,
	image: `data:image/svg+xml,${encodeURIComponent(
		SampleArtwork({ index: i }).props.children
	)}`,
	position: [
		-6 + (i % 3) * 6, // Distribute horizontally
		1.5,
		-9.9 + Math.floor(i / 3) * 6, // Distribute in rows
	],
}));

const Sidebar = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 250px;
	background: rgba(0, 0, 0, 0.9);
	z-index: 1000;
	padding: 20px;
	display: flex;
	flex-direction: column;
`;

const SidebarButton = styled.button`
	background: none;
	border: none;
	color: white;
	font-size: 1.2rem;
	margin: 10px 0;
	cursor: pointer;
	text-align: left;
	padding: 10px;
	transition: background 0.3s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.1);
	}
`;

const MenuButton = styled.button`
	position: fixed;
	top: 20px;
	left: 20px;
	z-index: 1001;
	background: rgba(0, 0, 0, 0.5);
	color: white;
	border: none;
	padding: 10px;
	cursor: pointer;
	font-size: 1rem;
`;

export default function App() {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [selectedArtwork, setSelectedArtwork] = useState(null);
	const [isAboutOpen, setIsAboutOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const currentIndex = selectedArtwork
		? artworks.findIndex((art) => art.id === selectedArtwork.id)
		: -1;

	const handleNext = () => {
		if (currentIndex < artworks.length - 1) {
			setSelectedArtwork(artworks[currentIndex + 1]);
		}
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setSelectedArtwork(artworks[currentIndex - 1]);
		}
	};

	useEffect(() => {
		// Close sidebar when switching between mobile and desktop
		setIsSidebarOpen(false);
	}, [isMobile]);

	return (
		<div className="relative w-full h-screen">
			<AnimatePresence>
				{isSidebarOpen && (
					<Sidebar
						initial={{ x: -250 }}
						animate={{ x: 0 }}
						exit={{ x: -250 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
					>
						<SidebarButton
							onClick={() => {
								setIsAboutOpen(true);
								setIsSidebarOpen(false);
							}}
						>
							About
						</SidebarButton>
						<SidebarButton onClick={() => setIsSidebarOpen(false)}>
							Gallery
						</SidebarButton>
					</Sidebar>
				)}
			</AnimatePresence>

			<MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
				{isSidebarOpen ? "Close" : "Menu"}
			</MenuButton>

			{isMobile ? (
				<MobileGallery
					artworks={artworks}
					onArtworkSelect={setSelectedArtwork}
				/>
			) : (
				<Suspense fallback={<Loader />}>
					<Canvas
						camera={{ position: [0, 1.6, 5], fov: 75 }}
						style={{
							width: "100vw",
							height: "100vh",
							background: "#111",
						}}
						shadows
					>
						<DesktopGallery
							artworks={artworks}
							onArtworkSelect={setSelectedArtwork}
						/>
					</Canvas>
				</Suspense>
			)}

			<AnimatePresence>
				{(selectedArtwork || isAboutOpen) && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black bg-opacity-50"
					>
						{selectedArtwork && (
							<Details
								artwork={selectedArtwork}
								onClose={() => setSelectedArtwork(null)}
								onNext={handleNext}
								onPrevious={handlePrevious}
								hasNext={currentIndex < artworks.length - 1}
								hasPrevious={currentIndex > 0}
							/>
						)}

						{isAboutOpen && (
							<About
								isOpen={isAboutOpen}
								onClose={() => setIsAboutOpen(false)}
							/>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
