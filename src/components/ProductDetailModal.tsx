import type { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, open, onClose }: ProductDetailModalProps) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  if (!product) return null;

  const cartItem = items.find((i) => i.product.id === product.id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex h-48 items-center justify-center rounded-xl bg-secondary">
            <span className="text-6xl font-heading font-bold text-primary/20">
              {product.brand.charAt(0)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {product.category}
              </span>
              <span className="text-xs text-muted-foreground">{product.brand}</span>
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground">{product.description}</p>
            )}

            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div>
                <p className="text-2xl font-bold text-foreground">₹{product.price}</p>
                <p className="text-xs text-muted-foreground">per {product.unit}</p>
              </div>

              {cartItem ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (cartItem.quantity <= 1) removeItem(product.id);
                      else updateQuantity(product.id, cartItem.quantity - 1);
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-lg font-bold">{cartItem.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => addItem(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
