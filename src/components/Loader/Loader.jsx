import { motion } from "framer-motion";

const Loader = () => {
	return (
		<div className="fixed inset-0 bg-black flex items-center justify-center z-50">
			<div className="relative w-40 h-40">
				{/* Outer rotating circle */}
				<motion.div
					className="absolute inset-0 rounded-full border-4 border-[#FF1493]"
					animate={{
						rotate: 360,
						scale: [1, 1.1, 1],
					}}
					transition={{
						rotate: {
							duration: 2,
							repeat: Infinity,
							ease: "linear",
						},
						scale: {
							duration: 1,
							repeat: Infinity,
							ease: "easeInOut",
						},
					}}
				/>

				{/* Inner rotating circle */}
				<motion.div
					className="absolute inset-2 rounded-full border-4 border-[#FDDA0D]"
					animate={{
						rotate: -360,
						scale: [1, 1.2, 1],
					}}
					transition={{
						rotate: {
							duration: 2.5,
							repeat: Infinity,
							ease: "linear",
						},
						scale: {
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 0.2,
						},
					}}
				/>

				{/* Logo */}
				<motion.div
					className="absolute inset-0 flex items-center justify-center"
					animate={{
						opacity: [1, 0.5, 1],
					}}
					transition={{
						duration: 1.5,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					<span className="text-white text-2xl font-bold tracking-wider">
						ZAM
					</span>
				</motion.div>
			</div>
		</div>
	);
};

export default Loader;
