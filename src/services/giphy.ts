const GIPHY_API_KEY = 'efxIXZk8hBcXsDtZomqJGDi2MQJHyOWW';
const GIPHY_BASE_URL = 'https://api.giphy.com/v1';

export interface GiphyGif {
  id: string;
  url: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
      width: string;
      height: string;
    };
    fixed_width: {
      url: string;
      width: string;
      height: string;
    };
    original: {
      url: string;
      width: string;
      height: string;
    };
  };
}

export interface GiphyResponse {
  data: GiphyGif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

// Search GIFs
export const searchGifs = async (query: string, limit: number = 20, offset: number = 0): Promise<GiphyResponse> => {
  try {
    const response = await fetch(
      `${GIPHY_BASE_URL}/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch GIFs');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching GIFs:', error);
    throw error;
  }
};

// Get trending GIFs
export const getTrendingGifs = async (limit: number = 20, offset: number = 0): Promise<GiphyResponse> => {
  try {
    const response = await fetch(
      `${GIPHY_BASE_URL}/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending GIFs');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trending GIFs:', error);
    throw error;
  }
};

// Get random GIF
export const getRandomGif = async (tag?: string): Promise<{ data: GiphyGif }> => {
  try {
    const url = tag 
      ? `${GIPHY_BASE_URL}/gifs/random?api_key=${GIPHY_API_KEY}&tag=${encodeURIComponent(tag)}`
      : `${GIPHY_BASE_URL}/gifs/random?api_key=${GIPHY_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch random GIF');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching random GIF:', error);
    throw error;
  }
};

// Popular search terms for suggestions
export const popularGifTerms = [
  'happy', 'love', 'funny', 'cute', 'excited',
  'sad', 'angry', 'surprised', 'dance', 'party',
  'food', 'cat', 'dog', 'reaction', 'hello',
  'goodbye', 'yes', 'no', 'think', 'confused'
];

// Arabic translations for popular terms
export const arabicGifTerms = [
  'سعيد', 'حب', 'مضحك', 'لطيف', 'متحمس',
  'حزين', 'غاضب', 'مندهش', 'رقص', 'حفلة',
  'طعام', 'قطة', 'كلب', 'ردة فعل', 'مرحبا',
  'وداعا', 'نعم', 'لا', 'تفكير', 'محتار'
];
