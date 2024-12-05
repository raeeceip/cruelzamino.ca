import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-black flex items-center justify-center">
					<div className="text-center p-8">
						<h1 className="text-4xl font-bold text-[#FF1493] mb-4">Oops!</h1>
						<p className="text-white mb-8">
							Something went wrong loading this section.
						</p>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-3 bg-[#FDDA0D] text-black rounded-lg hover:bg-opacity-90 transition-colors"
						>
							Refresh Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
