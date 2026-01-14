import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authors, type Author } from '@/lib/data';

interface ProfileContextType {
  currentProfile: Author;
  setCurrentProfile: (author: Author) => void;
  allProfiles: Author[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfileState] = useState<Author>(() => {
    // Load from localStorage or default to first author
    const savedProfileId = localStorage.getItem('currentProfileId');
    return authors.find(a => a.id === savedProfileId) || authors[0];
  });

  const setCurrentProfile = (author: Author) => {
    setCurrentProfileState(author);
    localStorage.setItem('currentProfileId', author.id);
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
  }, []);

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile, allProfiles: authors }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
