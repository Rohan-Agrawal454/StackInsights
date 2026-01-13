import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Send, Info, AlertCircle, CheckCircle, Target, TrendingUp, Lightbulb, BookOpen } from 'lucide-react';
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
import { teams, categories, getCategoryLabel, getCategoryColor, allTags, posts, type PostCategory } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const post = posts.find((p) => p.id === id);

  const [title, setTitle] = useState(() => post?.title || '');
  const [category, setCategory] = useState<string>(() => post?.category || '');
  const [team, setTeam] = useState(() => post?.team || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(() => post?.tags || []);
  const [context, setContext] = useState(() => post?.content.context || '');
  const [problem, setProblem] = useState(() => post?.content.problem || '');
  const [resolution, setResolution] = useState(() => post?.content.resolution || '');
  const [achievements, setAchievements] = useState(() => post?.content.achievements || '');
  const [challenges, setChallenges] = useState(() => post?.content.challenges || '');
  const [improvements, setImprovements] = useState(() => post?.content.improvements || '');
  const [learnings, setLearnings] = useState(() => post?.content.learnings || '');

  if (!post) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">Post not found</h1>
          <Button asChild className="mt-4">
            <Link to="/browse">Back to Browse</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your changes have been saved as a draft.",
    });
  };

  const handleUpdate = () => {
    if (!title || !category || !team || !context) {
      toast({
        title: "Missing fields",
        description: "Please fill in title, category, team, and context before updating.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Post updated!",
      description: "Your post has been successfully updated.",
    });
    navigate(`/post/${post.id}`);
  };

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
                <Link to={`/post/${post.id}`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-text-primary">Edit Post</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button onClick={handleUpdate}>
                <Send className="mr-2 h-4 w-4" />
                Update Post
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title..."
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                className="h-12 text-lg font-medium bg-card"
              />
            </div>

            {/* Type and Team */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Post Type <span className="text-destructive">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: PostCategory) => (
                      <SelectItem key={cat} value={cat}>
                        {getCategoryLabel(cat as PostCategory)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Team <span className="text-destructive">*</span>
                </Label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.filter((t: string) => t !== 'All Teams').map((t: string) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tags</Label>
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
              <p className="text-xs text-text-tertiary">Click to add or remove tags</p>
            </div>

            <Separator />

            {/* Content Sections */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">Content</h2>
                <p className="text-sm text-text-tertiary">Update the relevant sections for your post type</p>
              </div>

              {/* Context - Required */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", category ? getCategoryColor(category as PostCategory) : "bg-muted")}>
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-text-primary">
                      Context <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-text-tertiary">Provide background and context for this post</p>
                  </div>
                </div>
                <Textarea
                  placeholder="Describe the background and context for this post. What situation or system are you discussing?"
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
                      <Label className="text-lg font-semibold text-text-primary">Problem Statement</Label>
                      <p className="text-xs text-text-tertiary">Describe the challenge or issue you faced</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder="What was the core challenge or problem? What symptoms did you observe?"
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
                      <Label className="text-lg font-semibold text-text-primary">Resolution</Label>
                      <p className="text-xs text-text-tertiary">How did you solve or address the problem?</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Describe the solution you implemented. What steps did you take?"
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
                      <Label className="text-lg font-semibold text-text-primary">Achievements</Label>
                      <p className="text-xs text-text-tertiary">What were the major wins this period?</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder="List the key achievements, milestones, or successes..."
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
                      <Label className="text-lg font-semibold text-text-primary">Challenges</Label>
                      <p className="text-xs text-text-tertiary">What obstacles or difficulties did you encounter?</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Describe the challenges, obstacles, or areas where you struggled..."
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
                      <Label className="text-lg font-semibold text-text-primary">Improvements</Label>
                      <p className="text-xs text-text-tertiary">What actions will you take going forward?</p>
                    </div>
                  </div>
                  <Textarea
                    placeholder="What improvements, changes, or actions will you implement next period?"
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
                    <Label className="text-lg font-semibold text-text-primary">Key Learnings</Label>
                    <p className="text-xs text-text-tertiary">What insights or lessons did you gain?</p>
                  </div>
                </div>
                <Textarea
                  placeholder="Share the key takeaways, insights, or lessons learned from this experience..."
                  value={learnings}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLearnings(e.target.value)}
                  className="min-h-[120px] bg-background"
                />
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="font-medium text-text-primary text-sm mb-2">Writing Tips</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Context is required - provide clear background information</li>
                <li>• For Insights/Incidents: Focus on problem, resolution, and learnings</li>
                <li>• For Retrospectives: Highlight achievements, challenges, and improvements</li>
                <li>• Be specific with technical details and include concrete examples</li>
                <li>• Key Learnings should be actionable takeaways for the team</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
