import { Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-smooth"
          >
            <div className="bg-gradient-field p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-foreground">AgriAI</h1>
              <p className="text-xs text-muted-foreground">Smart Farming Solutions</p>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;