import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout/Layout";
import Preloader from "./components/Preloader";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Hair from "./pages/Hair";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import Works from "./pages/Works";

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
		<HelmetProvider>
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
								<Route path="/hair-bookings" element={<Hair />} />
							</Routes>
						</Layout>
					)}
				</ErrorBoundary>
			</BrowserRouter>
		</HelmetProvider>
	);
}

export default App;
