import { Link } from 'react-router-dom';
import { Lightbulb, AlertTriangle, RotateCcw, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function About() {
  return (
    <Layout>
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary">About StackInsights</h1>
            <p className="mt-4 text-lg text-text-secondary">
              Building a culture of continuous learning through shared knowledge.
            </p>
          </header>

          <div className="prose-stack">
            {/* Purpose */}
            <section>
              <h2>Purpose</h2>
              <p>
                StackInsights is our internal knowledge-sharing platform designed to help teams 
                discover, read, and publish technical learnings. By documenting our experiences—both 
                successes and failures—we build organizational memory and accelerate collective growth.
              </p>
              <p>
                Every insight shared, incident documented, and retrospective written adds to our 
                shared understanding. This platform makes it easy to learn from each other, 
                regardless of team or location.
              </p>
            </section>

            <Separator className="my-8" />

            {/* Post Types */}
            <section>
              <h2>Types of Content</h2>
              
              <div className="mt-6 space-y-4">
                <div className="flex gap-4 rounded-lg border border-insight/20 bg-insight/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-insight/10">
                    <Lightbulb className="h-5 w-5 text-insight" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Insights</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      Technical learnings, best practices, architectural decisions, and deep dives 
                      into specific topics. Share what you've learned to help others avoid pitfalls 
                      and adopt proven approaches.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-lg border border-incident/20 bg-incident/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-incident/10">
                    <AlertTriangle className="h-5 w-5 text-incident" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Incidents</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      Post-mortems and failure analyses. Document what went wrong, how it was 
                      resolved, and what we learned. Blameless incident reports help us build 
                      more resilient systems.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-lg border border-retro/20 bg-retro/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-retro/10">
                    <RotateCcw className="h-5 w-5 text-retro" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Retrospectives</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      Team reflections on projects, sprints, or quarters. What went well? 
                      What could be improved? Share process learnings that help teams work 
                      more effectively.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Writing Guidelines */}
            <section>
              <h2>Writing Guidelines</h2>
              <p>
                Great posts share common characteristics. Here's how to write content that 
                helps your colleagues learn and grow:
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-text-primary">
                    <CheckCircle className="h-4 w-4 text-retro" />
                    Do
                  </h4>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>• Be specific and include technical details</li>
                    <li>• Use clear structure with headings</li>
                    <li>• Include code snippets when relevant</li>
                    <li>• Focus on actionable takeaways</li>
                    <li>• Link to related resources</li>
                    <li>• Keep a blameless tone for incidents</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-text-primary">
                    <XCircle className="h-4 w-4 text-incident" />
                    Don't
                  </h4>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>• Write vague, high-level overviews</li>
                    <li>• Include sensitive credentials or PII</li>
                    <li>• Blame individuals for failures</li>
                    <li>• Skip the context section</li>
                    <li>• Forget to tag your post properly</li>
                    <li>• Use jargon without explanation</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Post Structure */}
            <section>
              <h2>Recommended Structure</h2>
              <p>
                While not strictly required, we recommend including these sections in your posts:
              </p>

              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                <ol className="space-y-3 text-sm">
                  <li>
                    <strong className="text-text-primary">1. Context</strong>
                    <p className="mt-0.5 text-text-secondary">
                      Background information readers need to understand the situation.
                    </p>
                  </li>
                  <li>
                    <strong className="text-text-primary">2. Problem / Challenge</strong>
                    <p className="mt-0.5 text-text-secondary">
                      What was the issue, goal, or situation being addressed?
                    </p>
                  </li>
                  <li>
                    <strong className="text-text-primary">3. Solution / Resolution</strong>
                    <p className="mt-0.5 text-text-secondary">
                      How was it solved? Include technical details and code examples.
                    </p>
                  </li>
                  <li>
                    <strong className="text-text-primary">4. Key Learnings</strong>
                    <p className="mt-0.5 text-text-secondary">
                      What did you learn? What would you do differently?
                    </p>
                  </li>
                </ol>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
            <h3 className="text-xl font-semibold text-text-primary">Ready to contribute?</h3>
            <p className="mt-2 text-text-secondary">
              Share your knowledge and help the team grow together.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link to="/create">Create Your First Post</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}