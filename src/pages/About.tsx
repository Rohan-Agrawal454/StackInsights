import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, AlertTriangle, RotateCcw, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fetchAboutPage } from '@/lib/contentstack-api';
import type { AboutPageContent } from '@/types/contentstack';

export default function About() {
  const [aboutData, setAboutData] = useState<AboutPageContent | null>(null);

  useEffect(() => {
    fetchAboutPage().then(setAboutData);
  }, []);

  if (!aboutData) {
    return null;
  }

  // Extract all content from CMS
  const headerTitle = aboutData.header.title;
  const headerSubtitle = aboutData.header.subtitle;
  
  const purposeTitle = aboutData.purpose.title;
  const purposeParagraph1 = aboutData.purpose.paragraph_1;
  const purposeParagraph2 = aboutData.purpose.paragraph_2;
  
  const contentTypesHeading = aboutData.contenttype_section.heading;
  const insightTitle = aboutData.contenttype_section.insight_card.title;
  const insightDescription = aboutData.contenttype_section.insight_card.description;
  const incidentTitle = aboutData.contenttype_section.incident_card.title;
  const incidentDescription = aboutData.contenttype_section.incident_card.description;
  const retroTitle = aboutData.contenttype_section.retrospective_card.title;
  const retroDescription = aboutData.contenttype_section.retrospective_card.description;
  
  const guidelinesHeading = aboutData.guidelines_section.heading;
  const guidelinesIntro = aboutData.guidelines_section.intro_text;
  const doTitle = aboutData.guidelines_section.do_items.title;
  const doItems = aboutData.guidelines_section.do_items.items;
  const dontTitle = aboutData.guidelines_section.dont_item.title;
  const dontItems = aboutData.guidelines_section.dont_item.items;
  
  const structureHeading = aboutData.structure_section.heading;
  const structureIntro = aboutData.structure_section.intro_text;
  const structureItems = aboutData.structure_section.items;
  
  const ctaTitle = aboutData.cta.title;
  const ctaDescription = aboutData.cta.description;
  const ctaButtonText = aboutData.cta.button_text;
  const ctaButtonLink = aboutData.cta.button_link.href;

  return (
    <Layout>
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary">{headerTitle}</h1>
            <p className="mt-4 text-lg text-text-secondary">
              {headerSubtitle}
            </p>
          </header>

          <div className="prose-stack">
            {/* Purpose */}
            <section>
              <h2>{purposeTitle}</h2>
              <p>
                {purposeParagraph1}
              </p>
              <p>
                {purposeParagraph2}
              </p>
            </section>

            <Separator className="my-8" />

            {/* Post Types */}
            <section>
              <h2>{contentTypesHeading}</h2>
              
              <div className="mt-6 space-y-4">
                <div className="flex gap-4 rounded-lg border border-insight/20 bg-insight/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-insight/10">
                    <Lightbulb className="h-5 w-5 text-insight" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{insightTitle}</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {insightDescription}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-lg border border-incident/20 bg-incident/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-incident/10">
                    <AlertTriangle className="h-5 w-5 text-incident" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{incidentTitle}</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {incidentDescription}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-lg border border-retro/20 bg-retro/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-retro/10">
                    <RotateCcw className="h-5 w-5 text-retro" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{retroTitle}</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {retroDescription}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Writing Guidelines */}
            <section>
              <h2>{guidelinesHeading}</h2>
              <p>
                {guidelinesIntro}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-text-primary">
                    <CheckCircle className="h-4 w-4 text-retro" />
                    {doTitle}
                  </h4>
                  <div className="space-y-2 text-sm text-text-secondary whitespace-pre-line">
                    {doItems}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-text-primary">
                    <XCircle className="h-4 w-4 text-incident" />
                    {dontTitle}
                  </h4>
                  <div className="space-y-2 text-sm text-text-secondary whitespace-pre-line">
                    {dontItems}
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Post Structure */}
            <section>
              <h2>{structureHeading}</h2>
              <p>
                {structureIntro}
              </p>

              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-text-secondary whitespace-pre-line">
                  {structureItems}
                </div>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
            <h3 className="text-xl font-semibold text-text-primary">{ctaTitle}</h3>
            <p className="mt-2 text-text-secondary">
              {ctaDescription}
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link to={ctaButtonLink}>{ctaButtonText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}