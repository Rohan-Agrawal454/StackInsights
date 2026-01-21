import { useState, useEffect, type ReactNode } from 'react';
import type { Author } from '@/types';
import { getAllAuthors } from '@/lib/contentstack-api';
import { ProfileContext } from './profile-context';
import { initializeUserAttributes } from '@/lib/personalization';

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentProfile, setCurrentProfileState] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch authors from Contentstack on mount
  useEffect(() => {
    getAllAuthors().then((fetchedAuthors) => {
      setAuthors(fetchedAuthors);
      
      // Load saved profile or default to first
      const savedProfileId = localStorage.getItem('currentProfileId');
      const defaultProfile = savedProfileId
        ? fetchedAuthors.find(a => a.id === savedProfileId)
        : fetchedAuthors[0];
      
      const profile = defaultProfile || fetchedAuthors[0];
      setCurrentProfileState(profile);
      
      // Initialize personalization for this user
      if (profile) {
        initializeUserAttributes(profile.id, profile.team);
      }
      
      setIsLoading(false);
    });
  }, []);

  const setCurrentProfile = (author: Author) => {
    setCurrentProfileState(author);
    localStorage.setItem('currentProfileId', author.id);
    
    // Re-initialize personalization for new profile
    initializeUserAttributes(author.id, author.team);
  };

  useEffect(() => {
    // Sync with localStorage changes (e.g., from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentProfileId' && e.newValue) {
        const newProfile = authors.find(a => a.id === e.newValue);
        if (newProfile) {
          setCurrentProfileState(newProfile);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [authors]);

  // Show loading state while fetching authors
  if (isLoading || !currentProfile) {
    return null;
  }

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile, allProfiles: authors }}>
      {children}
    </ProfileContext.Provider>
  );
}
