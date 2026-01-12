import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <span className="text-4xl font-bold text-text-tertiary">404</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Page Not Found</h1>
        <p className="mt-3 text-text-secondary max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}