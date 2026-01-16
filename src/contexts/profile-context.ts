import { createContext } from 'react';
import type { Author } from '@/types';

export interface ProfileContextType {
  currentProfile: Author;
  setCurrentProfile: (author: Author) => void;
  allProfiles: Author[];
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
