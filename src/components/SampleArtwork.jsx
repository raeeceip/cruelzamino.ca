import React from "react";

const generateAbstractArt = (index) => {
	// Generate unique but consistent patterns based on index
	const hue = (index * 137.508) % 360;
	const shapes = [];

	for (let i = 0; i < 5; i++) {
		const x = ((index + i) * 50) % 200;
		const y = (index * i * 30) % 200;
		const size = 20 + (((index + i) * 10) % 60);

		shapes.push(
			<g key={i} transform={`translate(${x},${y})`}>
				<rect
					width={size}
					height={size}
					fill={`hsl(${(hue + i * 30) % 360}, 70%, 50%)`}
					opacity={0.7}
					transform={`rotate(${index * i * 10})`}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={size / 4}
					fill={`hsl(${(hue + i * 60) % 360}, 80%, 60%)`}
					opacity={0.8}
				/>
			</g>
		);
	}

	return (
		<svg width="200" height="200" viewBox="0 0 200 200">
			<rect width="200" height="200" fill={`hsl(${hue}, 30%, 15%)`} />
			{shapes}
		</svg>
	);
};

const SampleArtwork = ({ index = 0 }) => {
	return generateAbstractArt(index);
};

export default SampleArtwork;
