import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
	PointerLockControls,
	Html,
	useTexture,
	PerspectiveCamera,
	useProgress,
	Stars,
} from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ARTWORKS } from "../../constants/data";
import MobileGallery from "./MobileGallery";

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

const Background = () => {
	return (
		<mesh position={[0, 0, -15]}>
			<planeGeometry args={[100, 100]} />
			<meshBasicMaterial color={new THREE.Color("#000000")}>
				<color attach="color" args={["#000000"]} />
			</meshBasicMaterial>
		</mesh>
	);
};

const ArtworkFrame = ({ artwork, position, onClick }) => {
	const frameRef = useRef();
	const [hovered, setHovered] = useState(false);
	const { camera } = useThree();

	const texture = useTexture(artwork.image);

	const frameWidth = artwork.dimensions?.width || 2;
	const frameHeight = artwork.dimensions?.height || 1.5;
	const frameDepth = 0.1;

	// Collision box
	const collisionBox = new THREE.Box3(
		new THREE.Vector3(
			position[0] - frameWidth / 2 - 1,
			position[1] - frameHeight / 2 - 1,
			position[2] - 1
		),
		new THREE.Vector3(
			position[0] + frameWidth / 2 + 1,
			position[1] + frameHeight / 2 + 1,
			position[2] + 1
		)
	);

	useFrame(() => {
		if (frameRef.current) {
			const distance = camera.position.distanceTo(frameRef.current.position);
			frameRef.current.userData.isClose = distance < 6;
		}
	});

	const handleClick = (e) => {
		if (frameRef.current?.userData.isClose) {
			e.stopPropagation();
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
			{/* Pedestal with glow */}
			<mesh position={[0, -1, 0]} castShadow>
				<boxGeometry args={[frameWidth + 0.5, 0.5, 0.5]} />
				<meshStandardMaterial
					color="#1a1a1a"
					metalness={0.9}
					roughness={0.1}
					emissive={hovered ? "#FF1493" : "#FDDA0D"}
					emissiveIntensity={0.2}
				/>
			</mesh>

			{/* Frame */}
			<mesh castShadow>
				<boxGeometry args={[frameWidth + 0.1, frameHeight + 0.1, frameDepth]} />
				<meshStandardMaterial
					color={hovered ? "#FF1493" : "#333"}
					metalness={0.8}
					roughness={0.2}
					emissive={hovered ? "#FF1493" : "#FDDA0D"}
					emissiveIntensity={0.1}
				/>
			</mesh>

			{/* Artwork */}
			<mesh position={[0, 0, frameDepth / 2 + 0.001]}>
				<planeGeometry args={[frameWidth, frameHeight]} />
				<meshBasicMaterial map={texture} />
			</mesh>

			{/* Info Label */}
			{hovered && frameRef.current?.userData.isClose && (
				<Html
					position={[0, -(frameHeight / 2 + 0.3), 0.2]}
					center
					className="pointer-events-none"
				>
					<div className="bg-black/90 px-4 py-2 rounded-lg text-white text-center border border-brand-pink/20">
						<h3 className="text-lg font-bold">{artwork.title}</h3>
						<p className="text-brand-yellow">{artwork.year}</p>
					</div>
				</Html>
			)}
		</group>
	);
};

const Controls = () => {
	const { camera } = useThree();
	const controlsRef = useRef();
	const moveState = useRef({
		forward: false,
		backward: false,
		left: false,
		right: false,
	});

	const collisionBoxes = useRef([]);

	useEffect(() => {
		// Create collision boxes for artworks
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

		const handleKeyDown = (e) => {
			if (["KeyW", "KeyS", "KeyA", "KeyD"].includes(e.code)) {
				e.preventDefault();
				switch (e.code) {
					case "KeyW":
						moveState.current.forward = true;
						break;
					case "KeyS":
						moveState.current.backward = true;
						break;
					case "KeyA":
						moveState.current.left = true;
						break;
					case "KeyD":
						moveState.current.right = true;
						break;
				}
			}
		};

		const handleKeyUp = (e) => {
			switch (e.code) {
				case "KeyW":
					moveState.current.forward = false;
					break;
				case "KeyS":
					moveState.current.backward = false;
					break;
				case "KeyA":
					moveState.current.left = false;
					break;
				case "KeyD":
					moveState.current.right = false;
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	useFrame((state, delta) => {
		if (controlsRef.current?.isLocked) {
			const speed = 8;
			const newPosition = camera.position.clone();

			if (moveState.current.forward) newPosition.z -= speed * delta;
			if (moveState.current.backward) newPosition.z += speed * delta;
			if (moveState.current.left) newPosition.x -= speed * delta;
			if (moveState.current.right) newPosition.x += speed * delta;

			// Clamp to bounds
			newPosition.x = THREE.MathUtils.clamp(newPosition.x, -30, 30);
			newPosition.z = THREE.MathUtils.clamp(newPosition.z, -30, 30);

			// Check collisions
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

			// Only update if no collision
			const hasCollision = collisionBoxes.current.some((box) =>
				box.intersectsBox(playerBox)
			);
			if (!hasCollision) {
				camera.position.copy(newPosition);
			}
		}
	});

	return <PointerLockControls ref={controlsRef} />;
};

const Scene = ({ onArtworkSelect }) => {
	return (
		<>
			<color attach="background" args={["#000000"]} />
			<fog attach="fog" args={["#000000", 5, 30]} />
			<Stars
				radius={50}
				depth={50}
				count={1000}
				factor={4}
				saturation={1}
				fade
				speed={1}
			/>

			<ambientLight intensity={0.4} />

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

			<Controls />

			{/* Floor */}
			<mesh
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -1.5, 0]}
				receiveShadow
			>
				<planeGeometry args={[100, 100]} />
				<meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
			</mesh>

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
		</>
	);
};

const Gallery3D = ({ onArtworkSelect }) => {
	const isMobile = useMediaQuery("(max-width: 768px)");

	if (isMobile) {
		return <MobileGallery onArtworkSelect={onArtworkSelect} />;
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
			>
				<Suspense fallback={<LoadingScreen />}>
					<Scene onArtworkSelect={onArtworkSelect} />
				</Suspense>
			</Canvas>

			<div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full text-white text-center z-10 border border-brand-pink/20">
				Click to start | WASD to move | Mouse to look
			</div>
		</div>
	);
};

export default Gallery3D;
