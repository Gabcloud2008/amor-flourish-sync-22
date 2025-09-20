import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Heart, LogOut, Shield, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const stats = [
    { label: 'Publicaciones', value: '12', icon: Heart },
    { label: 'Momentos', value: '45', icon: Camera },
    { label: 'Conexiones', value: '2', icon: User },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Profile Header */}
      <Card className="card-romantic animate-fade-in">
        <CardContent className="p-6 text-center space-y-4">
          {/* Avatar */}
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-romantic rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary-foreground">
                {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse-soft">
                <Shield className="w-4 h-4 text-accent-foreground" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {profile?.username || user?.email?.split('@')[0] || 'Usuario'}
            </h1>
            <p className="text-muted-foreground text-sm mb-2">
              {user?.email}
            </p>
            {isAdmin && (
              <span className="inline-flex items-center space-x-1 bg-accent-light text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                <span>Administrador</span>
              </span>
            )}
          </div>

          {/* Bio */}
          {profile?.bio && (
            <p className="text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 animate-slide-up">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-soft">
              <CardContent className="p-4 text-center">
                <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Profile Actions */}
      <div className="space-y-3 animate-scale-in">
        <Card className="card-soft">
          <CardContent className="p-0">
            <Button 
              variant="ghost" 
              className="w-full justify-start p-4 nav-item rounded-card"
            >
              <User className="w-5 h-5 mr-3" />
              <span>Editar Perfil</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="p-0">
            <Button 
              variant="ghost" 
              className="w-full justify-start p-4 nav-item rounded-card"
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Configuración</span>
            </Button>
          </CardContent>
        </Card>

        {/* Admin Section */}
        {isAdmin && (
          <Card className="card-romantic">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Panel de Administrador</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Tienes acceso completo para crear y gestionar contenido
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/app/feed')}
                  className="btn-soft w-full justify-start"
                >
                  Gestionar Publicaciones
                </Button>
                <Button 
                  onClick={() => navigate('/app/quotes')}
                  className="btn-soft w-full justify-start"
                >
                  Gestionar Frases
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logout */}
        <Card className="card-soft">
          <CardContent className="p-0">
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="w-full justify-start p-4 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-card"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Cerrar Sesión</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <Card className="card-soft animate-fade-in">
        <CardContent className="p-6 text-center space-y-3">
          <Heart className="w-8 h-8 text-primary mx-auto" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Amor & Conexión
            </h3>
            <p className="text-muted-foreground text-sm">
              Comparte momentos especiales con quienes más amas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;