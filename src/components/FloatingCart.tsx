import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

interface FloatingCartProps {
  onClick: () => void;
}

const FloatingCart = ({ onClick }: FloatingCartProps) => {
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
      <Button
        size="lg"
        className="rounded-full shadow-lg px-6 gap-2"
        onClick={onClick}
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="font-semibold">{totalItems} item{totalItems !== 1 && 's'}</span>
        <span className="mx-1">·</span>
        <span className="font-bold">₹{totalPrice}</span>
      </Button>
    </div>
  );
};

export default FloatingCart;
