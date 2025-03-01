import {
	Html,
	PointerLockControls,
	Stars,
	useProgress,
	useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Map, Volume1, Volume2 } from "lucide-react";
import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { ARTWORKS } from "../../constants/data";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import Image from "../ui/Image";

// LoadingScreen component for 3D Gallery
const LoadingScreen = () => {
	const { progress } = useProgress();
	return (
		<Html center>
			<div className="text-white text-xl font-bold bg-black/50 px-6 py-3 rounded-lg">
				Loading... {progress.toFixed(0)}%
			</div>
		</Html>
	);
};

// ArtworkFrame component for 3D Gallery
const ArtworkFrame = ({ artwork, position, onClick }) => {
	const frameRef = useRef();
	const [hovered, setHovered] = useState(false);
	const [textureLoaded, setTextureLoaded] = useState(false);
	const { camera } = useThree();
	const [glowIntensity, setGlowIntensity] = useState(0.1);
	const [floatOffset] = useState(Math.random() * Math.PI);

	// Use a try-catch to handle missing textures
	let texture;
	try {
		// Create a placeholder if image fails to load
		texture = useTexture(
			artwork.image,
			() => setTextureLoaded(true),
			() => setTextureLoaded(false)
		);
	} catch (error) {
		console.log(`Texture loading error for ${artwork.title}:`, error);
		// We'll handle this with a fallback below
	}

	const frameWidth = artwork.dimensions?.width || 2;
	const frameHeight = artwork.dimensions?.height || 1.5;
	const frameDepth = 0.1;

	// Set isArtworkFrame flag for animation in Scene component
	useEffect(() => {
		if (frameRef.current) {
			frameRef.current.userData.isArtworkFrame = true;
		}
	}, []);

	useFrame(({ clock }) => {
		if (frameRef.current) {
			const t = clock.getElapsedTime();
			const distance = camera.position.distanceTo(frameRef.current.position);
			frameRef.current.userData.isClose = distance < 6;

			// Dynamic glow based on distance and hover
			const targetGlow = hovered ? 0.5 : (1.5 / Math.max(distance, 2)) * 0.2;
			setGlowIntensity(THREE.MathUtils.lerp(glowIntensity, targetGlow, 0.05));

			// Add subtle animation when hovered
			if (hovered) {
				frameRef.current.rotation.y = Math.sin(t * 2) * 0.05;
				frameRef.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
			} else {
				frameRef.current.rotation.y = THREE.MathUtils.lerp(
					frameRef.current.rotation.y,
					0,
					0.05
				);
				
				// Gentle floating animation when not hovered
				frameRef.current.position.y = position[1] + Math.sin(t + floatOffset) * 0.02;
			}
		}
	});

	const handleClick = (e) => {
		if (frameRef.current?.userData.isClose) {
			e.stopPropagation();
			
			// Trigger haptic feedback if available
			if ("vibrate" in navigator) {
				navigator.vibrate(50);
			}
			
			onClick(artwork);
		}
	};

	return (
		<group
			position={position}
			ref={frameRef}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
			onClick={handleClick}
		>
			{/* Pedestal */}
			<mesh position={[0, -1, 0]} castShadow>
				<boxGeometry args={[frameWidth + 0.5, 0.5, 0.5]} />
				<meshStandardMaterial
					color="#1a1a1a"
					metalness={0.9}
					roughness={0.1}
					emissive={hovered ? "#FF1493" : "#FDDA0D"}
					emissiveIntensity={glowIntensity * 2}
				/>
			</mesh>
			
			{/* Gallery Label */}
			<mesh position={[0, -0.75, 0.4]} rotation={[Math.PI / 4, 0, 0]}>
				<planeGeometry args={[frameWidth * 0.5, 0.2]} />
				<meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
			</mesh>
			
			<Html position={[0, -0.75, 0.4]} rotation={[Math.PI / 4, 0, 0]} 
				transform scale={0.1} center>
				<div className="text-white text-center font-serif w-64">
					<div className="text-lg font-bold">{artwork.title}</div>
					<div className="text-sm italic">{artwork.year}</div>
				</div>
			</Html>

			{/* Frame with enhanced materials */}
			<mesh castShadow>
				<boxGeometry args={[frameWidth + 0.1, frameHeight + 0.1, frameDepth]} />
				<meshStandardMaterial
					color={hovered ? "#FF1493" : "#333"}
					metalness={0.85}
					roughness={0.15}
					emissive={hovered ? "#FF1493" : "#FDDA0D"}
					emissiveIntensity={glowIntensity}
				/>
			</mesh>
			
			{/* Frame inner bevel */}
			<mesh position={[0, 0, frameDepth / 2 * 0.8]}>
				<boxGeometry args={[frameWidth + 0.05, frameHeight + 0.05, frameDepth * 0.2]} />
				<meshStandardMaterial
					color="#111"
					metalness={0.7}
					roughness={0.3}
				/>
			</mesh>

			{/* Art lighting effect - glowing outline */}
			{hovered && (
				<mesh position={[0, 0, frameDepth / 2 - 0.05]}>
					<planeGeometry args={[frameWidth + 0.12, frameHeight + 0.12]} />
					<meshBasicMaterial
						color={hovered ? "#FF1493" : "#FDDA0D"}
						transparent
						opacity={0.2}
					/>
				</mesh>
			)}

			{/* Artwork Canvas - with fallback for missing textures */}
			<mesh position={[0, 0, frameDepth / 2 + 0.001]}>
				<planeGeometry args={[frameWidth, frameHeight]} />
				{texture && textureLoaded ? (
					<meshBasicMaterial map={texture} />
				) : (
					<meshBasicMaterial color={hovered ? "#FF1493" : "#333"}>
						<color attach="color" args={[hovered ? "#FF1493" : "#333"]} />
					</meshBasicMaterial>
				)}
			</mesh>

			{/* Title on artwork when texture is missing */}
			{!textureLoaded && (
				<Html position={[0, 0, frameDepth / 2 + 0.002]} center>
					<div className="text-white text-center px-2 py-1">
						<div className="font-bold">{artwork.title}</div>
						<div className="text-xs text-brand-yellow">{artwork.year}</div>
					</div>
				</Html>
			)}

			{/* Enhanced Info Label */}
			{hovered && frameRef.current?.userData.isClose && (
				<Html
					position={[0, -(frameHeight / 2 + 0.3), 0.2]}
					center
					className="pointer-events-none"
				>
					<div className="bg-black/80 backdrop-blur-sm px-5 py-3 rounded-lg text-white text-center border border-brand-pink/30 shadow-lg shadow-brand-pink/20">
						<h3 className="text-lg font-bold">{artwork.title}</h3>
						<p className="text-brand-yellow">{artwork.year}</p>
						<p className="text-xs text-gray-300 mt-1">{artwork.technique}</p>
						<p className="text-xs text-white/70 mt-2">Click to view details</p>
					</div>
				</Html>
			)}
		</group>
	);
};

