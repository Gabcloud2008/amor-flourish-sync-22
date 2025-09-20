import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Quote, Music, User } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/app' },
  { id: 'feed', label: 'Feed', icon: MessageSquare, path: '/app/feed' },
  { id: 'quotes', label: 'Frases', icon: Quote, path: '/app/quotes' },
  { id: 'playlists', label: 'Playlist', icon: Music, path: '/app/playlists' },
  { id: 'profile', label: 'Perfil', icon: User, path: '/app/profile' },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 px-2 py-3 safe-area-bottom animate-slide-up">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center space-y-1 p-3 rounded-button group overflow-hidden transition-[var(--transition-bounce)] ${
                isActive 
                  ? 'bg-primary-light/60 backdrop-blur-sm transform scale-110 shadow-soft' 
                  : 'hover:bg-primary-light/30 hover:scale-105 hover:shadow-soft'
              }`}
            >
              {/* Ripple effect background */}
              <div className={`absolute inset-0 rounded-button transition-all duration-500 ${
                isActive 
                  ? 'bg-gradient-to-br from-primary/20 to-primary-soft/20 scale-100 opacity-100' 
                  : 'bg-gradient-to-br from-primary/10 to-primary-soft/10 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100'
              }`} />
              
              {/* Icon with enhanced animations */}
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-[var(--transition-smooth)] ${
                    isActive 
                      ? 'text-primary animate-pulse-soft' 
                      : 'text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5'
                  }`} 
                />
              </div>
              
              {/* Label with slide animation */}
              <span 
                className={`relative text-xs font-medium transition-[var(--transition-smooth)] ${
                  isActive 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground group-hover:text-primary group-hover:translate-y-0.5'
                }`}
              >
                {item.label}
              </span>
              
              {/* Active indicator with enhanced animation */}
              {isActive && (
                <div className="absolute -bottom-1 w-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-scale-in" />
              )}
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-button transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/5' 
                  : 'bg-transparent group-hover:bg-primary/5 group-hover:shadow-romantic'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;