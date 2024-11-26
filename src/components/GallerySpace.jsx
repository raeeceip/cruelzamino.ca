import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
	Environment,
	Lightformer,
	SpotLight,
	useHelper,
} from "@react-three/drei";
import * as THREE from "three";

export function GallerySpace() {
	const mainLightRef = useRef();
	const spotlightsRef = useRef([]);

	// Helper to visualize light in dev mode
	useHelper(mainLightRef, THREE.DirectionalLightHelper, 1, "red");

	// Create grid material
	const gridMaterial = useMemo(() => {
		const material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
				color: { value: new THREE.Color("#1a1a1a") },
			},
			vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
			fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec3 color;
        
        void main() {
          float grid = 0.05;
          vec2 pos = fract(vUv * 40.0);
          float square = smoothstep(0.0, grid, pos.x) * smoothstep(0.0, grid, pos.y);
          square *= smoothstep(grid, 0.0, pos.x - (1.0 - grid)) * smoothstep(grid, 0.0, pos.y - (1.0 - grid));
          gl_FragColor = vec4(color, square * 0.3 + 0.1);
        }
      `,
			transparent: true,
		});
		return material;
	}, []);

	// Animate grid and lights
	useFrame((state) => {
		gridMaterial.uniforms.time.value = state.clock.elapsedTime;

		spotlightsRef.current.forEach((light, i) => {
			if (light) {
				const time = state.clock.elapsedTime + (i * Math.PI) / 2;
				light.intensity = 0.8 + Math.sin(time) * 0.2;
			}
		});
	});

	return (
		<>
			{/* Environment */}
			<Environment preset="city" />
			<fog attach="fog" args={["#000", 1, 50]} />

			{/* Main Lighting */}
			<directionalLight
				ref={mainLightRef}
				position={[5, 10, 5]}
				intensity={0.5}
				castShadow
			/>
			<ambientLight intensity={0.3} />

			{/* Floor */}
			<group position={[0, 0, 0]}>
				{/* Base floor */}
				<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
					<planeGeometry args={[40, 40]} />
					<meshStandardMaterial color="#111" metalness={0.9} roughness={0.4} />
				</mesh>

				{/* Grid overlay */}
				<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
					<planeGeometry args={[40, 40]} />
					<primitive object={gridMaterial} attach="material" />
				</mesh>
			</group>

			{/* Walls with lighting strips */}
			{[
				{ position: [0, 10, -20], rotation: [0, 0, 0] },
				{ position: [-20, 10, 0], rotation: [0, Math.PI / 2, 0] },
				{ position: [20, 10, 0], rotation: [0, -Math.PI / 2, 0] },
			].map((wall, index) => (
				<group key={index}>
					<mesh position={wall.position} rotation={wall.rotation}>
						<planeGeometry args={[40, 20]} />
						<meshStandardMaterial
							color="#1a1a1a"
							metalness={0.4}
							roughness={0.6}
						/>
					</mesh>

					{/* Light strips */}
					<Lightformer
						position={[wall.position[0], 18, wall.position[2]]}
						rotation={wall.rotation}
						scale={[35, 0.5, 1]}
						intensity={0.2}
						color="#fff"
					/>
				</group>
			))}

			{/* Ceiling */}
			<mesh position={[0, 20, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<planeGeometry args={[40, 40]} />
				<meshStandardMaterial color="#111" metalness={0.5} roughness={0.9} />
			</mesh>

			{/* Artwork Spotlights */}
			{[-15, -5, 5, 15].map((x, i) => (
				<SpotLight
					key={i}
					ref={(el) => (spotlightsRef.current[i] = el)}
					position={[x, 19, -15]}
					angle={0.3}
					penumbra={0.2}
					intensity={0.8}
					distance={8}
					color="#fff"
					castShadow
				/>
			))}
		</>
	);
}
