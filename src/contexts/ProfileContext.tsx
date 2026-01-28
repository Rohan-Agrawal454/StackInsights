import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { Author } from '@/types';
import { getAllAuthors } from '@/lib/contentstack-api';
import { initializeUserAttributes, cleanupOtherUsersBehavior } from '@/lib/personalization-rules';

// Context type and creation
export interface ProfileContextType {
  currentProfile: Author;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Rohan's profile from Contentstack on mount
  useEffect(() => {
    // Clean up any old behavior data from other users
    cleanupOtherUsersBehavior();
    
    getAllAuthors().then((fetchedAuthors) => {
      const rohanProfile = fetchedAuthors.find(a => a.id === '1') || fetchedAuthors[0];
      
      setCurrentProfile(rohanProfile);
      
      // Initialize personalization for Rohan
      if (rohanProfile) {
        initializeUserAttributes(rohanProfile.id, rohanProfile.team);
      }
      
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !currentProfile) {
    return null;
  }

  return (
    <ProfileContext.Provider value={{ currentProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
