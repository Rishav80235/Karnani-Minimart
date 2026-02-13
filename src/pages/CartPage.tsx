import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Trash2, ShoppingCart, MessageCircle, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
   const { user, loading } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   // If user is logged in, prefill name from email once
   useEffect(() => {
     if (user && !customerName) {
       const email = user.email ?? '';
       if (email) {
         const base = email.split('@')[0];
         setCustomerName(base);
       }
     }
   }, [user, customerName]);

   const openCheckout = () => {
     if (loading) return;
     if (!user) {
       // Remember where we came from so we can redirect back after login
       navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
       return;
     }
     setCheckoutOpen(true);
   };

  const handleWhatsAppCheckout = () => {
    if (!customerName.trim()) return;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

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
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <h1 className="font-heading text-2xl font-bold">Your Cart</h1>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingCart className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-lg font-semibold">Cart is empty</p>
              <p className="mb-4 text-sm text-muted-foreground">Add some products to get started</p>
              <Button asChild>
                <Link to="/">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 rounded-xl border bg-card p-4"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <span className="text-xl font-heading font-bold text-primary/30">
                        {item.product.brand.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.product.brand} · {item.product.unit}</p>
                      <p className="mt-0.5 text-sm font-bold text-foreground">₹{item.product.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-xl border bg-card p-6 h-fit">
                <h2 className="font-heading text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-muted-foreground">
                      <span className="truncate mr-2">{item.product.name} × {item.quantity}</span>
                      <span>₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-4 flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">₹{totalPrice()}</span>
                </div>
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={openCheckout}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Place Order via WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* WhatsApp Checkout Dialog */}
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
    </div>
  );
};

export default CartPage;
