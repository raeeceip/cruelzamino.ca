import React from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-base-black text-base-white py-20">
			<div className="container mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* Brand */}
					<div>
						<h2 className="text-3xl font-heading mb-4">
							ZAM<span className="text-brand-yellow">.</span>
						</h2>
						<p className="text-gray-400">
							Exploring identity, spirituality, and the Nigerian diaspora
							through art.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-xl font-heading mb-4">Quick Links</h3>
						<ul className="space-y-2">
							{["Works", "About", "Contact"].map((item) => (
								<li key={item}>
									<motion.a
										href={`/${item.toLowerCase()}`}
										className="text-gray-400 hover:text-brand-pink transition-colors"
										whileHover={{ x: 4 }}
									>
										{item}
									</motion.a>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-xl font-heading mb-4">Contact</h3>
						<ul className="space-y-2 text-gray-400">
							<li>Ottawa, Ontario</li>
							<li>Lagos, Nigeria</li>
							<li>(613) 869-9674</li>
							<li>zamonwa@gmail.com</li>
						</ul>
					</div>

					{/* Social */}
					<div>
						<h3 className="text-xl font-heading mb-4">Follow</h3>
						<div className="flex gap-4">
							{[
								{ icon: Instagram, link: "#" },
								{ icon: Twitter, link: "#" },
								{ icon: Mail, link: "mailto:zamonwa@gmail.com" },
							].map((social, index) => (
								<motion.a
									key={index}
									href={social.link}
									className="w-10 h-10 rounded-full bg-white bg-opacity-5 flex items-center justify-center hover:bg-brand-pink transition-colors"
									whileHover={{ y: -2 }}
								>
									<social.icon size={20} />
								</motion.a>
							))}
						</div>
					</div>
				</div>

				<div className="border-t border-white border-opacity-10 mt-16 pt-8 text-center text-gray-400">
					<p>© {currentYear} Zam Eze-Onwa. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
