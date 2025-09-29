import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState, useEffect } from 'react';
import { getActiveStories } from '../firebase/database';
import { getUserProfile } from '../firebase/auth'; // Assuming this can get any user's profile

interface Story {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  stories: any[]; // Simplified for now
  isViewed?: boolean;
}

interface StoriesProps {
  currentUser: any; // Simplified current user object
  onStoryClick: (story: Story) => void;
  onAddStory: () => void;
}

export function Stories({ currentUser, onStoryClick, onAddStory }: StoriesProps) {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const activeStoriesData = await getActiveStories();
        // We need to fetch user profiles for each story to get displayName and avatar
        const storiesWithUserProfiles = await Promise.all(
          activeStoriesData.map(async (storyData) => {
            const userProfile = await getUserProfile(storyData.userId);
            return {
              ...storyData,
              username: userProfile?.username || 'Unknown',
              displayName: userProfile?.displayName || 'Unknown User',
              avatar: userProfile?.avatar || '/api/placeholder/64/64',
            };
          })
        );
        setStories(storiesWithUserProfiles);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      }
    };

    fetchStories();
  }, []);

  const getStoryRingColor = (story: Story) => {
    // Simplified logic, needs implementation of viewed stories
    if (story.isViewed) return 'ring-gray-500';
    if (story.isViewed) return 'ring-gray-500';
    return 'ring-gradient-to-r from-green-500 to-black';
  };

  return (
    <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide bg-gray-900/50">
      {/* Your Story */}
      <div className="flex flex-col items-center gap-2 min-w-[70px]">
        <div className="relative">
          <Avatar className="w-16 h-16 ring-2 ring-green-500">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-gray-700 text-white">
              {currentUser?.displayName?.charAt(0) || 'Y'}
            </AvatarFallback>
          </Avatar>
          <div 
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900 cursor-pointer hover:bg-green-600 transition-colors"
            onClick={onAddStory}
          >
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
        <span className="text-xs text-gray-300 text-center">Your Story</span>
      </div>

      {/* Other Stories */}
      {stories.map((story) => (
        <div 
          key={story.userId} 
          className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
          onClick={() => onStoryClick(story)}
        >
          <div className="relative">
            <Avatar className={`w-16 h-16 ring-2 ${getStoryRingColor(story)}`}>
              <AvatarImage src={story.avatar} />
              <AvatarFallback className="bg-gray-700 text-white">
                {story.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="text-xs text-gray-300 text-center truncate w-full">
            {story.displayName}
          </span>
        </div>
      ))}
    </div>
  );
}
