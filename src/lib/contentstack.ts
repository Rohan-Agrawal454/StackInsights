import Contentstack from '@contentstack/delivery-sdk';

const Stack = Contentstack.stack({
  apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY,
  deliveryToken: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN,
  environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT,
  region: import.meta.env.VITE_CONTENTSTACK_REGION,
  live_preview: {
    enable: false,
  },
});

/**
 * User attributes for Contentstack Personalize
 */
export interface PersonalizationAttributes {
  team: string;
  reading_frequency: 'daily' | 'weekly' | 'occasional';
  expertise_level: 'beginner' | 'intermediate' | 'expert';
  favourite_category: string;
}

/**
 * Internal storage with userId
 */
interface UserAttributesWithId extends PersonalizationAttributes {
  userId: string;
}

/**
 * Store for current user attributes (used for personalization)
 * These attributes match what you set up in Contentstack Personalize
 */
let currentUserAttributes: UserAttributesWithId | Record<string, never> = {};

/**
 * Set user attributes for personalization
 * These will be used when fetching personalized content from Contentstack
 */
export const setUserAttributes = (userId: string, attributes: Partial<PersonalizationAttributes>) => {
  currentUserAttributes = {
    userId,
    team: attributes.team || '',
    reading_frequency: attributes.reading_frequency || 'occasional',
    expertise_level: attributes.expertise_level || 'beginner',
    favourite_category: attributes.favourite_category || '',
  };
  
  // Store in sessionStorage for persistence across page reloads
  sessionStorage.setItem('personalization_attributes', JSON.stringify(currentUserAttributes));
  
  console.log('✨ Personalization attributes set:', currentUserAttributes);
};

/**
 * Get current user attributes
 */
export const getUserAttributesFromSession = () => {
  if (Object.keys(currentUserAttributes).length === 0) {
    const stored = sessionStorage.getItem('personalization_attributes');
    if (stored) {
      currentUserAttributes = JSON.parse(stored);
    }
  }
  return currentUserAttributes;
};

/**
 * Clear user attributes (for logout or profile switch)
 */
export const clearUserAttributes = () => {
  currentUserAttributes = {};
  sessionStorage.removeItem('personalization_attributes');
};

/**
 * Fetch content with personalization
 * When Contentstack Personalize is fully configured, you can pass user attributes here
 * For now, attributes are tracked locally and can be used for client-side filtering
 */
export const fetchPersonalizedContent = async (contentType: string, uid: string) => {
  // const attrs = getUserAttributesFromSession();
  // TODO: When Personalize API is enabled, pass attrs as query params
  
  const entry = await Stack.contentType(contentType).entry(uid).fetch();
  return entry;
};

export default Stack;
