import type { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((i) => i.product.id === product.id);

  return (
    <div
      className="group cursor-pointer rounded-xl border bg-card p-4 transition-all hover:shadow-lg hover:border-primary/30"
      onClick={() => onViewDetails(product)}
    >
      <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-secondary">
        <span className="text-3xl font-heading font-bold text-primary/30">
          {product.brand.charAt(0)}
        </span>
      </div>

      <div className="space-y-1.5">
        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {product.category}
        </span>
        <h3 className="font-body text-sm font-semibold text-foreground leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground">{product.brand} · {product.unit}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-foreground">₹{product.price}</span>
          
          {cartItem ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => {
                  if (cartItem.quantity <= 1) removeItem(product.id);
                  else updateQuantity(product.id, cartItem.quantity - 1);
                }}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-7 text-center text-sm font-semibold">{cartItem.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="h-8"
              onClick={(e) => {
                e.stopPropagation();
                addItem(product);
              }}
            >
              <ShoppingCart className="mr-1 h-3.5 w-3.5" />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
