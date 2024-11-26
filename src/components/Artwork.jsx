// src/components/Artwork.jsx
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export function Artwork({ artwork, onClick }) {
	const frameRef = useRef();
	const [hovered, setHovered] = useState(false);
	const [loaded, setLoaded] = useState(false);

	// Create texture loader
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(artwork.image, () => setLoaded(true));

	// Add subtle hover animation
	useFrame((state) => {
		if (frameRef.current && hovered) {
			frameRef.current.rotation.y =
				Math.sin(state.clock.elapsedTime * 2) * 0.02;
		}
	});

	const frameWidth = artwork.dimensions?.width || 2;
	const frameHeight = artwork.dimensions?.height || 1.5;
	const frameDepth = 0.1;

	return (
		<group
			position={artwork.position || [0, 1.5, -5]}
			ref={frameRef}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
			onClick={onClick}
		>
			{/* Artwork Frame */}
			<mesh castShadow>
				<boxGeometry args={[frameWidth + 0.1, frameHeight + 0.1, frameDepth]} />
				<meshStandardMaterial
					color={hovered ? "#444" : "#333"}
					metalness={0.5}
					roughness={0.7}
				/>
			</mesh>

			{/* Artwork Canvas */}
			<mesh position={[0, 0, frameDepth / 2 + 0.001]}>
				<planeGeometry args={[frameWidth, frameHeight]} />
				<meshStandardMaterial
					map={texture}
					emissive="#fff"
					emissiveIntensity={0.1}
				/>
			</mesh>

			{/* Info Label */}
			<Html
				position={[0, -(frameHeight / 2 + 0.2), 0]}
				center
				style={{
					opacity: hovered ? 1 : 0,
					transition: "opacity 0.3s",
					background: "rgba(0,0,0,0.8)",
					padding: "8px 12px",
					borderRadius: "4px",
					color: "white",
					fontSize: "14px",
					pointerEvents: "none",
					whiteSpace: "nowrap",
				}}
			>
				{artwork.title} by {artwork.artist}
			</Html>

			{/* Loading Placeholder */}
			{!loaded && (
				<Html center>
					<div
						style={{
							width: `${frameWidth * 100}px`,
							height: `${frameHeight * 100}px`,
							background: "#222",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
						}}
					>
						Hm
					</div>
				</Html>
			)}
		</group>
	);
}
