import { Search, ShoppingCart, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onCartClick: () => void;
}

const Navbar = ({ query, onQueryChange, onCartClick }: NavbarProps) => {
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold leading-tight text-foreground">Karnani</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">HoReCa</span>
          </div>
        </Link>

        {/* Search - hidden on mobile, shown on sm+ */}
        <div className="hidden sm:flex relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products or brands..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <nav className="flex items-center gap-1">
          {isAdmin && (
            <Button
              variant={location.pathname === '/admin' ? 'secondary' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/admin">
                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </Button>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button
              variant={location.pathname === '/login' ? 'secondary' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/login">
                <LogIn className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="relative" onClick={onCartClick}>
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>
        </nav>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden border-t px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products or brands..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
