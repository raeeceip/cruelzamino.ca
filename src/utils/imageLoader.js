// Create a map of preloaded images
const imageCache = new Map();

export const preloadImage = (src) => {
  if (!imageCache.has(src)) {
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
    imageCache.set(src, promise);
  }
  return imageCache.get(src);
};

export const preloadImages = (images) => {
  return Promise.all(images.map(preloadImage));
};

// Function to generate placeholder gradients for loading states
export const generatePlaceholderGradient = (index) => {
  const hue = (index * 137.508) % 360;
  return `linear-gradient(135deg, 
    hsl(${hue}, 70%, 20%) 0%, 
    hsl(${(hue + 60) % 360}, 70%, 30%) 100%
  )`;
};