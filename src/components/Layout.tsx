import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      <main className="flex-1">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;