import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import mascot from '@/assets/vaijan-mascot.png';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-primary">ভাইজান AI</h1>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/team" className="hover:text-foreground transition-colors">টিম - ভাইজান AI</Link>
            <a href="#" className="hover:text-foreground transition-colors">ফেসবুক গ্রুপ</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/chat" className="flex items-center gap-2 px-5 py-2 border border-border rounded-full text-sm hover:bg-secondary transition-colors">
                আলাপ শুরু করুন <ArrowRight className="w-4 h-4" />
              </Link>
              <UserMenu />
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-5 py-2 border border-border rounded-full text-sm hover:bg-secondary transition-colors">
              আলাপ শুরু করুন <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-primary mb-4">ভাইজান AI</h2>
            <p className="text-xl text-muted-foreground mb-8">এইটা AI না ভাই, এইটা আসলেই ভাই!</p>
            <Link
              to={user ? '/chat' : '/login'}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              আলাপ শুরু করুন <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 bg-primary/80 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <img src={mascot} alt="ভাইজান" className="relative z-10 w-72 md:w-96" width={512} height={640} />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground border-t border-border">
        Designed and Developed with ♥ by <a href="#" className="underline hover:text-foreground">Ritto360</a>
      </footer>
    </div>
  );
}