// Controls component for 3D Gallery
const Controls = ({ onMovement }) => {
	const { camera } = useThree();
	const controlsRef = useRef();
	const moveState = useRef({
		forward: false,
		backward: false,
		left: false,
		right: false,
		velocity: new THREE.Vector3(),
		isMoving: false,
		lastPosition: new THREE.Vector3()
	});

	const collisionBoxes = useRef([]);

	useEffect(() => {
		// Create collision boxes for artworks and walls
		collisionBoxes.current = ARTWORKS.map((artwork, index) => {
			const row = Math.floor(index / 4);
			const col = index % 4;
			const x = (col - 1.5) * 8;
			const z = -8 - row * 8;
			const width = artwork.dimensions?.width || 2;
			const height = artwork.dimensions?.height || 1.5;

			return new THREE.Box3(
				new THREE.Vector3(x - width / 2 - 1, -2, z - 1),
				new THREE.Vector3(x + width / 2 + 1, 2, z + 1)
			);
		});

		// Add boundary walls
		const wallSize = 50;
		collisionBoxes.current.push(
			// North wall
			new THREE.Box3(
				new THREE.Vector3(-wallSize, -10, -wallSize),
				new THREE.Vector3(wallSize, 10, -wallSize + 1)
			),
			// South wall
			new THREE.Box3(
				new THREE.Vector3(-wallSize, -10, wallSize - 1),
				new THREE.Vector3(wallSize, 10, wallSize)
			),
			// East wall
			new THREE.Box3(
				new THREE.Vector3(wallSize - 1, -10, -wallSize),
				new THREE.Vector3(wallSize, 10, wallSize)
			),
			// West wall
			new THREE.Box3(
				new THREE.Vector3(-wallSize, -10, -wallSize),
				new THREE.Vector3(-wallSize + 1, 10, wallSize)
			)
		);

		const handleKeyDown = (e) => {
			if (
				[
					"KeyW",
					"KeyS",
					"KeyA",
					"KeyD",
					"ArrowUp",
					"ArrowDown",
					"ArrowLeft",
					"ArrowRight",
				].includes(e.code)
			) {
				e.preventDefault();
				
				// Trigger haptic feedback if it just started moving
				if (!moveState.current.forward && !moveState.current.backward && 
					!moveState.current.left && !moveState.current.right) {
					if ("vibrate" in navigator) {
						navigator.vibrate(15);
					}
				}
				
				switch (e.code) {
					case "KeyW":
					case "ArrowUp":
						moveState.current.forward = true;
						break;
					case "KeyS":
					case "ArrowDown":
						moveState.current.backward = true;
						break;
					case "KeyA":
					case "ArrowLeft":
						moveState.current.left = true;
						break;
					case "KeyD":
					case "ArrowRight":
						moveState.current.right = true;
						break;
				}
			}
		};

		const handleKeyUp = (e) => {
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
					moveState.current.forward = false;
					break;
				case "KeyS":
				case "ArrowDown":
					moveState.current.backward = false;
					break;
				case "KeyA":
				case "ArrowLeft":
					moveState.current.left = false;
					break;
				case "KeyD":
				case "ArrowRight":
					moveState.current.right = false;
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		// Save initial position
		moveState.current.lastPosition = camera.position.clone();

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	useFrame((state, delta) => {
		if (controlsRef.current?.isLocked) {
			// Movement with momentum and collision detection
			const speed = 8;
			const drag = 5;
			const movementThreshold = 0.01;

			// Apply forces
			if (moveState.current.forward)
				moveState.current.velocity.z -= speed * delta;
			if (moveState.current.backward)
				moveState.current.velocity.z += speed * delta;
			if (moveState.current.left) moveState.current.velocity.x -= speed * delta;
			if (moveState.current.right)
				moveState.current.velocity.x += speed * delta;

			// Apply drag for smooth deceleration
			moveState.current.velocity.x *= 1 - Math.min(drag * delta, 0.9);
			moveState.current.velocity.z *= 1 - Math.min(drag * delta, 0.9);

			// Calculate new position
			const newPosition = camera.position.clone();
			newPosition.x += moveState.current.velocity.x;
			newPosition.z += moveState.current.velocity.z;

			// Player collision box
			const playerBox = new THREE.Box3(
				new THREE.Vector3(
					newPosition.x - 0.3,
					newPosition.y - 1,
					newPosition.z - 0.3
				),
				new THREE.Vector3(
					newPosition.x + 0.3,
					newPosition.y + 1,
					newPosition.z + 0.3
				)
			);

			// Check for collisions
			let collision = false;
			for (const box of collisionBoxes.current) {
				if (box.intersectsBox(playerBox)) {
					collision = true;
					break;
				}
			}

			// Update position if no collision
			if (!collision) {
				camera.position.copy(newPosition);
				
				// Check if player is moving
				const distanceMoved = camera.position.distanceTo(moveState.current.lastPosition);
				const wasMoving = moveState.current.isMoving;
				moveState.current.isMoving = distanceMoved > movementThreshold;
				
				// If player just started moving, or continues to move significantly, trigger sound
				if (moveState.current.isMoving && (distanceMoved > movementThreshold * 10 || !wasMoving)) {
					if (onMovement) {
						onMovement();
					}
					moveState.current.lastPosition = camera.position.clone();
				}
			} else {
				// Reset velocity on collision
				moveState.current.velocity.set(0, 0, 0);
				moveState.current.isMoving = false;
				
				// Trigger haptic feedback on collision
				if ("vibrate" in navigator) {
					navigator.vibrate(20);
				}
			}
		}
	});

	return <PointerLockControls ref={controlsRef} />;
};

// Scene component for 3D Gallery
const Scene = ({ onArtworkSelect, onMovement }) => {
	// References to track camera and scene elements
	const sceneRef = useRef();
	const floorRef = useRef();
	
	// Add floating particles for ambient effect
	const particles = useMemo(() => {
		return Array.from({ length: 50 }).map(() => ({
			position: [
				(Math.random() - 0.5) * 100,
				Math.random() * 10,
				(Math.random() - 0.5) * 100
			],
			size: Math.random() * 0.5 + 0.1,
			speed: Math.random() * 0.05 + 0.02
		}));
	}, []);
	
	// Animate floating particles
	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();
		floorRef.current.rotation.z = t * 0.05;
		
		// Make artwork frames gently float
		if (sceneRef.current) {
			sceneRef.current.children.forEach((child, i) => {
				if (child.userData.isArtworkFrame) {
					child.position.y += Math.sin(t * 0.5 + i) * 0.0005;
				}
			});
		}
	});

	return (
		<group ref={sceneRef}>
			<color attach="background" args={["#000000"]} />
			<fog attach="fog" args={["#000000", 5, 30]} />

			{/* Ambient lighting and stars */}
			<ambientLight intensity={0.4} />
			<Stars
				radius={50}
				depth={50}
				count={1500}
				factor={4}
				saturation={1}
				fade
				speed={1}
			/>

			{/* Themed lighting */}
			<pointLight
				position={[10, 10, 0]}
				intensity={0.5}
				color="#FF1493"
				distance={20}
			/>
			<pointLight
				position={[-10, 10, 0]}
				intensity={0.5}
				color="#FDDA0D"
				distance={20}
			/>
			<pointLight
				position={[0, -10, 0]}
				intensity={0.3}
				color="#6B46C1"
				distance={20}
			/>
			
			{/* Dynamic spotlights for artworks */}
			{ARTWORKS.map((artwork, index) => {
				const row = Math.floor(index / 4);
				const col = index % 4;
				const x = (col - 1.5) * 8;
				const z = -8 - row * 8;
				
				return (
					<spotLight
						key={`spotlight-${artwork.id}`}
						position={[x, 5, z]}
						angle={0.3}
						penumbra={0.8}
						intensity={0.7}
						distance={15}
						castShadow
						color="#ffffff"
					/>
				);
			})}

			{/* Controls with movement callback */}
			<Controls onMovement={onMovement} />

			{/* Floor with improved grid */}
			<mesh
				ref={floorRef}
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -1.5, 0]}
				receiveShadow
			>
				<planeGeometry args={[100, 100, 50, 50]} />
				<meshStandardMaterial
					color="#111111"
					metalness={0.9}
					roughness={0.1}
					wireframe={true}
					opacity={0.3}
					transparent={true}
					emissive="#6B46C1"
					emissiveIntensity={0.05}
				/>
			</mesh>
			
			{/* Floating particles */}
			{particles.map((particle, i) => (
				<mesh
					key={i}
					position={particle.position}
					scale={[particle.size, particle.size, particle.size]}
				>
					<sphereGeometry args={[1, 8, 8]} />
					<meshBasicMaterial
						color={i % 3 === 0 ? "#FF1493" : i % 3 === 1 ? "#FDDA0D" : "#6B46C1"}
						transparent
						opacity={0.3}
					/>
				</mesh>
			))}

			{/* Artworks */}
			{ARTWORKS.map((artwork, index) => {
				const row = Math.floor(index / 4);
				const col = index % 4;
				const x = (col - 1.5) * 8;
				const z = -8 - row * 8;

				return (
					<ArtworkFrame
						key={artwork.id}
						artwork={artwork}
						position={[x, 1, z]}
						onClick={onArtworkSelect}
					/>
				);
			})}
			
			{/* Museum display stands and ropes */}
			{ARTWORKS.map((artwork, index) => {
				const row = Math.floor(index / 4);
				const col = index % 4;
				const x = (col - 1.5) * 8;
				const z = -8 - row * 8;
				
				return (
					<group key={`stand-${artwork.id}`}>
						{/* Floor marker */}
						<mesh 
							position={[x, -1.49, z]} 
							rotation={[-Math.PI / 2, 0, 0]}
							receiveShadow
						>
							<circleGeometry args={[1.5, 32]} />
							<meshStandardMaterial 
								color="#222" 
								metalness={0.9}
								roughness={0.1}
								emissive={index % 2 === 0 ? "#FF1493" : "#FDDA0D"}
								emissiveIntensity={0.2}
							/>
						</mesh>
					</group>
				);
			})}
		</group>
	);
};

