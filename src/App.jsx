import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Works from "./pages/Works";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProjectDetail from "./pages/ProjectDetail";
import Preloader from "./components/Preloader";

function App() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate loading time (you can adjust this based on your needs)
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<BrowserRouter>
			<ErrorBoundary>
				<Preloader isLoading={isLoading} />
				{!isLoading && (
					<Layout>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/works" element={<Works />} />
							<Route path="/works/:id" element={<ProjectDetail />} />
							<Route path="/about" element={<About />} />
							<Route path="/contact" element={<Contact />} />
						</Routes>
					</Layout>
				)}
			</ErrorBoundary>
		</BrowserRouter>
	);
}

export default App;
