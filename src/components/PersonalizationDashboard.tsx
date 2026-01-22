/**
 * Personalization Dashboard Component
 * Shows user their behavior stats and personalization attributes
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/use-profile';
import { getUserAttributes, getUserBehavior, resetUserBehavior, type UserAttributesData, type UserBehaviorData } from '@/lib/personalization';
import { BarChart3, Target, TrendingUp, Award, RefreshCw } from 'lucide-react';
import type { PostCategory } from '@/types';

export function PersonalizationDashboard() {
  const { currentProfile } = useProfile();
  const [attributes, setAttributes] = useState<UserAttributesData | null>(null);
  const [behavior, setBehavior] = useState<UserBehaviorData | null>(null);

  // Load user behavior data when profile changes
  useEffect(() => {
    if (!currentProfile) return;
    
    const attrs = getUserAttributes(currentProfile.id);
    const behav = getUserBehavior(currentProfile.id);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttributes(attrs);
    setBehavior(behav);
  }, [currentProfile]);

  const handleReset = () => {
    if (!currentProfile) return;
    if (confirm('Reset your personalization data? This will clear your reading history and preferences.')) {
      resetUserBehavior(currentProfile.id);
      
      // Reload data after reset
      const attrs = getUserAttributes(currentProfile.id);
      const behav = getUserBehavior(currentProfile.id);
      setAttributes(attrs);
      setBehavior(behav);
    }
  };

  if (!attributes || !behavior) {
    return null;
  }

  const getCategoryPercentage = (category: PostCategory) => {
    const total = Object.values(behavior.categoryViews).reduce((sum: number, val: number) => sum + val, 0);
    if (total === 0) return 0;
    return Math.round((behavior.categoryViews[category] / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Your Personalization Profile</h2>
          <p className="text-sm text-text-secondary mt-1">
            Based on your reading behavior, we personalize content recommendations
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reading Stats */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Posts Read</p>
              <p className="text-2xl font-bold text-text-primary">{attributes.read_count}</p>
            </div>
          </div>
        </Card>

        {/* Frequency */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Frequency</p>
              <Badge variant="default" className="mt-1 capitalize">
                {attributes.reading_frequency}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Expertise */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-retro/10 rounded-lg">
              <Award className="h-5 w-5 text-retro" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Expertise</p>
              <Badge variant="default" className="mt-1 capitalize">
                {attributes.expertise_level}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Favorite */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-insight/10 rounded-lg">
              <Target className="h-5 w-5 text-insight" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Favorite</p>
              <Badge variant="default" className="mt-1">
                {attributes.favorite_category || 'None yet'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {(Object.entries(behavior.categoryViews) as [PostCategory, number][]).map(([category, count]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">{category}</span>
                <span className="text-sm text-text-secondary">{count} posts ({getCategoryPercentage(category)}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${getCategoryPercentage(category)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Current Audience */}
      <Card className="p-6 bg-linear-to-br from-primary/5 to-accent/5">
        <h3 className="text-lg font-semibold text-text-primary mb-2">🎯 Your Audiences</h3>
        <p className="text-sm text-text-secondary mb-4">
          Based on your attributes, you belong to these personalization segments:
        </p>
        <div className="flex flex-wrap gap-2">
          {attributes.team && (
            <Badge variant="outline">{attributes.team} Team Member</Badge>
          )}
          {attributes.favorite_category === 'Insight' && attributes.reading_frequency !== 'occasional' && (
            <Badge variant="outline">Insight Enthusiast</Badge>
          )}
          {attributes.favorite_category === 'Incident' && ['intermediate', 'expert'].includes(attributes.expertise_level) && (
            <Badge variant="outline">Incident Responder</Badge>
          )}
          {attributes.favorite_category === 'Retrospective' && (
            <Badge variant="outline">Retrospective Reader</Badge>
          )}
          {attributes.reading_frequency === 'daily' && attributes.expertise_level === 'expert' && (
            <Badge variant="outline">Power User</Badge>
          )}
          {(attributes.reading_frequency === 'occasional' || !attributes.favorite_category) && (
            <Badge variant="outline">New User</Badge>
          )}
        </div>
        <p className="text-xs text-text-tertiary mt-4">
          💡 Content is personalized based on these audience segments in Contentstack
        </p>
      </Card>
    </div>
  );
}
