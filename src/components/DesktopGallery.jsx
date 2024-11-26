// src/components/DesktopGallery.jsx
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { GallerySpace } from "./GallerySpace";
import { Artwork } from "./Artwork";

export function DesktopGallery({ artworks, onArtworkSelect }) {
	const controlsRef = useRef();
	const { camera } = useThree();
	const moveForward = useRef(false);
	const moveBackward = useRef(false);
	const moveLeft = useRef(false);
	const moveRight = useRef(false);
	const velocity = useRef(new THREE.Vector3());
	const direction = useRef(new THREE.Vector3());

	useEffect(() => {
		const handleKeyDown = (event) => {
			switch (event.code) {
				case "ArrowUp":
				case "KeyW":
					moveForward.current = true;
					break;
				case "ArrowDown":
				case "KeyS":
					moveBackward.current = true;
					break;
				case "ArrowLeft":
				case "KeyA":
					moveLeft.current = true;
					break;
				case "ArrowRight":
				case "KeyD":
					moveRight.current = true;
					break;
			}
		};

		const handleKeyUp = (event) => {
			switch (event.code) {
				case "ArrowUp":
				case "KeyW":
					moveForward.current = false;
					break;
				case "ArrowDown":
				case "KeyS":
					moveBackward.current = false;
					break;
				case "ArrowLeft":
				case "KeyA":
					moveLeft.current = false;
					break;
				case "ArrowRight":
				case "KeyD":
					moveRight.current = false;
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		// Instructions overlay
		const instructions = document.createElement("div");
		instructions.style.position = "fixed";
		instructions.style.top = "20px";
		instructions.style.left = "50%";
		instructions.style.transform = "translateX(-50%)";
		instructions.style.background = "rgba(0,0,0,0.7)";
		instructions.style.color = "white";
		instructions.style.padding = "10px 20px";
		instructions.style.borderRadius = "5px";
		instructions.style.fontFamily = "sans-serif";
		instructions.style.fontSize = "14px";
		instructions.style.pointerEvents = "none";
		instructions.style.zIndex = "1000";
		instructions.textContent = "Click to start | WASD to move | Mouse to look";
		document.body.appendChild(instructions);

		// Handle pointer lock
		const handleClick = () => {
			controlsRef.current?.lock();
		};
		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
			document.removeEventListener("click", handleClick);
			document.body.removeChild(instructions);
		};
	}, []);

	useFrame((state, delta) => {
		if (controlsRef.current?.isLocked) {
			velocity.current.x -= velocity.current.x * 10.0 * delta;
			velocity.current.z -= velocity.current.z * 10.0 * delta;

			direction.current.z =
				Number(moveForward.current) - Number(moveBackward.current);
			direction.current.x =
				Number(moveRight.current) - Number(moveLeft.current);
			direction.current.normalize();

			if (moveForward.current || moveBackward.current) {
				velocity.current.z -= direction.current.z * 400.0 * delta;
			}
			if (moveLeft.current || moveRight.current) {
				velocity.current.x -= direction.current.x * 400.0 * delta;
			}

			// Update position
			const moveX = -velocity.current.x * delta;
			const moveZ = -velocity.current.z * delta;

			// Collision detection with walls
			const newX = camera.position.x + moveX;
			const newZ = camera.position.z + moveZ;

			// Simple boundary checks
			if (Math.abs(newX) < 19) {
				// Allow movement within walls
				camera.position.x = newX;
			}
			if (Math.abs(newZ) < 19) {
				camera.position.z = newZ;
			}

			// Keep camera at constant height
			camera.position.y = 1.6;
		}
	});

	return (
		<>
			<PointerLockControls ref={controlsRef} />

			{/* Lights */}
			<ambientLight intensity={0.5} />
			<directionalLight position={[10, 10, 5]} intensity={0.7} />

			<GallerySpace />

			{artworks.map((artwork) => (
				<Artwork
					key={artwork.id}
					artwork={artwork}
					onClick={() => {
						if (controlsRef.current?.isLocked) {
							controlsRef.current.unlock();
							onArtworkSelect(artwork);
						}
					}}
				/>
			))}
		</>
	);
}
