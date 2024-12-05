import Navigation from "./Nav";
import Footer from "./Footer";

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen bg-base-black">
			<Navigation />
			<main>{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
