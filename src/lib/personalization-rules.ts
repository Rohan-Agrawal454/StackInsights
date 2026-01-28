/**
 * Personalization Library
 * Tracks user behavior and syncs attributes with Contentstack Personalize
 */

import { setUserAttributes } from './contentstack';
import type { Post, PostCategory } from '@/types';

export interface UserBehaviorData {
  userId: string;
  team: string;
  readCount: number;
  categoryViews: Record<PostCategory, number>;
  lastActive: number;
  totalTimeSpent: number; // in seconds
  engineeringTeamPostsViewed: number; // Count of posts from Product/Infrastructure/Launch teams
}

export interface UserAttributesData {
  team: string;
  reading_frequency: 'daily' | 'weekly' | 'occasional';
  expertise_level: 'beginner' | 'intermediate' | 'expert';
  favorite_category: PostCategory | '';
  read_count: number;
  total_time_spent: number;
  is_engineering_team_reader: boolean;
}

const STORAGE_KEY_PREFIX = 'user_behavior_';
const ROHAN_USER_ID = '1'; // Only Rohan's behavior is tracked

/**
 * Clean up behavior data for all users except Rohan
 * Call this once when the app initializes
 */
export const cleanupOtherUsersBehavior = () => {
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEY_PREFIX)) {
      const userId = key.replace(STORAGE_KEY_PREFIX, '');
      if (userId !== ROHAN_USER_ID) {
        localStorage.removeItem(key);
      }
    }
  });
};

/**
 * Get user behavior data from localStorage
 * Only returns data for Rohan (user ID '1')
 */
export const getUserBehavior = (userId: string): UserBehaviorData => {
  // Only track behavior for Rohan
  if (userId !== ROHAN_USER_ID) {
    // Return empty behavior for other users (not saved to localStorage)
    return {
      userId,
      team: '',
      readCount: 0,
      categoryViews: {
        'Insight': 0,
        'Incident': 0,
        'Retrospective': 0,
      },
      lastActive: Date.now(),
      totalTimeSpent: 0,
      engineeringTeamPostsViewed: 0,
    };
  }
  
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default behavior data for Rohan
  return {
    userId,
    team: '',
    readCount: 0,
    categoryViews: {
      'Insight': 0,
      'Incident': 0,
      'Retrospective': 0,
    },
    lastActive: Date.now(),
    totalTimeSpent: 0,
    engineeringTeamPostsViewed: 0,
  };
};

/**
 * Save user behavior data to localStorage
 * Only saves data for Rohan (user ID '1')
 */
