import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Heart, Share, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Playlist {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  songs: any;
  is_public: boolean;
  created_at: string;
}

const PlaylistsPage = () => {
  const { isAdmin } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Error al cargar las playlists');
    } finally {
      setLoading(false);
    }
  };

  const mockPlaylists = [
    {
      id: '1',
      title: 'Canciones de Amor',
      description: 'Las mejores baladas románticas para momentos especiales',
      songCount: 24,
      duration: '1h 32m',
      cover: '🎵'
    },
    {
      id: '2', 
      title: 'Momentos Íntimos',
      description: 'Música suave para esos momentos a solas',
      songCount: 18,
      duration: '54m',
      cover: '💕'
    },
    {
      id: '3',
      title: 'Recuerdos Compartidos',
      description: 'Canciones que nos traen lindos recuerdos',
      songCount: 31,
      duration: '2h 8m',
      cover: '🌟'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-soft animate-pulse">
              <CardContent className="p-4 flex space-x-4">
                <div className="w-16 h-16 bg-muted rounded-card" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-gradient-romantic rounded-full flex items-center justify-center mx-auto animate-pulse-soft">
          <Music className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Playlists Compartidas</h1>
          <p className="text-muted-foreground">Música para el alma</p>
        </div>
      </div>

      {/* Currently Playing */}
      <Card className="card-romantic animate-scale-in">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-accent rounded-card flex items-center justify-center">
              <Music className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Reproduciendo ahora</h3>
              <p className="text-muted-foreground text-sm">Perfect - Ed Sheeran</p>
            </div>
            <Button className="btn-romantic" size="sm">
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Playlists */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Nuestras Playlists</h2>
          {isAdmin && (
            <Button className="btn-romantic" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Crear
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {mockPlaylists.map((playlist, index) => (
            <Card 
              key={playlist.id}
              className="card-romantic hover:scale-[1.02] cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Playlist Cover */}
                  <div className="w-16 h-16 bg-gradient-soft rounded-card flex items-center justify-center text-2xl">
                    {playlist.cover}
                  </div>
                  
                  {/* Playlist Info */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-foreground">
                      {playlist.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {playlist.description}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Music className="w-3 h-3" />
                        <span>{playlist.songCount} canciones</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{playlist.duration}</span>
                      </span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <Button className="btn-romantic" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>

                {/* Playlist Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/30">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="nav-item">
                      <Heart className="w-4 h-4 mr-2" />
                      <span className="text-sm">Me gusta</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="nav-item">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {playlists.length === 0 && mockPlaylists.length === 0 && (
          <Card className="card-soft">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                No hay playlists aún
              </h3>
              <p className="text-muted-foreground text-sm">
                Pronto habrá música especial para compartir
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlaylistsPage;