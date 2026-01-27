import Personalize from '@contentstack/personalize-edge-sdk';
import type { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk';

interface PersonalizationAttributes {
  team: string;
  reading_frequency: 'daily' | 'weekly' | 'occasional';
  expertise_level: 'beginner' | 'intermediate' | 'expert';
  favorite_category: string;
  is_engineering_team_reader: boolean;
}

interface Experience {
  shortUid: string;
  activeVariantShortUid: string | null;
}

class PersonalizeSDKManager {
  private sdk: Sdk | null = null;
  private projectUid: string;

  constructor() {
    this.projectUid = import.meta.env.VITE_CONTENTSTACK_PERSONALIZE_PROJECT_ID || '';
  }

  /**
   * Check if Personalize is configured
   */
  isConfigured(): boolean {
    return !!this.projectUid;
  }

  /**
   * Initialize SDK (singleton pattern)
   */
  async initialize(userId: string): Promise<Sdk | null> {
    if (!this.isConfigured()) {
      console.log('ℹ️ Personalize not configured');
      return null;
    }

    if (!this.sdk) {
      console.log('🎯 Initializing Personalize SDK...');
      this.sdk = await Personalize.init(this.projectUid, {
        userId: userId,
      });
      console.log('✅ Personalize SDK initialized');
    }

    return this.sdk;
  }

  /**
   * Get fresh manifest for user with attributes
   */
  async getManifest(
    userId: string,
    attributes: PersonalizationAttributes
  ): Promise<{ experiences: Experience[]; variantAliases: string[] }> {
    // Always reset SDK to force fresh initialization and manifest fetch
    console.log('🔄 Resetting SDK for fresh manifest');
    this.sdk = null;
    
    // Initialize SDK with user ID
    const sdk = await this.initialize(userId);
    if (!sdk) {
      return { experiences: [], variantAliases: [] };
    }

    console.log('🔄 Fetching fresh manifest for', userId);
    console.log('   Attributes:', JSON.stringify(attributes, null, 2));

    // Set user attributes (triggers manifest fetch)
    await sdk.set({
      team: attributes.team,
      reading_frequency: attributes.reading_frequency,
      expertise_level: attributes.expertise_level,
      favorite_category: attributes.favorite_category,
      is_engineering_team_reader: String(attributes.is_engineering_team_reader),
    });

    // Get experiences and variants from manifest
    const experiences = sdk.getExperiences();
    const variantAliases = sdk.getVariantAliases();

    // Log results
    if (variantAliases && variantAliases.length > 0) {
      console.log('✅ Variant matched:', variantAliases.join(','));
    } else {
      console.log('ℹ️ No variant matched (showing default)');
    }

    return { experiences, variantAliases };
  }

  /**
   * Trigger impression event for analytics
   */
  async triggerImpression(experienceShortUid: string): Promise<void> {
    if (!this.sdk) {
      console.warn('⚠️ SDK not initialized, cannot trigger impression');
      return;
    }

    try {
      await this.sdk.triggerImpression(experienceShortUid);
      console.log('📊 Impression tracked for experience', experienceShortUid);
    } catch (error) {
      console.warn('⚠️ Failed to trigger impression:', error);
    }
  }

  /**
   * Get SDK instance (for advanced usage)
   */
  getSDK(): Sdk | null {
    return this.sdk;
  }
}

// Export singleton instance
export const personalizeSDK = new PersonalizeSDKManager();

// Export types
export type { PersonalizationAttributes, Experience };
