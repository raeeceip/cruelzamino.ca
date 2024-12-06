import React from "react";
import { Helmet } from "react-helmet-async";

const MetaTags = ({
	title = "Zam Onwa | Digital Art Portfolio",
	description = "Explore the digital art collection of Zam Onwa, featuring works at the intersection of Nigerian heritage and contemporary digital art. Experience a unique blend of cultural storytelling and modern artistic expression.",
	image = "/assets/artwork/apostasy.jpg",
	pathname,
}) => {
	const siteUrl = "https://zamonwa.com";
	const fullUrl = `${siteUrl}${pathname}`;

	return (
		<Helmet>
			{/* Basic Meta Tags */}
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#000000" />
			<link rel="canonical" href={fullUrl} />

			{/* Favicon */}
			<link rel="icon" href="/favicon.ico" />
			<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
			<link rel="manifest" href="/manifest.json" />

			{/* OpenGraph Meta Tags */}
			<meta property="og:site_name" content="Zam Onwa Art" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={`${siteUrl}${image}`} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:url" content={fullUrl} />
			<meta property="og:type" content="website" />

			{/* Twitter Meta Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:creator" content="@zamonwa" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={`${siteUrl}${image}`} />

			{/* Additional SEO Tags */}
			<meta name="author" content="Zam Onwa" />
			<meta
				name="keywords"
				content="digital art, Nigerian art, contemporary art, Zam Onwa, art portfolio, digital artist, African art"
			/>
			<meta name="robots" content="index, follow" />
		</Helmet>
	);
};

export default MetaTags;
