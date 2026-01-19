import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Plus, User, LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { fetchNavbar } from '@/lib/contentstack-api';
import type { NavbarContent } from '@/types/contentstack';
import { useProfile } from '@/hooks/use-profile';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProfile, setCurrentProfile, allProfiles } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navbarData, setNavbarData] = useState<NavbarContent | null>(null);

  useEffect(() => {
    fetchNavbar().then(setNavbarData);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  if (!navbarData) {
    return null; // or loading state
  }

  const navLinks = navbarData.navigation.map(item => ({
    href: item.nav_links.href.href,
    label: item.nav_links.label,
  }));
  const logoUrl = navbarData.logo.image.logo_image.url;
  const logoText = navbarData.logo.brand_text;
  const logoAlt = navbarData.logo.image.alt_text;
  const searchPlaceholder = navbarData.search;
  const createButtonText = navbarData.action_button.button_text;
  const createButtonLink = navbarData.action_button.button_link.href;
  const profileLabel = navbarData.user_menu.profile.label;
  const logoutLabel = navbarData.user_menu.logout.label;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-elevated/95 backdrop-blur supports-backdrop-filter:bg-surface-elevated/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={logoUrl} 
            alt={logoAlt} 
            className="h-10 w-auto"
          />
          <span className="hidden font-semibold text-text-primary sm:inline-block">
            {logoText}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors rounded-md',
                location.pathname === link.href
                  ? 'text-text-primary bg-muted'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted/50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="relative hidden w-64 lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-9 pl-9 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </form>

          {/* Create Button - Desktop */}
          <Button asChild size="sm" className="hidden md:flex">
            <Link to={createButtonLink}>
              <Plus className="mr-1.5 h-4 w-4" />
              {createButtonText}
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <img
                  src={currentProfile.avatar}
                  alt={currentProfile.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentProfile.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentProfile.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/profile/${currentProfile.id}`} className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {profileLabel}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                <Users className="mr-2 h-3 w-3 inline" />
                Switch Profile (Dev Mode)
              </DropdownMenuLabel>
              {[...allProfiles].sort((a, b) => parseInt(a.id) - parseInt(b.id)).map((profile) => (
                <DropdownMenuItem
                  key={profile.id}
                  onClick={() => setCurrentProfile(profile)}
                  className={cn(
                    "pl-8 cursor-pointer hover:bg-muted ",
                    currentProfile.id === profile.id && "bg-muted"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm">{profile.name}</span>
                      <span className="text-xs ">{profile.team}</span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {logoutLabel}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-surface-elevated md:hidden animate-fade-in">
          <div className="container py-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-10 pl-9 bg-muted border-0"
              />
            </form>
            
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-2.5 text-sm font-medium transition-colors rounded-md',
                    location.pathname === link.href
                      ? 'text-text-primary bg-muted'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
