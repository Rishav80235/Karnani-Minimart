import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LayoutDashboard, LogIn } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold leading-tight text-foreground">Karnani</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">HoReCa</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            variant={location.pathname === '/' ? 'secondary' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/">
              <User className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </Link>
          </Button>
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
          <Button variant="ghost" size="sm" asChild>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
