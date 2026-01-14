import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFooter, processCopyrightText } from '@/lib/contentstack-api';
import type { FooterContent } from '@/types/contentstack';

export function Footer() {
  const [footerData, setFooterData] = useState<FooterContent | null>(null);

  useEffect(() => {
    fetchFooter().then(setFooterData);
  }, []);

  if (!footerData) {
    return null;
  }

  const logoUrl = footerData.logo.logo.image.url;
  const logoText = footerData.logo.brand_name;
  const logoAlt = footerData.logo.logo.logo_alt_text;
  const footerLinks = footerData.navigation_blocks.map(item => ({
    href: item.nav.link.href,
    label: item.nav.label,
  }));
  const copyrightText = processCopyrightText(footerData.copyright_text);

  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <img 
              src={logoUrl} 
              alt={logoAlt} 
              className="h-12 w-auto"
            />
            <span className="text-sm font-semibold text-text-primary">{logoText}</span>
          </div>
          
          <nav className="flex items-center gap-6 text-sm">
            {footerLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <p className="text-sm text-text-tertiary">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
