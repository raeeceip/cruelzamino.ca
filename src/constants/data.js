// Base URL for assets
// Use /src/assets for development to correctly find images in the src directory
const ASSET_BASE_URL = '/src/assets';

export const ARTWORKS = [
    {
      id: 'apostasy',
      title: 'Apostasy',
      artist: 'Zam Eze-Onwa',
      year: '2023',
      collection: 'The Pilgrimage of the Self',
      description: 'A whispered choice, a silent rupture from the faith\'s embrace. Like a falling star, it blazes a trail across the midnight canvas of belief, leaving behind a constellation of questions in its wake.',
      technique: 'Digital Mixed Media',
      dimensions: { width: 2, height: 2 },
      medium: 'Digital Art',
      category: 'The Pilgrimage of the Self',
      image: `${ASSET_BASE_URL}/images/artwork/apostasy.jpg`,
      position: [-6, 1.5, -5]
    },
    {
      id: 'for-your-mind',
      title: 'For Your Mind',
      artist: 'Zam Eze-Onwa',
      year: '2024',
      collection: 'The Pilgrimage of the Self',
      description: 'Visualizing the complex landscape of consciousness and identity through abstract portraiture.',
      technique: 'Digital Mixed Media',
      dimensions: { width: 2, height: 2 },
      medium: 'Digital Art',
      category: 'The Pilgrimage of the Self',
      image: `${ASSET_BASE_URL}/images/artwork/for-your-mind.jpg`,
      position: [0, 1.5, -5]
    },
    {
      id: 'gemini-flame',
      title: 'Gemini Flame, Twin Fire',
      artist: 'Zam Eze-Onwa',
      year: '2022',
      collection: 'The Creed of a True Fraud',
      description: 'A vibrant exploration of duality and self-reflection, rendered in warm tones and dynamic forms.',
      technique: 'Digital Mixed Media',
      dimensions: { width: 2, height: 2 },
      medium: 'Digital Art',
      category: 'The Creed of a True Fraud',
      image: `${ASSET_BASE_URL}/images/artwork/gemini-flame.jpg`,
      position: [6, 1.5, -5]
    },
    {
      id: 'purple-man',
      title: 'The Purple Man Sees Yellow',
      artist: 'Zam Eze-Onwa',
      year: '2024',
      collection: 'The Creed of a True Fraud',
      description: 'An introspective piece exploring perception and truth through contrasting colors and bold shapes.',
      technique: 'Digital Mixed Media',
      dimensions: { width: 2, height: 2 },
      medium: 'Digital Art',
      category: 'The Creed of a True Fraud',
      image: `${ASSET_BASE_URL}/images/artwork/purple-man.jpg`,
      position: [-6, 1.5, 2]
    },
    {
      id: 'infinit-ey',
      title: 'Infinit(e/y)',
      artist: 'Zam Eze-Onwa',
      year: '2023',
      collection: 'The Pilgrimage of the Self',
      description: 'A psychedelic journey through identity and transformation, featuring bold colors and layered symbolism.',
      technique: 'Digital Mixed Media',
      dimensions: { width: 2, height: 2 },
      medium: 'Digital Art',
      category: 'The Pilgrimage of the Self',
      image: `${ASSET_BASE_URL}/images/artwork/infinit-ey.jpg`,
      position: [0, 1.5, 2]
    }
];

export const COLLECTIONS = [
    {
      id: 'creed',
      title: 'The Creed of a True Fraud',
      year: '2022',
      description: 'This collection follows the different emotions Zam faces in their experience of being a queer Nigerian artist in the diaspora that lives with anxiety. These pieces follow the emotions of skepticism, anger, jealousy and sadness that Zam faces with regards to their identity.',
      coverImage: `${ASSET_BASE_URL}/images/collections/creed-cover.jpg`
    },
    {
      id: 'pilgrimage',
      title: 'The Pilgrimage of the Self',
      year: '2023',
      description: 'Through five pieces - "For Your Mind," "Apostasy," "Infinit(e/y)," "A Fall From Grace," and "The Odyssey" - the collection chronicles the stages of religious exodus and personal rebirth.',
      coverImage: `${ASSET_BASE_URL}/images/collections/pilgrimage-cover.jpg`
    },
    {
      id: 'wahala',
      title: 'Wahala Dey',
      year: '2024',
      description: 'A work in progress collection of stories exploring the layered stories, struggles, and spirit of Nigeria and its people.',
      coverImage: `${ASSET_BASE_URL}/images/collections/wahala-cover.jpg`
    }
];

// Rest of the exports remain the same
export const ARTIST_INFO = {
    name: 'Zam Eze-Onwa',
    title: 'Creative',
    location: {
      current: 'Ottawa, Ontario',
      origin: 'Lagos, Nigeria'
    },
    bio: 'Zam Onwa is a queer non binary interdisciplinary artist who heavily draws influence from their personal experiences and emotions for their art. Born and raised in Nigeria, they moved to Canada in 2021 to further their education and continue their practice.',
    contact: {
      email: 'zamonwa@gmail.com',
      phone: '(613) 869-9674'
    },
    social: {
      instagram: 'https://www.instagram.com/cruelzamino',
      twitter: '#'
    }
};

export const NAVIGATION_LINKS = [
    { name: 'Works', path: '/works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
];

export const SOCIAL_LINKS = [
    { name: 'Instagram', url: '#' },
    { name: 'Twitter', url: '#' },
    { name: 'Email', url: 'mailto:zamonwa@gmail.com' }
];