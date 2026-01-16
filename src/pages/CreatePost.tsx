import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Send, Info, AlertCircle, CheckCircle, Target, TrendingUp, Lightbulb, BookOpen, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Post, PostCategory } from '@/types';
import { getCategoryColor } from '@/lib/category-utils';
import { fetchCreatePostContent, fetchCategories, getAllPosts } from '@/lib/contentstack-api';
import type { CreatePostContent, ContentstackCategory } from '@/types/contentstack';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function CreatePost() {
  const { toast } = useToast();
  const [pageContent, setPageContent] = useState<CreatePostContent | null>(null);
  const [categories, setCategories] = useState<ContentstackCategory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<string>('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [context, setContext] = useState('');
  const [problem, setProblem] = useState('');
  const [resolution, setResolution] = useState('');
  const [achievements, setAchievements] = useState('');
  const [challenges, setChallenges] = useState('');
  const [improvements, setImprovements] = useState('');
  const [learnings, setLearnings] = useState('');

  useEffect(() => {
    fetchCreatePostContent().then(setPageContent);
    fetchCategories().then(setCategories);
    getAllPosts().then(setPosts);
  }, []);

  // Generate all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [posts]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const newTag = customTagInput.trim();
      if (!selectedTags.includes(newTag)) {
        setSelectedTags(prev => [...prev, newTag]);
      }
      setCustomTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleSaveDraft = () => {
    if (!pageContent) return;
    toast({
      title: pageContent.toast_messages?.draft_saved_title || "Draft saved",
      description: pageContent.toast_messages?.draft_saved_description || "Your post has been saved as a draft.",
    });
  };

  const handlePublish = () => {
    if (!pageContent) return;
    if (!title || !excerpt || !category || !context) {
      toast({
        title: pageContent.toast_messages?.missing_fields_title || "Missing fields",
        description: pageContent.toast_messages?.missing_fields_description || "Please fill in title, excerpt, category, and context before publishing.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: pageContent.toast_messages?.published_title || "Post published!",
      description: pageContent.toast_messages?.published_description || "Your post is now live and visible to the team.",
    });
  };

  if (!pageContent) {
    return null;
  }

  const isInsight = category === 'insight';
  const isIncident = category === 'incident';
  const isRetrospective = category === 'retrospective';

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/browse">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-text-primary">{pageContent.page_header.page_title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                {pageContent.action_buttons.save_draft_button}
              </Button>
              <Button onClick={handlePublish}>
                <Send className="mr-2 h-4 w-4" />
                {pageContent.action_buttons.publish_button}
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                {pageContent.form_labels.title_label} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder={pageContent.form_labels.title_placeholder}
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                className="h-12 text-lg font-medium bg-card"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-sm font-medium">
                {pageContent.form_labels.excerpt_label} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="excerpt"
                placeholder={pageContent.form_labels.excerpt_placeholder}
                value={excerpt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExcerpt(e.target.value)}
                className="min-h-[80px] bg-card"
              />
              <p className="text-xs text-text-tertiary">{pageContent.form_labels.excerpt_help_text}</p>
            </div>

            {/* Post Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {pageContent.form_labels.post_type_label} <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder={pageContent.form_labels.post_type_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.uid} value={cat.category_value}>
                      {cat.category_label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-text-tertiary">{pageContent.form_labels.post_type_help_text}</p>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label htmlFor="featuredImage" className="text-sm font-medium">
                Featured Image
              </Label>
              <Input
                id="featuredImage"
                type="url"
                placeholder="https://images.contentstack.io/v3/assets/..."
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="bg-card"
              />
              <p className="text-xs text-text-tertiary">
                Optional. Paste the image URL from Contentstack Assets (after uploading).
              </p>
              {featuredImage && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img
                    src={featuredImage}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.alt = 'Invalid image URL';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{pageContent.form_labels.tags_label}</Label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-text-tertiary">{pageContent.form_labels.tags_help_text}</p>
            </div>

            {/* Custom Tags Input */}
            <div className="space-y-2">
              <Label htmlFor="customTags" className="text-sm font-medium">
                {pageContent.form_labels.custom_tags_label}
              </Label>
              <Input
                id="customTags"
                placeholder={pageContent.form_labels.custom_tags_placeholder}
                value={customTagInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTagInput(e.target.value)}
                onKeyDown={handleCustomTagKeyDown}
                className="bg-card"
              />
              <p className="text-xs text-text-tertiary">{pageContent.form_labels.custom_tags_help_text}</p>
              
              {/* Display selected custom tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedTags.map((tag: string) => (
                    <Badge key={tag} variant="default" className="gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Content Sections */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">{pageContent.content_section.section_title}</h2>
                <p className="text-sm text-text-tertiary">{pageContent.content_section.section_subtitle}</p>
              </div>

              {/* Context - Required */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", category ? getCategoryColor(category as PostCategory) : "bg-muted")}>
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-text-primary">
                      {pageContent.context_section.label} <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-text-tertiary">{pageContent.context_section.description}</p>
                  </div>
                </div>
                <Textarea
                  placeholder={pageContent.context_section.placeholder}
                  value={context}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContext(e.target.value)}
                  className="min-h-[120px] bg-background"
                />
              </div>

              {/* Problem - For Insights and Incidents */}
              {(isInsight || isIncident) && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-incident/10">
                      <AlertCircle className="h-5 w-5 text-incident" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold text-text-primary">{pageContent.problem_section.label}</Label>
                      <p className="text-xs text-text-tertiary">{pageContent.problem_section.description}</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder={pageContent.problem_section.placeholder}
                    value={problem}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProblem(e.target.value)}
                    className="min-h-[120px] bg-background"
                  />
                </div>
              )}

              {/* Resolution - For Insights and Incidents */}
              {(isInsight || isIncident) && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-retro/10">
                      <CheckCircle className="h-5 w-5 text-retro" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold text-text-primary">{pageContent.resolution_section.label}</Label>
                      <p className="text-xs text-text-tertiary">{pageContent.resolution_section.description}</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder={pageContent.resolution_section.placeholder}
                    value={resolution}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResolution(e.target.value)}
                    className="min-h-[120px] bg-background"
                  />
                </div>
              )}

              {/* Achievements - For Retrospectives */}
              {isRetrospective && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-insight/10">
                      <Target className="h-5 w-5 text-insight" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold text-text-primary">{pageContent.achievements_section.label}</Label>
                      <p className="text-xs text-text-tertiary">{pageContent.achievements_section.description}</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder={pageContent.achievements_section.placeholder}
                    value={achievements}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAchievements(e.target.value)}
                    className="min-h-[120px] bg-background"
                  />
                </div>
              )}

              {/* Challenges - For Retrospectives */}
              {isRetrospective && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <TrendingUp className="h-5 w-5 text-text-secondary" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold text-text-primary">{pageContent.challenges_section.label}</Label>
                      <p className="text-xs text-text-tertiary">{pageContent.challenges_section.description}</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder={pageContent.challenges_section.placeholder}
                    value={challenges}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setChallenges(e.target.value)}
                    className="min-h-[120px] bg-background"
                  />
                </div>
              )}

              {/* Improvements - For Retrospectives */}
              {isRetrospective && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <BookOpen className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold text-text-primary">{pageContent.improvements_section.label}</Label>
                      <p className="text-xs text-text-tertiary">{pageContent.improvements_section.description}</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder={pageContent.improvements_section.placeholder}
                    value={improvements}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setImprovements(e.target.value)}
                    className="min-h-[120px] bg-background"
                  />
                </div>
              )}

              {/* Key Learnings - For All Types */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Lightbulb className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-text-primary">{pageContent.learnings_section.label}</Label>
                    <p className="text-xs text-text-tertiary">{pageContent.learnings_section.description}</p>
                  </div>
                </div>
                <Textarea
                  placeholder={pageContent.learnings_section.placeholder}
                  value={learnings}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLearnings(e.target.value)}
                  className="min-h-[120px] bg-background"
                />
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="font-medium text-text-primary text-sm mb-2">{pageContent.writing_tips.tips_title}</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                {pageContent.writing_tips.tips_list.split('\n').map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}