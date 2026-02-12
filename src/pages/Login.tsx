import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Chrome, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-secondary/30">
        <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <span className="text-lg font-bold text-primary-foreground">K</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {user ? 'Welcome!' : 'Welcome Back'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user ? user.email : 'Sign in to Karnani HoReCa'}
            </p>
          </div>

          {user ? (
            <div className="space-y-3">
              {isAdmin && (
                <Button className="w-full" size="lg" onClick={() => navigate('/admin')}>
                  Go to Admin Panel
                </Button>
              )}
              <Button className="w-full" size="lg" variant="outline" onClick={signOut}>
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button className="w-full" size="lg" variant="outline" onClick={handleGoogleLogin}>
              <Chrome className="mr-2 h-5 w-5" />
              Login with Google
            </Button>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
