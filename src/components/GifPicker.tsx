import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { X, Search, TrendingUp } from 'lucide-react';
import { searchGifs, getTrendingGifs, GiphyGif, popularGifTerms, arabicGifTerms } from '../services/giphy';

interface GifPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGif: (gif: GiphyGif) => void;
}

export function GifPicker({ isOpen, onClose, onSelectGif }: GifPickerProps) {
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load trending GIFs on mount
  useEffect(() => {
    if (isOpen && gifs.length === 0) {
      loadTrendingGifs();
    }
  }, [isOpen]);

  const loadTrendingGifs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getTrendingGifs(20);
      setGifs(response.data);
    } catch (error) {
      setError('فشل في تحميل الصور المتحركة');
      console.error('Error loading trending GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadTrendingGifs();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await searchGifs(query, 20);
      setGifs(response.data);
    } catch (error) {
      setError('فشل في البحث عن الصور المتحركة');
      console.error('Error searching GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md max-h-[80vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>اختر صورة متحركة</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن صورة متحركة..."
            className="bg-gray-800 border-gray-600 text-white"
            dir="rtl"
          />
          <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
            <Search className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Search Terms */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadTrendingGifs}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <TrendingUp className="w-3 h-3 ml-1" />
            الرائج
          </Button>
          {arabicGifTerms.slice(0, 4).map((term, index) => (
            <Button
              key={term}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch(popularGifTerms[index])}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {term}
            </Button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-sm text-center py-2">
            {error}
          </div>
        )}

        {/* GIFs Grid */}
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : gifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <TrendingUp className="w-12 h-12 mb-2" />
              <p>لم يتم العثور على صور متحركة</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-2">
              {gifs.map((gif) => (
                <div
                  key={gif.id}
                  className="relative cursor-pointer rounded-lg overflow-hidden hover:scale-105 transition-transform"
                  onClick={() => onSelectGif(gif)}
                >
                  <img
                    src={gif.images.fixed_height.url}
                    alt={gif.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          مدعوم بواسطة GIPHY
        </div>
      </DialogContent>
    </Dialog>
  );
}