import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Send, Bold, Italic, Code, List, Link2, Image } from 'lucide-react';
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
import { teams, categories, getCategoryLabel, allTags, type PostCategory } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function CreatePost() {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');
  const [team, setTeam] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your post has been saved as a draft.",
    });
  };

  const handlePublish = () => {
    if (!title || !category || !team || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields before publishing.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Post published!",
      description: "Your post is now live and visible to the team.",
    });
  };

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
              <h1 className="text-2xl font-bold text-text-primary">Create Post</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button onClick={handlePublish}>
                <Send className="mr-2 h-4 w-4" />
                Publish
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

            {/* Editor */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Content <span className="text-destructive">*</span>
              </Label>
              
              {/* Toolbar */}
              <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-border bg-muted/50 p-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Italic className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-5" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Code className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <List className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-5" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Link2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              
              <Textarea
                placeholder="Write your post content here...

## Context
Describe the background and context for this post.

## Problem
What was the challenge or situation?

## Resolution
How was it addressed?

## Key Learnings
What did we learn from this experience?"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                className="min-h-[400px] rounded-t-none border-t-0 bg-card font-mono text-sm"
              />
            </div>

            {/* Tips */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="font-medium text-text-primary text-sm mb-2">Writing Tips</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Use clear, descriptive headings to structure your content</li>
                <li>• Include specific technical details that help others learn</li>
                <li>• Add code snippets where relevant using markdown code blocks</li>
                <li>• Focus on actionable takeaways and lessons learned</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}