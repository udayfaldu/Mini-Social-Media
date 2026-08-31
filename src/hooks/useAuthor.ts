import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from './useAuth';

const userCache = new Map<number, string>();

export function useAuthor(userId: number) {
  const { user: currentUser } = useAuth();
  const isOwnPost = Boolean(currentUser && currentUser.id === userId);

  const [authorName, setAuthorName] = useState<string>(() => {
    if (isOwnPost && currentUser) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (userCache.has(userId)) {
      return userCache.get(userId) || `User #${userId}`;
    }
    return `User #${userId}`;
  });

  useEffect(() => {
    if (isOwnPost && currentUser) {
      const name = `${currentUser.firstName} ${currentUser.lastName}`;
      userCache.set(userId, name);
      setAuthorName(name);
      return;
    }

    if (userCache.has(userId)) {
      setAuthorName(userCache.get(userId) || `User #${userId}`);
      return;
    }

    let isCancelled = false;

    userService
      .getUserById(userId)
      .then((user) => {
        if (!isCancelled && user) {
          const name = `${user.firstName} ${user.lastName}`;
          userCache.set(userId, name);
          setAuthorName(name);
        }
      })
      .catch(() => {
        // Keep fallback
      });

    return () => {
      isCancelled = true;
    };
  }, [userId, isOwnPost, currentUser]);

  return {
    authorName,
    isOwnPost,
  };
}