const saveBehavior = (data: UserBehaviorData) => {
  // Only save behavior for Rohan
  if (data.userId !== ROHAN_USER_ID) {
    return; // Don't save to localStorage for other users
  }
  
  const key = `${STORAGE_KEY_PREFIX}${data.userId}`;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Calculate reading frequency based on behavior
 */
const calculateReadingFrequency = (behavior: UserBehaviorData): 'daily' | 'weekly' | 'occasional' => {
  const daysSinceLastActive = (Date.now() - behavior.lastActive) / (1000 * 60 * 60 * 24);
  
  if (behavior.readCount >= 2 && daysSinceLastActive < 1) {
    return 'daily';
  } else if (behavior.readCount >= 10 && daysSinceLastActive < 7) {
    return 'weekly';
  }
  return 'occasional';
};

/**
 * Calculate expertise level based on behavior
 */
const calculateExpertiseLevel = (behavior: UserBehaviorData): 'beginner' | 'intermediate' | 'expert' => {
  if (behavior.readCount >= 10) {
    return 'expert';
  } else if (behavior.readCount >= 3) {
    return 'intermediate';
  }
  return 'beginner';
};

/**
 * Get user's favorite category
 */
const getFavoriteCategory = (behavior: UserBehaviorData): PostCategory | '' => {
  const entries = Object.entries(behavior.categoryViews) as [PostCategory, number][];
  const sorted = entries.sort(([, a], [, b]) => b - a);
  
  // Only return favorite if they've read at least 3 posts
  if (sorted[0][1] >= 3) {
    return sorted[0][0];
  }
  return '';
};

// Track last viewed post to prevent duplicate tracking
let lastTrackedPost: { postId: string; timestamp: number } | null = null;

/**
 * Track when a user views a post
 * Updates behavior data and syncs with Contentstack
 * Only tracks behavior for Rohan (user ID '1')
 */
export const trackPostView = (userId: string, post: Post, userTeam: string) => {
  // Only track behavior for Rohan
  if (userId !== ROHAN_USER_ID) {
    return;
  }
  
  // Prevent duplicate tracking (if same post tracked within 2 seconds)
  const now = Date.now();
  if (lastTrackedPost?.postId === post.id && now - lastTrackedPost.timestamp < 2000) {
    return;
  }
  
  lastTrackedPost = { postId: post.id, timestamp: now };
  
  const behavior = getUserBehavior(userId);
  
  // Update behavior metrics
  behavior.readCount += 1;
  behavior.categoryViews[post.category] = (behavior.categoryViews[post.category] || 0) + 1;
  behavior.lastActive = now;
  
  // Keep team fixed from user profile, don't change based on posts
  if (!behavior.team && userTeam) {
    behavior.team = userTeam;
  }
  
  // Save locally
  saveBehavior(behavior);
  
  // Calculate derived attributes
  const attributes = {
    team: behavior.team,
    reading_frequency: calculateReadingFrequency(behavior),
    expertise_level: calculateExpertiseLevel(behavior),
    favorite_category: getFavoriteCategory(behavior),
  };
  
  // Sync to Contentstack Personalize
  setUserAttributes(userId, attributes);
  
  console.log('📊 User behavior updated:', { userId, readCount: behavior.readCount, attributes });
};

/**
 * Track time spent on a post
 */
export const trackTimeSpent = (userId: string, seconds: number) => {
  const behavior = getUserBehavior(userId);
  behavior.totalTimeSpent += seconds;
  behavior.lastActive = Date.now();
  saveBehavior(behavior);
};

/**
 * Initialize user attributes on app load
 * Call this when the app starts or when user switches profiles
 * Only initializes for Rohan (user ID '1')
 */
export const initializeUserAttributes = (userId: string, team: string) => {
  // Only initialize attributes for Rohan
  if (userId !== ROHAN_USER_ID) {
    return {
      team: team,
      reading_frequency: 'occasional' as const,
      expertise_level: 'beginner' as const,
      favorite_category: '' as const,
    };
  }
  
  const behavior = getUserBehavior(userId);
  
  // Set team if not already set
  if (!behavior.team && team) {
    behavior.team = team;
    saveBehavior(behavior);
  }
  
  // Calculate and sync attributes
  const attributes = {
    team: behavior.team || team,
    reading_frequency: calculateReadingFrequency(behavior),
    expertise_level: calculateExpertiseLevel(behavior),
    favorite_category: getFavoriteCategory(behavior),
  };
  
  setUserAttributes(userId, attributes);
  
  return attributes;
};

/**
 * Get user's current personalization attributes
 */
export const getUserAttributes = (userId: string): UserAttributesData => {
  const behavior = getUserBehavior(userId);
  
  // Check if user is an "engineering team reader"
  const isEngineeringTeamReader = behavior.readCount > 0 && behavior.engineeringTeamPostsViewed >= 3 && 
    (behavior.engineeringTeamPostsViewed / behavior.readCount) > 0.5;
  
  return {
    team: behavior.team,
    reading_frequency: calculateReadingFrequency(behavior),
    expertise_level: calculateExpertiseLevel(behavior),
    favorite_category: getFavoriteCategory(behavior),
    read_count: behavior.readCount,
    total_time_spent: behavior.totalTimeSpent,
    is_engineering_team_reader: isEngineeringTeamReader,
  };
};

/**
 * Reset user behavior (for testing or profile switching)
 */
export const resetUserBehavior = (userId: string) => {
  // Only reset behavior for Rohan
  if (userId !== ROHAN_USER_ID) {
    return;
  }
  
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  localStorage.removeItem(key);
  console.log('🔄 User behavior reset for:', userId);
};
