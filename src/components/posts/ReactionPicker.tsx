import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export type ReactionType = 'like' | 'insight' | 'rocket' | 'funny';

interface ReactionConfig {
  id: ReactionType;
  emoji: string;
  label: string;
}

export const AVAILABLE_REACTIONS: ReactionConfig[] = [
  { id: 'like', emoji: '❤️', label: 'Love' },
  { id: 'insight', emoji: '💡', label: 'Insight' },
  { id: 'rocket', emoji: '🚀', label: 'Inspiring' },
  { id: 'funny', emoji: '😂', label: 'Funny' },
];

interface ReactionPickerProps {
  initialCount: number;
  postId: number;
  size?: 'sm' | 'md';
}

export function ReactionPicker({
  initialCount,
  postId,
  size = 'sm',
}: ReactionPickerProps) {
  const { isAuthenticated } = useAuth();
  const storageKey = `miniconnect_reaction_post_${postId}`;

  const [activeReaction, setActiveReaction] = useState<ReactionType | null>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return (stored as ReactionType) || null;
    } catch {
      return null;
    }
  });

  const [count, setCount] = useState<number>(() => {
    const isUserReacted = Boolean(localStorage.getItem(storageKey));
    return isUserReacted ? initialCount + 1 : initialCount;
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: globalThis.MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (!isAuthenticated) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isAuthenticated) return;
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const handleSelectReaction = (reaction: ReactionType, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;

    if (activeReaction === reaction) {
      setActiveReaction(null);
      setCount((prev) => Math.max(0, prev - 1));
      localStorage.removeItem(storageKey);
    } else {
      if (!activeReaction) {
        setCount((prev) => prev + 1);
      }
      setActiveReaction(reaction);
      localStorage.setItem(storageKey, reaction);
    }
    setIsOpen(false);
  };

  const handleButtonClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;
    setIsOpen((prev) => !prev);
  };

  const currentEmoji = AVAILABLE_REACTIONS.find((r) => r.id === activeReaction)?.emoji;

  if (!isAuthenticated) {
    return (
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 text-gray-400 select-none cursor-not-allowed text-xs"
        title="Sign in to react"
      >
        <Heart className={size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>{count}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isOpen && (
        <div className="absolute bottom-full left-0 pb-2 z-40">
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-full px-2.5 py-1.5 animate-in fade-in zoom-in-95 duration-100">
            {AVAILABLE_REACTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleSelectReaction(item.id, e)}
                className={`p-1 hover:scale-130 transition-transform rounded-full text-base flex items-center justify-center ${
                  activeReaction === item.id ? 'bg-blue-100 dark:bg-blue-900/60 ring-2 ring-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={item.label}
              >
                <span>{item.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleButtonClick}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition select-none ${
          activeReaction
            ? 'text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/40'
            : 'text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800'
        } ${size === 'md' ? 'text-sm' : 'text-xs'}`}
      >
        {currentEmoji ? (
          <span className="text-sm">{currentEmoji}</span>
        ) : (
          <Heart className={`${size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} transition`} />
        )}
        <span>{count}</span>
      </button>
    </div>
  );
}
