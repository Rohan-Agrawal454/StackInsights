import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.png';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <img 
              src={logoImage} 
              alt="StackInsights" 
              className="h-12 w-auto"
            />
            <span className="text-sm font-semibold text-text-primary">StackInsights</span>
          </div>
          
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/browse" className="text-text-secondary hover:text-text-primary transition-colors">
              Browse
            </Link>
            <Link to="/create" className="text-text-secondary hover:text-text-primary transition-colors">
              Create
            </Link>
            <Link to="/about" className="text-text-secondary hover:text-text-primary transition-colors">
              Guidelines
            </Link>
          </nav>
          
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} Internal Knowledge Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
