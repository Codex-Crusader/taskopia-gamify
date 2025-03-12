
import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Award, 
  Settings, 
  Menu, 
  X
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserProgress } from '@/types';
import LevelProgress from '@/components/LevelProgress';

interface DashboardLayoutProps {
  children: ReactNode;
  progress: UserProgress;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, progress }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare className="h-5 w-5" /> },
    { path: '/rewards', label: 'Rewards', icon: <Award className="h-5 w-5" /> },
  ];
  
  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200
            ${isActive 
              ? 'bg-primary text-primary-foreground font-medium' 
              : 'text-foreground hover:bg-secondary'
            }
          `}
          onClick={() => setIsOpen(false)}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );
  
  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <>
          <header className="glass sticky top-0 z-50 border-b px-4 py-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold">TaskLevels</h1>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <div className="px-2 py-6 space-y-6">
                  <div className="mb-8">
                    <LevelProgress progress={progress} />
                  </div>
                  <nav className="space-y-1.5">
                    <NavItems />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </header>
          <main className="container max-w-4xl py-6 px-4">
            {children}
          </main>
        </>
      ) : (
        <div className="flex">
          <aside className="glass h-screen w-64 fixed left-0 top-0 border-r overflow-y-auto p-6">
            <div className="flex items-center gap-2 mb-8">
              <h1 className="text-xl font-bold">TaskLevels</h1>
            </div>
            
            <div className="mb-8">
              <LevelProgress progress={progress} />
            </div>
            
            <nav className="space-y-1.5">
              <NavItems />
            </nav>
            
            <div className="absolute bottom-6 left-6 right-6">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </aside>
          
          <main className="ml-64 flex-1 p-8">
            {children}
          </main>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
