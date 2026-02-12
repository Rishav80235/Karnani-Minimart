import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Minus, Trash2, MessageCircle, ShoppingCart } from 'lucide-react';

interface CartSheetProps {
  open: boolean;
  onClose: () => void;
}

const CartSheet = ({ open, onClose }: CartSheetProps) => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const handleWhatsAppCheckout = () => {
    if (!customerName.trim()) return;

    const itemsList = items
      .map(
        (item, i) =>
          `${i + 1}. ${item.product.name} (${item.product.brand}) × ${item.quantity} = ₹${item.product.price * item.quantity}`
      )
      .join('%0A');

    const message = encodeURIComponent(
      `🛒 *New Order — Karnani HoReCa*\n\n` +
      `👤 Customer: ${customerName.trim()}\n` +
      `📍 Delivery: Jaipur\n\n` +
      `*Order Details:*\n`
    ) + '%0A' + itemsList + '%0A%0A' +
      encodeURIComponent(`💰 *Total: ₹${totalPrice()}*\n\nPlease confirm the order. 🙏`);

    window.open(`https://wa.me/919929873530?text=${message}`, '_blank');
    clearCart();
    setCheckoutOpen(false);
    setCustomerName('');
    onClose();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="font-heading">Your Cart</SheetTitle>
            <SheetDescription>
              {totalItems() === 0
                ? 'Your cart is empty'
                : `${totalItems()} item${totalItems() !== 1 ? 's' : ''} in cart`}
            </SheetDescription>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <ShoppingCart className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Add some products to get started</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-3 py-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 rounded-lg border bg-card p-3"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <span className="text-lg font-heading font-bold text-primary/30">
                        {item.product.brand.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.product.brand} · {item.product.unit}</p>
                      <p className="text-sm font-bold text-foreground">₹{item.product.price * item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">₹{totalPrice()}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setCheckoutOpen(true)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Place Order via WhatsApp
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">Confirm Your Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="customerName">Your Name</Label>
              <Input
                id="customerName"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your order will be sent to WhatsApp (+91 99298 73530) for confirmation. Delivery location: Jaipur.
            </p>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              disabled={!customerName.trim()}
              onClick={handleWhatsAppCheckout}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Order on WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartSheet;
