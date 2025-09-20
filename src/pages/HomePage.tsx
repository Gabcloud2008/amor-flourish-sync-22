import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, MessageCircle, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Explorar Feed',
      description: 'Descubre momentos especiales',
      icon: MessageCircle,
      color: 'text-primary',
      bg: 'bg-primary-light',
      action: () => navigate('/app/feed')
    },
    {
      title: 'Frases del Día',
      description: 'Inspiración romántica',
      icon: Sparkles,
      color: 'text-accent-foreground',
      bg: 'bg-accent-light',
      action: () => navigate('/app/quotes')
    },
    {
      title: 'Playlist Compartida',
      description: 'Música para el alma',
      icon: Music,
      color: 'text-primary',
      bg: 'bg-primary-light',
      action: () => navigate('/app/playlists')
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-gradient-romantic rounded-full flex items-center justify-center mb-4 animate-pulse-soft">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-float">
            <Sparkles className="w-3 h-3 text-accent-foreground" />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ¡Hola, {profile?.username || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Bienvenido a tu espacio de conexión y amor
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 animate-slide-up">
        <Card className="card-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">127</div>
            <div className="text-sm text-muted-foreground">Momentos</div>
          </CardContent>
        </Card>
        <Card className="card-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent-foreground mb-1">42</div>
            <div className="text-sm text-muted-foreground">Conexiones</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Acciones Rápidas</h2>
        
        <div className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index} 
                className="card-romantic hover:scale-[1.02] cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={action.action}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-button ${action.bg}`}>
                      <Icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Daily Quote */}
      <Card className="card-romantic animate-fade-in">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Frase del Día</h3>
            <blockquote className="text-sm text-muted-foreground italic leading-relaxed">
              "El amor no es solo mirar el uno al otro, es mirar juntos en la misma dirección."
            </blockquote>
            <p className="text-xs text-muted-foreground mt-2">— Antoine de Saint-Exupéry</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;