import { motion } from "framer-motion";
import ImageComponent from "../components/ui/Image";

const About = () => {
	return (
		<div className="min-h-screen pt-20">
			<div className="container mx-auto px-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="text-4xl md:text-6xl font-heading mb-6">
							Above everything,
							<span className="block text-brand-yellow">I am a creative.</span>
						</h1>
						<div className="space-y-6 text-gray-300">
							<p>
								Zam Onwa is a queer non binary interdisciplinary artist who
								heavily draws influence from their personal experiences and
								emotions for their art. Born and raised in Nigeria, they moved
								to Canada in 2021 to further their education and continue their
								practice.
							</p>
							<p>
								They get inspiration for their art from the beautiful yet
								painful experience of leaving home and really getting to know
								one's undiluted self. Zam has explored many different styles
								over the years including but not limited to realism through
								pointillism and stamp art on digital platforms as well as
								canvas.
							</p>
							<blockquote className="border-l-4 border-brand-pink pl-6 my-8 italic">
								"I have been painting for 3 years but I've been creating as long
								as I can remember. My preferred medium is acrylic. 'Blessed are
								the works of my hands,' I believe this sums up my experience of
								life."
							</blockquote>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="relative"
					>
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
					</motion.div>
				</div>

				{/* Community Work */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className="mt-24"
				>
					<h2 className="text-3xl font-heading mb-8">Community Work</h2>
					<div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-white/10">
						<p className="text-gray-300">
							As President of the Black Student Alliance at Carleton University,
							I am deeply committed to fostering inclusive spaces and amplifying
							marginalized voices. My work includes serving as a peer support
							volunteer with the RISE Service Centre, VP of Community Outreach
							for CU's Black Student Alliance, and FASS Councillor for the
							Carleton University Student Association, where I promote
							equity-focused policies.
						</p>
						<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
							{[
								"Snatched Black Hair Panel (2023)",
								"Black Brilliance Panel (2024)",
								"Gender and Intersectionality Panel (2023)",
							].map((panel) => (
								<div
									key={panel}
									className="bg-black/50 p-6 rounded-lg border border-brand-pink/20"
								>
									<h3 className="text-xl text-white mb-2">{panel}</h3>
								</div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default About;
