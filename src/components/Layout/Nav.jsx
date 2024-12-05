import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();

	const navItems = [
		{ path: "/works", label: "Works" },
		{ path: "/about", label: "About" },
		{ path: "/contact", label: "Contact" },
	];

	return (
		<nav className="fixed w-full z-50 top-0 bg-base-black/90 backdrop-blur-sm border-b border-base-white/10">
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link to="/" className="z-50">
						<motion.div
							whileHover={{ scale: 1.05 }}
							className="text-2xl font-bold text-base-white"
						>
							ZAM
							<span className="text-brand-yellow">.</span>
						</motion.div>
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex space-x-8">
						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								className={`relative text-sm font-medium transition-colors ${
									location.pathname === item.path
										? "text-brand-pink"
										: "text-base-white hover:text-brand-yellow"
								}`}
							>
								{item.label}
								{location.pathname === item.path && (
									<motion.div
										layoutId="underline"
										className="absolute left-0 top-full h-[2px] w-full bg-brand-pink"
									/>
								)}
							</Link>
						))}
					</div>

					{/* Mobile Menu Button */}
					<motion.button
						whileTap={{ scale: 0.95 }}
						onClick={() => setIsOpen(!isOpen)}
						className="md:hidden text-base-white z-50"
					>
						{isOpen ? <X size={24} /> : <Menu size={24} />}
					</motion.button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "100vh" }}
						exit={{ opacity: 0, height: 0 }}
						className="fixed inset-0 bg-base-black md:hidden pt-20"
					>
						<div className="flex flex-col items-center gap-8 p-8">
							{navItems.map((item) => (
								<motion.div
									key={item.path}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
								>
									<Link
										to={item.path}
										onClick={() => setIsOpen(false)}
										className={`text-xl ${
											location.pathname === item.path
												? "text-brand-pink"
												: "text-base-white hover:text-brand-yellow"
										}`}
									>
										{item.label}
									</Link>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Navigation;
