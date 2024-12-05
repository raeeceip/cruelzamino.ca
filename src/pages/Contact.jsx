import { motion } from "framer-motion";
import { Mail, MapPin, Instagram, Twitter } from "lucide-react";

const Contact = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
		},
	};

	return (
		<div className="min-h-screen bg-black pt-20">
			<div className="container mx-auto px-6 py-12">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="grid md:grid-cols-2 gap-12"
				>
					{/* Contact Info */}
					<motion.div variants={itemVariants}>
						<h1 className="text-5xl font-bold mb-6">
							Get in <span className="text-[#FF1493]">Touch</span>
						</h1>
						<p className="text-gray-300 text-lg mb-12">
							Whether you're interested in commissioning a piece, purchasing
							existing artwork, or just want to discuss art, I'd love to hear
							from you.
						</p>

						<div className="space-y-8">
							<motion.div
								variants={itemVariants}
								className="flex items-center space-x-4"
							>
								<div className="w-12 h-12 bg-[#FF1493] bg-opacity-20 rounded-full flex items-center justify-center">
									<Mail className="w-6 h-6 text-[#FF1493]" />
								</div>
								<div>
									<h3 className="text-[#FDDA0D] text-sm">Email</h3>
									<p className="text-white">zamonwa@gmail.com</p>
								</div>
							</motion.div>

							<motion.div
								variants={itemVariants}
								className="flex items-center space-x-4"
							>
								<div className="w-12 h-12 bg-[#FF1493] bg-opacity-20 rounded-full flex items-center justify-center">
									<MapPin className="w-6 h-6 text-[#FF1493]" />
								</div>
								<div>
									<h3 className="text-[#FDDA0D] text-sm">Location</h3>
									<p className="text-white">Ottawa, Ontario</p>
									<p className="text-white">Lagos, Nigeria</p>
								</div>
							</motion.div>

							<motion.div
								variants={itemVariants}
								className="flex space-x-4 pt-6"
							>
								<a
									href="#"
									className="w-12 h-12 bg-[#FF1493] bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
								>
									<Instagram className="w-6 h-6 text-[#FF1493]" />
								</a>
								<a
									href="#"
									className="w-12 h-12 bg-[#FF1493] bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
								>
									<Twitter className="w-6 h-6 text-[#FF1493]" />
								</a>
							</motion.div>
						</div>
					</motion.div>

					{/* Contact Form */}
					<motion.div
						variants={itemVariants}
						className="bg-white bg-opacity-5 p-8 rounded-xl backdrop-blur-sm"
					>
						<h2 className="text-2xl font-bold mb-6 text-white">
							Send a Message
						</h2>
						<form className="space-y-6">
							<div>
								<label className="text-[#FDDA0D] text-sm">Name</label>
								<input
									type="text"
									className="w-full bg-black bg-opacity-50 border border-[#FF1493] border-opacity-30 rounded-lg px-4 py-3 mt-2 text-white focus:border-[#FF1493] focus:ring-1 focus:ring-[#FF1493] outline-none transition-all"
								/>
							</div>

							<div>
								<label className="text-[#FDDA0D] text-sm">Email</label>
								<input
									type="email"
									className="w-full bg-black bg-opacity-50 border border-[#FF1493] border-opacity-30 rounded-lg px-4 py-3 mt-2 text-white focus:border-[#FF1493] focus:ring-1 focus:ring-[#FF1493] outline-none transition-all"
								/>
							</div>

							<div>
								<label className="text-[#FDDA0D] text-sm">Message</label>
								<textarea
									rows="5"
									className="w-full bg-black bg-opacity-50 border border-[#FF1493] border-opacity-30 rounded-lg px-4 py-3 mt-2 text-white focus:border-[#FF1493] focus:ring-1 focus:ring-[#FF1493] outline-none transition-all"
								></textarea>
							</div>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full bg-[#FF1493] text-white py-4 rounded-lg hover:bg-opacity-90 transition-colors"
							>
								Send Message
							</motion.button>
						</form>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
};

export default Contact;