// Mobile Gallery component
const MobileGallery = ({ onArtworkSelect }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const navigate = useNavigate();

	const currentArtwork = ARTWORKS[currentIndex];

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % ARTWORKS.length);
	};

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev - 1 + ARTWORKS.length) % ARTWORKS.length);
	};

	const handleArtworkClick = () => {
		if (onArtworkSelect) {
			onArtworkSelect(currentArtwork);
		} else {
			navigate(`/works/${currentArtwork.id}`);
		}
	};

	return (
		<div className="fixed inset-0 bg-black">
			<div className="relative h-full flex flex-col">
				{/* Gallery Content */}
				<div className="flex-1 relative">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 p-4"
							onClick={handleArtworkClick}
						>
							<Image
								src={currentArtwork.image}
								alt={currentArtwork.title}
								className="w-full h-full object-contain"
							/>
						</motion.div>
					</AnimatePresence>

					{/* Navigation Buttons */}
					<button
						onClick={(e) => {
							e.stopPropagation();
							handlePrev();
						}}
						className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
						aria-label="Previous artwork"
					>
						<ChevronLeft size={20} />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleNext();
						}}
						className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
						aria-label="Next artwork"
					>
						<ChevronRight size={20} />
					</button>
				</div>

				{/* Info Panel */}
				<div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent px-6 pt-24 pb-8">
					<h2 className="text-2xl font-bold text-white mb-2">
						{currentArtwork.title}
					</h2>
					<p className="text-brand-yellow mb-2">{currentArtwork.year}</p>
					<p className="text-gray-300 line-clamp-2">
						{currentArtwork.description}
					</p>

					{/* Progress Dots */}
					<div className="flex justify-center gap-2 mt-6">
						{ARTWORKS.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`w-2 h-2 rounded-full transition-colors ${
									index === currentIndex
										? "bg-brand-pink"
										: "bg-white/50 hover:bg-white/70"
								}`}
								aria-label={`Artwork ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

// Main Gallery3D component
const Gallery3D = ({ onArtworkSelect }) => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const isLowPerformance = useMediaQuery(
		"(max-width: 1024px) and (max-height: 768px)"
	);
	const [audioEnabled, setAudioEnabled] = useState(false);
	const [showMap, setShowMap] = useState(false);
	const audioRef = useRef(null);
	const navigate = useNavigate();

	// Create and manage audio elements
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
				setAudioEnabled(false);
			});
		}
		
		if (audioRef.current.footsteps) {
			audioRef.current.footsteps.volume = 0.3;
		}
		
		// Prevent WebGL context loss when switching between tabs/minimizing
		const handleVisibilityChange = () => {
			// When page becomes visible again, try to restore context
			if (document.visibilityState === 'visible') {
				// Force a re-render after a short delay
				setTimeout(() => {
					if (isMobile || isLowPerformance) {
						// For mobile, just force a state update
						setAudioEnabled(prev => prev);
					}
				}, 300);
			}
		};
		
		document.addEventListener('visibilitychange', handleVisibilityChange);
		
		// Handle screen orientation changes on mobile
		const handleOrientationChange = () => {
			setTimeout(() => {
				if (isMobile || isLowPerformance) {
					// Force a re-render
					setAudioEnabled(prev => prev);
				}
			}, 300);
		};
		
		window.addEventListener('orientationchange', handleOrientationChange);
		
		return () => {
			// Cleanup audio and event listeners when component unmounts
			if (audioRef.current.ambience) {
				audioRef.current.ambience.pause();
				audioRef.current.ambience.removeEventListener('error', () => {});
			}
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('orientationchange', handleOrientationChange);
		};
	}, [isMobile, isLowPerformance]);

	// Toggle sound effects
	useEffect(() => {
		if (audioEnabled) {
			if (audioRef.current.ambience) {
				audioRef.current.ambience.play().catch(e => console.log("Audio play prevented:", e));
			}
		} else {
			if (audioRef.current.ambience) {
				audioRef.current.ambience.pause();
			}
		}
	}, [audioEnabled]);

	// Pass navigate to onArtworkSelect if not provided
	const handleArtworkSelect = (artwork) => {
		if (onArtworkSelect) {
			onArtworkSelect(artwork);
		} else {
			navigate(`/works/${artwork.id}`);
		}
	};
	
	// Play footstep sounds when moving
	const handleMovement = () => {
		if (audioEnabled && audioRef.current?.footsteps) {
			if (audioRef.current.footsteps.paused) {
				audioRef.current.footsteps.currentTime = 0;
				audioRef.current.footsteps.play().catch(e => console.log("Audio play prevented:", e));
			}
		}
	};

	// Use mobile gallery for mobile or low-performance devices
	if (isMobile || isLowPerformance) {
		return <MobileGallery onArtworkSelect={handleArtworkSelect} />;
	}

	return (
		<div className="w-screen h-screen bg-black">
			<Canvas
				shadows
				gl={{
					antialias: true,
					powerPreference: "high-performance",
					alpha: false,
					stencil: false,
				}}
				camera={{ position: [0, 1.6, 5], fov: 75 }}
				performance={{ min: 0.5 }}
				dpr={[1, 2]}
				onCreated={() => {
					// Trigger haptic feedback when canvas is created
					if ("vibrate" in navigator) {
						navigator.vibrate(50);
					}
				}}
			>
				<Suspense fallback={<LoadingScreen />}>
					<Scene onArtworkSelect={handleArtworkSelect} onMovement={handleMovement} />
				</Suspense>
			</Canvas>

			<div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-10 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full text-white text-center border border-brand-pink/20">
				Click to start | WASD to move | Mouse to look
			</div>
			
			{/* Controls Toolbar */}
			<div className="fixed top-4 right-4 flex gap-2 z-10">
				{/* Sound Toggle */}
				<motion.button
					onClick={() => setAudioEnabled(prev => !prev)}
					whileTap={{ scale: 0.9 }}
					className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
						audioEnabled ? 'bg-brand-pink/70' : 'bg-black/50 hover:bg-black/70'
					}`}
					aria-label={audioEnabled ? "Mute sound" : "Enable sound"}
				>
					{audioEnabled ? <Volume2 size={18} /> : <Volume1 size={18} />}
				</motion.button>
				
				{/* Map Toggle */}
				<motion.button
					onClick={() => setShowMap(prev => !prev)}
					whileTap={{ scale: 0.9 }}
					className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
						showMap ? 'bg-brand-pink/70' : 'bg-black/50 hover:bg-black/70'
					}`}
					aria-label={showMap ? "Hide map" : "Show map"}
				>
					<Map size={18} />
				</motion.button>
			</div>
			
			{/* Mini Map Overlay */}
			<AnimatePresence>
				{showMap && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className="fixed top-20 right-4 w-44 aspect-square bg-black/70 rounded-lg border border-gray-700 p-2 z-20"
					>
						<div className="relative w-full h-full">
							{/* Map grid */}
							<div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
								{ARTWORKS.map((artwork, index) => {
									const row = Math.floor(index / 4);
									const col = index % 4;
									
									return (
										<div key={index} className="relative border border-gray-700/50 flex items-center justify-center">
											<div className={`w-2 h-2 rounded-full bg-gray-500`}></div>
											<div className="absolute inset-0 flex items-center justify-center text-[8px] text-white/70 pointer-events-none">
												{artwork.title.substring(0, 3)}
											</div>
										</div>
									);
								})}
							</div>
							
							{/* Player position indicator - this will need to be updated with actual player position */}
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<div className="w-2 h-2 rounded-full bg-brand-pink"></div>
								<div className="w-4 h-4 rounded-full bg-brand-pink/30 animate-ping absolute -top-1 -left-1"></div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Gallery3D;
