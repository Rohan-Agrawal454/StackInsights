import { useState, useEffect, type ReactNode } from 'react';
import type { Author } from '@/types';
import { getAllAuthors } from '@/lib/contentstack-api';
import { ProfileContext } from './profile-context';
import { initializeUserAttributes, cleanupOtherUsersBehavior } from '@/lib/personalization-rules';

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentProfile, setCurrentProfileState] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch authors from Contentstack on mount
  useEffect(() => {
    cleanupOtherUsersBehavior();
    
    getAllAuthors().then((fetchedAuthors) => {
      setAuthors(fetchedAuthors);
      
      // Always default to Rohan (author_id: 1)
      const rohanProfile = fetchedAuthors.find(a => a.id === '1') || fetchedAuthors[0];
      
      setCurrentProfileState(rohanProfile);
      
      // Initialize personalization for Rohan
      if (rohanProfile) {
        initializeUserAttributes(rohanProfile.id, rohanProfile.team);
      }
      
      setIsLoading(false);
    });
  }, []);

  // Disabled profile switching - Rohan is the only user
  const setCurrentProfile = () => {
    // Profile switching is disabled
    console.warn('Profile switching is disabled. Rohan is the default user.');
  };

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
