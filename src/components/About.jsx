// src/components/About.jsx
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const AboutContainer = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: #111;
	color: white;
	z-index: 1000;
	overflow-y: auto;
	padding: 60px 20px;
`;

const Content = styled(motion.div)`
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
`;

const CloseButton = styled.button`
	position: fixed;
	top: 20px;
	right: 20px;
	background: none;
	border: none;
	color: white;
	font-size: 24px;
	cursor: pointer;
	z-index: 1001;
	padding: 10px;

	&:hover {
		opacity: 0.8;
	}
`;

const Title = styled.h1`
	font-size: 3rem;
	margin-bottom: 2rem;
	font-family: "Cinzel Decorative", cursive;
`;

const Section = styled.div`
	margin-bottom: 3rem;

	h2 {
		font-size: 1.8rem;
		margin-bottom: 1rem;
		color: #888;
	}

	p {
		font-size: 1.1rem;
		line-height: 1.8;
		margin-bottom: 1rem;
		color: #ddd;
	}
`;

const ImageGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	margin: 2rem 0;
`;

const ArtistImage = styled(motion.img)`
	width: 100%;
	height: 300px;
	object-fit: cover;
	border-radius: 10px;
`;

export function About({ isOpen, onClose }) {
	return (
		<AnimatePresence>
			{isOpen && (
				<AboutContainer
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 50 }}
					transition={{ duration: 0.5 }}
				>
					<CloseButton onClick={onClose}>&times;</CloseButton>

					<Content>
						<Title>About Zam Onwa</Title>

						<Section>
							<h2>The Artist</h2>
							<p>
								Zam Onwa is a contemporary artist known for pushing the
								boundaries of traditional and digital art forms. With a unique
								perspective shaped by diverse cultural influences, Zam's work
								explores themes of identity, transformation, and the
								intersection of nature and technology.
							</p>
						</Section>

						<ImageGrid>
							<ArtistImage
								src="/studio-1.jpg"
								alt="Artist in studio"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.3 }}
							/>
							<ArtistImage
								src="/artwork-process.jpg"
								alt="Artwork in progress"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.3 }}
							/>
						</ImageGrid>

						<Section>
							<h2>Artistic Journey</h2>
							<p>
								Beginning their artistic journey in traditional mediums, Zam has
								evolved to embrace digital technologies while maintaining a deep
								connection to classical techniques. This unique combination has
								resulted in a distinctive style that bridges the gap between the
								traditional and the contemporary.
							</p>
						</Section>

						<Section>
							<h2>Vision & Philosophy</h2>
							<p>
								At the core of Zam's work is a belief in art's power to
								transform perspectives and create meaningful connections. Each
								piece is crafted to invite viewers into a dialogue about our
								shared experiences and the ways we perceive the world around us.
							</p>
						</Section>

						<Section>
							<h2>Exhibitions & Recognition</h2>
							<p>
								Zam's work has been featured in galleries worldwide and has
								received recognition for its innovative approach to artistic
								expression. Notable exhibitions include [Exhibition Names] and
								collaborations with [Notable Collaborators].
							</p>
						</Section>
					</Content>
				</AboutContainer>
			)}
		</AnimatePresence>
	);
}
