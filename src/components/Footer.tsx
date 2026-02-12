import { Phone, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground">K</span>
              </div>
              <div>
                <span className="font-heading text-base font-bold text-foreground">Karnani HoReCa</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium food supplier for Hotels, Restaurants & Cafés in Jaipur.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-body text-sm font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +91 99298 73530
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                info@karnanihoreca.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Jaipur, Rajasthan
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-body text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Products</a></li>
              <li><a href="/cart" className="hover:text-primary transition-colors">Cart</a></li>
              <li><a href="/admin" className="hover:text-primary transition-colors">Admin</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Karnani HoReCa. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
