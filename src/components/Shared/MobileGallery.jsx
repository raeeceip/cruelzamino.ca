import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, Map, Volume2, Volume1 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ARTWORKS } from "../../constants/data";
import Image from "../ui/Image";
import { useKeyPress } from "../../hooks/useKeyPress";

const MobileGallery = ({ onArtworkSelect }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showInfo, setShowInfo] = useState(true);
	const [touchStart, setTouchStart] = useState(null);
	const [touchMoveY, setTouchMoveY] = useState(null);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [viewMode, setViewMode] = useState("wall"); // wall, walkthrough
	const [showMap, setShowMap] = useState(false);
	const [soundEnabled, setSoundEnabled] = useState(false);
	const [deviceOrientation, setDeviceOrientation] = useState({ beta: 0, gamma: 0 });
	const galleryRef = useRef(null);
	const audioRef = useRef(null);
	const navigate = useNavigate();

	const currentArtwork = ARTWORKS[currentIndex];
	const hasGyroscope = window.DeviceOrientationEvent !== undefined;

	useEffect(() => {
		// Safely create audio with error handling
		const createAudio = (path) => {
			try {
				const audio = new Audio(path);
				// Check if audio can be played
				const canPlay = audio.canPlayType('audio/mpeg');
				return canPlay ? audio : null;
			} catch (e) {
				console.log(`Audio error for ${path}:`, e);
				return null;
			}
		};
		
		// Create audio elements for gallery sounds
		audioRef.current = {
			// Missing audio files - handle gracefully until they're available
			footsteps: null, // createAudio("/assets/sounds/footsteps.mp3"),
			ambience: null // createAudio("/assets/sounds/gallery-ambience.mp3")
		};
		
		// Set audio properties
		if (audioRef.current.ambience) {
			audioRef.current.ambience.loop = true;
			audioRef.current.ambience.volume = 0.2;
			
			// Add error handler
			audioRef.current.ambience.addEventListener('error', (e) => {
				console.log('Audio error:', e);
				// Disable audio if there's an error
				setSoundEnabled(false);
			});
		}
		
		if (audioRef.current.footsteps) {
			audioRef.current.footsteps.volume = 0.3;
		}
		
		// Handle visibility change to restore context when switching tabs
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				// Force a re-render after a short delay
				setTimeout(() => {
					// Trigger state update to refresh component
					setCurrentIndex(prev => prev);
				}, 300);
			}
		};
		
		document.addEventListener('visibilitychange', handleVisibilityChange);
		
		// Handle orientation changes
		const handleOrientationChange = () => {
			setTimeout(() => {
				// Force a re-render to avoid losing context
				setCurrentIndex(prev => prev);
			}, 300);
		};
		
		window.addEventListener('orientationchange', handleOrientationChange);
		
		return () => {
			// Cleanup audio when component unmounts
			if (audioRef.current.ambience) {
				audioRef.current.ambience.pause();
				audioRef.current.ambience.removeEventListener('error', () => {});
			}
			if (audioRef.current.footsteps) {
				audioRef.current.footsteps.pause();
			}
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('orientationchange', handleOrientationChange);
		};
	}, []);

	// Toggle sound effects
	useEffect(() => {
		if (soundEnabled) {
			if (audioRef.current.ambience) {
				audioRef.current.ambience.play().catch(e => console.log("Audio play prevented:", e));
			}
		} else {
			if (audioRef.current.ambience) {
				audioRef.current.ambience.pause();
			}
		}
	}, [soundEnabled]);

	// Handle gyroscope data for 3D perspective effect
	useEffect(() => {
		const handleDeviceOrientation = (event) => {
			if (event.beta !== null && event.gamma !== null) {
				setDeviceOrientation({
					beta: Math.min(Math.max(event.beta, -20), 20),
					gamma: Math.min(Math.max(event.gamma, -20), 20)
				});
			}
		};

		if (hasGyroscope) {
			window.addEventListener("deviceorientation", handleDeviceOrientation);
		}

		return () => {
			if (hasGyroscope) {
				window.removeEventListener("deviceorientation", handleDeviceOrientation);
			}
		};
	}, [hasGyroscope]);

	// Play haptic feedback (vibration) if available
	const triggerHapticFeedback = () => {
		if ("vibrate" in navigator) {
			navigator.vibrate(30);
		}
	};

	// Handle swipe navigation
	useEffect(() => {
		const handleTouchStart = (e) => {
			setTouchStart(e.touches[0].clientX);
			setTouchMoveY(e.touches[0].clientY);
		};

		const handleTouchMove = (e) => {
			if (!touchStart) return;
			const touchY = e.touches[0].clientY;
			const diffY = touchMoveY - touchY;
			
			// If user is swiping vertically (up/down) by a significant amount
			if (Math.abs(diffY) > 50) {
				setTouchMoveY(null);
				setTouchStart(null);
			}
		};

		const handleTouchEnd = (e) => {
			if (!touchStart) return;

			const touchEnd = e.changedTouches[0].clientX;
			const diff = touchStart - touchEnd;

			// If swipe distance is significant and not canceled by vertical movement
			if (Math.abs(diff) > 50 && touchMoveY !== null) {
				if (diff > 0) {
					// Swipe left, go to next
					handleNext();
				} else {
					// Swipe right, go to prev
					handlePrev();
				}
			}

			setTouchStart(null);
			setTouchMoveY(null);
		};

		document.addEventListener("touchstart", handleTouchStart);
		document.addEventListener("touchmove", handleTouchMove);
		document.addEventListener("touchend", handleTouchEnd);

		return () => {
			document.removeEventListener("touchstart", handleTouchStart);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [touchStart, touchMoveY, currentIndex]);

	// Handle keyboard navigation
	useKeyPress("ArrowLeft", handlePrev);
	useKeyPress("ArrowRight", handleNext);
	
	function handleNext() {
		if (isTransitioning) return;
		
		setIsTransitioning(true);
		triggerHapticFeedback();
		
		// Play footstep sound if enabled
		if (soundEnabled && audioRef.current.footsteps) {
			audioRef.current.footsteps.currentTime = 0;
			audioRef.current.footsteps.play().catch(e => console.log("Audio play prevented:", e));
		}
		
		setCurrentIndex((prev) => (prev + 1) % ARTWORKS.length);
		
		// Reset transition flag after animation completes
		setTimeout(() => setIsTransitioning(false), 500);
	}

	function handlePrev() {
		if (isTransitioning) return;
		
		setIsTransitioning(true);
		triggerHapticFeedback();
		
		// Play footstep sound if enabled
		if (soundEnabled && audioRef.current.footsteps) {
			audioRef.current.footsteps.currentTime = 0;
			audioRef.current.footsteps.play().catch(e => console.log("Audio play prevented:", e));
		}
		
		setCurrentIndex((prev) => (prev - 1 + ARTWORKS.length) % ARTWORKS.length);
		
		// Reset transition flag after animation completes
		setTimeout(() => setIsTransitioning(false), 500);
	}

	const handleArtworkClick = () => {
		if (onArtworkSelect) {
			onArtworkSelect(currentArtwork);
		} else {
			navigate(`/works/${currentArtwork.id}`);
		}
	};

	// Generate dynamic perspective styles based on device orientation
	const getDynamicStyles = () => {
		if (!hasGyroscope || viewMode !== 'wall') return {};
		
		const { beta, gamma } = deviceOrientation;
		return {
			transform: `perspective(1000px) rotateX(${beta * 0.5}deg) rotateY(${gamma * 0.5}deg)`
		};
	};

	return (
		<div className="fixed inset-0 overflow-hidden bg-black">
			{/* Stars background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIiBmcj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iLjQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41Ij48cGF0aCBkPSJNMCAwaDEwMHYxMDBIMHoiLz48L2c+PC9zdmc+')]"></div>
				<div className="stars absolute inset-0">
					{[...Array(100)].map((_, i) => (
						<div 
							key={i}
							className="star absolute rounded-full bg-white"
							style={{
								width: `${Math.random() * 2 + 1}px`,
								height: `${Math.random() * 2 + 1}px`,
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
								opacity: Math.random() * 0.8 + 0.2,
								animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
							}}
						></div>
					))}
				</div>
			</div>
			
			{/* Colored lighting effects */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-pink-500/20 via-transparent to-transparent"></div>
				<div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-500/20 via-transparent to-transparent"></div>
				<div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-purple-500/20 via-transparent to-transparent"></div>
			</div>

			<div className="w-full h-full relative flex flex-col"
				ref={galleryRef}
				style={{
					...getDynamicStyles()
				}}
			>
				{/* Gallery Content */}
				<div className="flex-1 relative">
					<AnimatePresence mode="wait">
						{viewMode === 'wall' ? (
							<motion.div
								key={`wall-${currentIndex}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className="absolute inset-0 p-4 md:p-6 flex items-center justify-center"
								onClick={handleArtworkClick}
							>
								{/* Museum Wall Display */}
								<div className="relative w-full h-full flex items-center justify-center">
									<div 
										className="relative perspective-frame w-full h-full max-w-md max-h-[70vh] mx-auto"
										style={{
											perspective: '1000px',
											transformStyle: 'preserve-3d'
										}}
									>
										{/* Museum frame effect */}
										<motion.div
											className="frame-wrapper relative w-full h-full" 
											style={{
												transformStyle: 'preserve-3d',
											}}
											animate={{
												rotateY: [0, 0.5, 0, -0.5, 0],
											}}
											transition={{
												duration: 10,
												repeat: Infinity,
												repeatType: 'loop',
											}}
										>
											{/* Wall base */}
											<motion.div className="absolute inset-0 -z-10 bg-gray-900" 
												style={{ 
													transform: 'translateZ(-10px)', 
													width: 'calc(100% + 40px)', 
													height: 'calc(100% + 40px)', 
													left: '-20px', 
													top: '-20px' 
												}}
											></motion.div>
											
											{/* Art pedestal */}
											<motion.div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[120%] h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-sm"
												style={{ transform: 'translateZ(-5px)' }}
											></motion.div>
											
											{/* Frame */}
											<motion.div 
												className="absolute -inset-3 border-8 border-[#333333] shadow-xl rounded-sm"
												style={{ transform: 'translateZ(-2px)' }}
												animate={{ 
													borderColor: isTransitioning ? '#FF1493' : '#333333',
													boxShadow: isTransitioning ? '0 0 20px 5px rgba(255, 20, 147, 0.3)' : 'none'
												}}
												transition={{ duration: 0.3 }}
											></motion.div>
											
											{/* Artwork */}
											<Image
												src={currentArtwork.image}
												alt={currentArtwork.title}
												className="w-full h-full object-contain relative z-0"
												fallback={
													<div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
														<div className="text-center p-6">
															<h3 className="text-xl font-bold text-brand-pink mb-2">
																{currentArtwork.title}
															</h3>
															<p className="text-brand-yellow mb-4">
																{currentArtwork.year}
															</p>
															<p className="text-gray-300 text-sm">
																{currentArtwork.description}
															</p>
														</div>
													</div>
												}
											/>
											
											{/* Museum label */}
											<motion.div 
												className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/80 border border-gray-700 rounded-sm flex items-center justify-center text-xs text-white"
												style={{ transform: 'translateZ(0px)' }}
											>
												{currentArtwork.title}
											</motion.div>
										</motion.div>
									</div>
								</div>
							</motion.div>
						) : (
							<motion.div
								key={`walkthrough-${currentIndex}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="absolute inset-0 perspective-container"
								style={{ 
									perspective: '1000px',
									transformStyle: 'preserve-3d',
								}}
								onClick={handleArtworkClick}
							>
								{/* 3D Walkthrough Mode */}
								<div className="absolute inset-0 hallway-container" 
									style={{ 
										transformStyle: 'preserve-3d',
										transform: 'translateZ(0px)'
									}}
								>
									{/* Left Wall */}
									<div className="absolute top-0 bottom-0 left-0 w-[20vw] bg-gray-900" 
										style={{ transform: 'translateZ(-50px) rotateY(90deg) translateX(-50px)' }}
									></div>
									
									{/* Right Wall */}
									<div className="absolute top-0 bottom-0 right-0 w-[20vw] bg-gray-900" 
										style={{ transform: 'translateZ(-50px) rotateY(-90deg) translateX(50px)' }}
									></div>
									
									{/* Floor */}
									<div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gray-800" 
										style={{ transform: 'rotateX(90deg) translateY(50px)' }}
									>
										<div className="w-full h-full grid grid-cols-10 grid-rows-10">
											{[...Array(100)].map((_, i) => (
												<div key={i} className="border border-gray-700/30"></div>
											))}
										</div>
									</div>
									
									{/* Ceiling */}
									<div className="absolute top-0 left-0 right-0 h-[20vh] bg-gray-900" 
										style={{ transform: 'rotateX(-90deg) translateY(-50px)' }}
									></div>
									
									{/* Back Wall */}
									<div className="absolute inset-0 bg-gray-900" 
										style={{ transform: 'translateZ(-200px)' }}
									></div>
									
									{/* Artwork Wall */}
									<div className="absolute inset-0 flex items-center justify-center bg-gray-900" 
										style={{ transform: 'translateZ(-100px)' }}
									>
										{/* Artwork Frame */}
										<div className="relative" style={{ 
											width: `${currentArtwork.dimensions?.width * 100 || 200}px`, 
											height: `${currentArtwork.dimensions?.height * 100 || 150}px` 
										}}>
											{/* Frame */}
											<div className="absolute -inset-4 bg-[#333] rounded-sm"
												style={{ 
													boxShadow: '0 0 20px 5px rgba(255, 211, 105, 0.1)'
												}}
											></div>
											
											{/* Artwork */}
											<Image
												src={currentArtwork.image}
												alt={currentArtwork.title}
												className="w-full h-full object-contain relative z-10"
											/>
										</div>
									</div>
									
									{/* Museum Lights */}
									<div className="absolute top-[10vh] left-1/2 -translate-x-1/2 w-1/2 h-[5vh]">
										{[...Array(3)].map((_, i) => (
											<div key={i} className="absolute top-0 rounded-full w-4 h-4" 
												style={{ 
													left: `${i * 50}%`,
													background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
													boxShadow: '0 0 10px 5px rgba(255,255,255,0.2)',
												}}
											></div>
										))}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Navigation Buttons */}
					<motion.button
						onClick={(e) => {
							e.stopPropagation();
							handlePrev();
						}}
						whileTap={{ scale: 0.9 }}
						className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
						aria-label="Previous artwork"
					>
						<ChevronLeft size={24} />
					</motion.button>
					<motion.button
						onClick={(e) => {
							e.stopPropagation();
							handleNext();
						}}
						whileTap={{ scale: 0.9 }}
						className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
						aria-label="Next artwork"
					>
						<ChevronRight size={24} />
					</motion.button>

					{/* Controls Toolbar */}
					<div className="absolute top-4 right-4 flex gap-2 z-10">
						{/* Sound Toggle */}
						<motion.button
							onClick={(e) => {
								e.stopPropagation();
								setSoundEnabled(prev => !prev);
							}}
							whileTap={{ scale: 0.9 }}
							className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
								soundEnabled ? 'bg-brand-pink/70' : 'bg-black/50 hover:bg-black/70'
							}`}
							aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
						>
							{soundEnabled ? <Volume2 size={18} /> : <Volume1 size={18} />}
						</motion.button>
						
						{/* View Mode Toggle */}
						<motion.button
							onClick={(e) => {
								e.stopPropagation();
								setViewMode(prev => prev === 'wall' ? 'walkthrough' : 'wall');
							}}
							whileTap={{ scale: 0.9 }}
							className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
								viewMode === 'walkthrough' ? 'bg-brand-pink/70' : 'bg-black/50 hover:bg-black/70'
							}`}
							aria-label={viewMode === 'wall' ? "Switch to walkthrough view" : "Switch to wall view"}
						>
							{viewMode === 'wall' ? '3D' : '2D'}
						</motion.button>
						
						{/* Map Toggle */}
						<motion.button
							onClick={(e) => {
								e.stopPropagation();
								setShowMap(prev => !prev);
							}}
							whileTap={{ scale: 0.9 }}
							className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
								showMap ? 'bg-brand-pink/70' : 'bg-black/50 hover:bg-black/70'
							}`}
							aria-label={showMap ? "Hide map" : "Show map"}
						>
							<Map size={18} />
						</motion.button>
						
						{/* Info toggle button */}
						<motion.button
							onClick={(e) => {
								e.stopPropagation();
								setShowInfo((prev) => !prev);
							}}
							whileTap={{ scale: 0.9 }}
							className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
								showInfo ? 'bg-brand-pink/70' : 'bg-black/50 hover:bg-black/70'
							}`}
							aria-label={showInfo ? "Hide info" : "Show info"}
						>
							<Info size={18} />
						</motion.button>
					</div>
				</div>

				{/* Mini Map Overlay */}
				<AnimatePresence>
					{showMap && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="absolute top-20 right-4 w-1/3 max-w-[150px] aspect-square bg-black/70 rounded-lg border border-gray-700 p-2 z-20"
						>
							<div className="relative w-full h-full">
								{/* Map grid */}
								<div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
									{ARTWORKS.map((_, index) => {
										const row = Math.floor(index / 4);
										const col = index % 4;
										
										return (
											<div key={index} className="relative border border-gray-700/50 flex items-center justify-center">
												{index === currentIndex && (
													<div className="absolute inset-0 bg-brand-pink/30 animate-pulse"></div>
												)}
												<div className={`w-2 h-2 rounded-full ${
													index === currentIndex ? 'bg-brand-pink' : 'bg-gray-500'
												}`}></div>
											</div>
										);
									})}
								</div>
								
								{/* You are here indicator */}
								<div className="absolute" style={{
									left: `${(currentIndex % 4) * 25 + 12.5}%`,
									top: `${Math.floor(currentIndex / 4) * 25 + 12.5}%`,
									transform: 'translate(-50%, -50%)',
								}}>
									<div className="w-3 h-3 rounded-full bg-brand-pink animate-ping"></div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Info Panel with animation */}
				<AnimatePresence>
					{showInfo && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent px-6 pt-24 pb-8 z-10"
						>
							<h2 className="text-2xl font-bold text-white mb-2">
								{currentArtwork.title}
							</h2>
							<p className="text-brand-yellow mb-2">{currentArtwork.year}</p>
							<p className="text-gray-300 md:line-clamp-3">
								{currentArtwork.description}
							</p>

							{/* Progress Dots */}
							<div className="flex justify-center gap-2 mt-6">
								{ARTWORKS.map((_, index) => (
									<button
										key={index}
										onClick={(e) => {
											e.stopPropagation();
											setCurrentIndex(index);
										}}
										className={`w-2 h-2 rounded-full transition-colors ${
											index === currentIndex
												? "bg-brand-pink"
												: "bg-white/50 hover:bg-white/70"
										}`}
										aria-label={`Artwork ${index + 1}`}
									/>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Instructions */}
				<AnimatePresence>
					{currentIndex === 0 && (
						<motion.div
							initial={{ opacity: 1 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3, delay: 1.5 }}
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center font-medium bg-black/70 backdrop-blur-sm px-6 py-4 rounded-lg border border-gray-700/50 z-20"
						>
							<p className="mb-2">Welcome to the Gallery</p>
							<p className="text-sm text-gray-300">Swipe or tap arrows to navigate</p>
							{hasGyroscope && (
								<p className="text-sm text-gray-300 mt-1">Tilt device for perspective</p>
							)}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Floating particles for ambient effect */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					{[...Array(15)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full bg-white/20"
							initial={{
								width: `${Math.random() * 4 + 2}px`,
								height: `${Math.random() * 4 + 2}px`,
								x: `${Math.random() * 100}%`,
								y: `${Math.random() * 100}%`,
								opacity: 0
							}}
							animate={{
								y: ['0%', `${Math.random() * 100}%`],
								opacity: [0, 0.3, 0]
							}}
							transition={{
								duration: Math.random() * 10 + 10,
								repeat: Infinity,
								repeatType: 'loop',
								ease: 'easeInOut'
							}}
						/>
					))}
				</div>
			</div>
			
			{/* Add custom CSS rules */}
			<style>{`
				@keyframes twinkle {
					0% { opacity: 0.2; }
					100% { opacity: 0.8; }
				}
				
				.perspective-container {
					transform-style: preserve-3d;
					transition: transform 0.5s ease;
				}
				
				.perspective-frame {
					transition: transform 0.3s ease;
				}
			`}</style>
		</div>
	);
};

export default MobileGallery;