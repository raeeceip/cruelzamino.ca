import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useSEO = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined') {
      // You can add analytics here if needed
      console.log(`Page view: ${location.pathname}`);
    }

    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Zam Onwa Digital Art Portfolio",
      "url": "https://zamonwa.ca",
      "potentialAction": {
        "@type": "ViewAction",
        "target": `https://zamonwa.ca${location.pathname}`
      }
    };

    // Add structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [location]);

  // Add social meta tags
  useEffect(() => {
    const socialMeta = [
      { property: 'og:site_name', content: 'Zam Onwa' },
      { name: 'twitter:creator', content: '@zamonwa' },
      { name: 'twitter:site', content: '@zamonwa' },
      { name: 'application-name', content: 'Zam Onwa Portfolio' },
      { name: 'apple-mobile-web-app-title', content: 'Zam Onwa' }
    ];

    socialMeta.forEach(({ property, name, content }) => {
      const meta = document.createElement('meta');
      if (property) meta.setAttribute('property', property);
      if (name) meta.setAttribute('name', name);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    });

    return () => {
      socialMeta.forEach(({ property, name }) => {
        const selector = property ? 
          `meta[property="${property}"]` : 
          `meta[name="${name}"]`;
        const meta = document.querySelector(selector);
        if (meta) document.head.removeChild(meta);
      });
    };
  }, []);
};