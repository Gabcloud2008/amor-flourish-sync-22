import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock, Heart, ArrowLeft } from 'lucide-react';
import authIllustration from '@/assets/auth-illustration.png';
import phoneLoveIllustration from '@/assets/phone-love-illustration.png';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (!error && isLogin) {
        navigate('/app');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (userType: 'admin' | 'user') => {
    if (userType === 'admin') {
      setEmail('gabriel@gmail.com');
      setPassword('123456');
    } else {
      setEmail('love@world.com');
      setPassword('123456');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Demo Buttons */}
      <div className="p-4 flex gap-2">
        <Button
          onClick={() => fillDemoCredentials('admin')}
          variant="outline"
          size="sm"
          className="btn-soft text-xs"
        >
          Demo Admin
        </Button>
        <Button
          onClick={() => fillDemoCredentials('user')}
          variant="outline"
          size="sm"
          className="btn-soft text-xs"
        >
          Demo Usuario
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Main Auth Card */}
          <Card className="card-romantic animate-slide-up">
            <CardContent className="p-0">
              {/* Illustration Header */}
              <div className="bg-gradient-romantic p-8 rounded-t-card text-center">
                <div className="relative">
                  <img 
                    src={isLogin ? authIllustration : phoneLoveIllustration}
                    alt="Romantic illustration"
                    className="w-24 h-24 mx-auto mb-4 animate-float"
                  />
                  <div className="absolute -top-2 -right-2">
                    <Heart className="w-6 h-6 text-primary-foreground animate-pulse-soft" />
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {isLogin 
                      ? 'Conecta con tu corazón' 
                      : 'Únete a nuestra comunidad de amor'
                    }
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="input-romantic pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-romantic pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-romantic w-full mt-6"
                  >
                    {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                  </Button>
                </form>

                {/* Toggle Auth Mode */}
                <div className="text-center mt-6">
                  <p className="text-muted-foreground text-sm">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                  >
                    {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Card - Welcome Message */}
          {!isLogin && (
            <Card className="card-soft animate-fade-in">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <ArrowLeft className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Comparte y recibe
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Mantente siempre conectado con tus seres queridos
                </p>
                <div className="relative">
                  <img 
                    src={phoneLoveIllustration}
                    alt="Love connection"
                    className="w-16 h-16 mx-auto opacity-80"
                  />
                </div>
                <Button
                  onClick={() => setIsLogin(true)}
                  className="btn-soft text-sm"
                >
                  Ya tengo cuenta
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;