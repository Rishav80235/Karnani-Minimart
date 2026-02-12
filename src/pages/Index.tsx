import { useState, useMemo } from 'react';
import type { Product } from '@/data/products';
import { useProducts, useCategories } from '@/hooks/useProducts';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import FloatingCart from '@/components/FloatingCart';
import CartSheet from '@/components/CartSheet';
import TrendingBanner from '@/components/TrendingBanner';
import { Phone } from 'lucide-react';

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  const { data: categoryRows = [] } = useCategories();
  const categories = ['All', ...categoryRows.map((c) => c.name)];

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
        !query ||
        [p.name, p.brand, p.category].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        );
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar query={query} onQueryChange={setQuery} onCartClick={() => setCartOpen(true)} />
      <TrendingBanner />

      <main className="flex-1 container py-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Premium HoReCa Supplies
            </h1>
            <p className="text-sm text-muted-foreground">
              Veeba • Wizzie • Lactilas • Foodfest • Nutaste • Goeld & more
            </p>
          </div>
        </div>

        <CategoryFilter categories={categories} active={category} onChange={setCategory} />

        <p className="mt-4 text-sm text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 && 's'}
        </p>

        {filtered.length > 0 ? (
          <div className="mt-3 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onViewDetails={setSelectedProduct} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-muted-foreground">No products found</p>
        )}
      </main>

      <footer className="border-t bg-card py-4">
        <div className="container flex flex-col items-center gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© KARNANI Mini Mart</span>
          <a href="tel:+919929873530" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Phone className="h-3 w-3" />
            +91 99298 73530
          </a>
        </div>
      </footer>

      <FloatingCart onClick={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />

      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Index;
