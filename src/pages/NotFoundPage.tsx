import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 space-y-3">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        404 - Not Found
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 max-w-sm">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Return to Feed</span>
      </Link>
    </div>
  );
}
