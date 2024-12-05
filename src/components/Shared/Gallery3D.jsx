import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ARTWORKS } from "../../constants/data";
import MobileGallery from "./MobileGallery";

const ArtworkFrame = ({ artwork, position, onClick }) => {
	const frameRef = useRef();
	const [hovered, setHovered] = useState(false);
	const [textureLoaded, setTextureLoaded] = useState(false);
	const texture = useTexture(artwork.image, () => setTextureLoaded(true));

	const frameWidth = artwork.dimensions?.width || 2;
	const frameHeight = artwork.dimensions?.height || 1.5;
	const frameDepth = 0.1;

	return (
		<group
			position={position}
			ref={frameRef}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
			onClick={onClick}
		>
			{/* Frame */}
			<mesh castShadow>
				<boxGeometry args={[frameWidth + 0.1, frameHeight + 0.1, frameDepth]} />
				<meshStandardMaterial
					color={hovered ? "#FF1493" : "#333"}
					metalness={0.5}
					roughness={0.7}
				/>
			</mesh>

			{/* Artwork Canvas */}
			{textureLoaded && (
				<mesh position={[0, 0, frameDepth / 2 + 0.001]}>
					<planeGeometry args={[frameWidth, frameHeight]} />
					<meshBasicMaterial map={texture} />
				</mesh>
			)}

			{/* Info Label */}
			{hovered && (
				<Html
					position={[0, -(frameHeight / 2 + 0.2), 0]}
					center
					className="pointer-events-none px-4 py-2 bg-black/80 text-white rounded-lg"
				>
					<div className="text-center">
						<h3 className="text-lg font-bold">{artwork.title}</h3>
						<p className="text-sm text-brand-yellow">{artwork.year}</p>
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
		velocity: new THREE.Vector3(),
		direction: new THREE.Vector3(),
	});

	useEffect(() => {
		const handleKeyDown = (event) => {
			switch (event.code) {
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
		};

		const handleKeyUp = (event) => {
			switch (event.code) {
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

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	useFrame((state, delta) => {
		if (controlsRef.current?.isLocked) {
			const speed = 5;
			const { velocity, direction } = moveState.current;

			velocity.x *= 0.9;
			velocity.z *= 0.9;

			direction.z =
				Number(moveState.current.forward) - Number(moveState.current.backward);
			direction.x =
				Number(moveState.current.right) - Number(moveState.current.left);
			direction.normalize();

			if (moveState.current.forward || moveState.current.backward) {
				velocity.z -= direction.z * speed * delta;
			}
			if (moveState.current.left || moveState.current.right) {
				velocity.x -= direction.x * speed * delta;
			}

			const moveX = -velocity.x * delta;
			const moveZ = -velocity.z * delta;

			if (Math.abs(camera.position.x + moveX) < 15) {
				camera.position.x += moveX;
			}
			if (Math.abs(camera.position.z + moveZ) < 15) {
				camera.position.z += moveZ;
			}
		}
	});

	return <PointerLockControls ref={controlsRef} />;
};

const Scene = ({ onArtworkSelect }) => {
	return (
		<>
			<ambientLight intensity={0.5} />
			<directionalLight position={[10, 10, 5]} intensity={0.7} castShadow />
			<Controls />

			{/* Floor */}
			<mesh
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -0.5, 0]}
				receiveShadow
			>
				<planeGeometry args={[100, 100]} />
				<meshStandardMaterial color="#111" metalness={0.8} roughness={0.5} />
			</mesh>

			{/* Artwork Frames */}
			{ARTWORKS.map((artwork, index) => {
				const row = Math.floor(index / 3);
				const col = index % 3;
				const x = (col - 1) * 6;
				const z = -5 - row * 6;

				return (
					<ArtworkFrame
						key={artwork.id}
						artwork={artwork}
						position={[x, 1.5, z]}
						onClick={() => onArtworkSelect(artwork)}
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
				camera={{ position: [0, 1.6, 5], fov: 75 }}
				gl={{ antialias: true }}
			>
				<Scene onArtworkSelect={onArtworkSelect} />
			</Canvas>

			<div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full text-white text-center z-10">
				Click to start | WASD to move | Mouse to look
			</div>
		</div>
	);
};

export default Gallery3D;
