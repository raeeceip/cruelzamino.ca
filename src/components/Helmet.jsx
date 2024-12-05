import React from "react";
import { Helmet } from "react-helmet-async";

const MetaTags = ({
	title = "Zam Onwa | Digital Art Portfolio",
	description = "Explore the digital art portfolio of Zam Onwa, featuring works that blend Nigerian heritage with contemporary digital art.",
	image = "/og-image.jpg", // Add a default OG image
	pathname,
}) => {
	const siteUrl = "https://zamartportfolio.com"; // Replace with your domain

	return (
		<Helmet>
			{/* Basic Meta Tags */}
			<title>{title}</title>
			<meta name="description" content={description} />

			{/* OpenGraph Meta Tags */}
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={`${siteUrl}${image}`} />
			<meta property="og:url" content={`${siteUrl}${pathname}`} />
			<meta property="og:type" content="website" />

			{/* Twitter Meta Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={`${siteUrl}${image}`} />

			{/* Additional Meta Tags */}
			<meta name="theme-color" content="#000000" />
			<link rel="canonical" href={`${siteUrl}${pathname}`} />
		</Helmet>
	);
};

export default MetaTags;
