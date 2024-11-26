import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const LoaderContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: #111;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
`;

const LogoSVG = styled(motion.svg)`
	width: 150px;
	height: 150px;
	color: white;
`;

const ProgressBar = styled(motion.div)`
	position: absolute;
	bottom: 20%;
	width: 200px;
	height: 2px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 1px;
	overflow: hidden;
`;

const Progress = styled(motion.div)`
	height: 100%;
	background: white;
	transform-origin: left;
`;

export function Loader() {
	const pathRef = useRef();

	useEffect(() => {
		if (pathRef.current) {
			const length = pathRef.current.getTotalLength();
			pathRef.current.style.strokeDasharray = length;
			pathRef.current.style.strokeDashoffset = length;
		}
	}, []);

	return (
		<LoaderContainer>
			<LogoSVG
				viewBox="0 0 800 800"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<motion.circle
					cx="400"
					cy="400"
					r="380"
					fill="none"
					stroke="currentColor"
					strokeWidth="20"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 2, ease: "easeInOut" }}
				/>
				<motion.path
					ref={pathRef}
					d="M250 400 L350 300 L450 400 L550 300"
					fill="none"
					stroke="currentColor"
					strokeWidth="25"
					strokeLinecap="round"
					strokeLinejoin="round"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
				/>
				<motion.text
					x="400"
					y="450"
					textAnchor="middle"
					fontSize="120"
					fill="currentColor"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 2 }}
				>
					Zam
				</motion.text>
			</LogoSVG>
			<ProgressBar>
				<Progress
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: 2.5, ease: "easeInOut" }}
				/>
			</ProgressBar>
		</LoaderContainer>
	);
}
