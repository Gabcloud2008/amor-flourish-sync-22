import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageCircle, Share, MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CreatePostModal from '@/components/CreatePostModal';
import LikeButton from '@/components/LikeButton';

interface Post {
  id: string;
  content_text: string;
  media_urls: string[] | null;
  media_type: string | null;
  created_at: string;
  user_id: string;
}

const FeedPage = () => {
  const { isAdmin, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchPosts();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched posts:', data);
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error al cargar las publicaciones');
      setPosts([]); // Ensure posts is always an array
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!isAdmin) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      toast.success('Publicación eliminada');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error al eliminar la publicación');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} horas`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 backdrop-blur-sm">
          <h1 className="text-xl font-semibold text-foreground">Feed</h1>
        </div>
        <div className="pb-20 px-4 pt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-romantic animate-pulse">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 p-4">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-20 mb-2" />
                    <div className="h-2 bg-muted rounded w-16" />
                  </div>
                </div>
                <div className="w-full h-64 bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed Instagram-style */}
      <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Feed</h1>
          
          {isAdmin && (
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="btn-romantic"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear
            </Button>
          )}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="pb-20 px-4 pt-4 space-y-6">
        {posts.length === 0 ? (
          <Card className="card-soft">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-lg">
                No hay publicaciones aún
              </h3>
              <p className="text-muted-foreground text-sm">
                {isAdmin 
                  ? 'Sé el primero en compartir algo especial'
                  : 'Pronto habrá contenido nuevo para ti'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post, index) => (
            <Card 
              key={post.id} 
              className="bg-card border-0 rounded-3xl overflow-hidden shadow-card animate-slide-up hover:shadow-romantic transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                {/* Instagram-style Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 relative">
                      {/* Story ring gradient */}
                      <div className="absolute inset-0 bg-gradient-romantic rounded-full p-[2px]">
                        <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-gradient-romantic rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xs">
                              G
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-semibold text-foreground text-sm">
                          gabriel
                        </h4>
                        {/* Verified badge */}
                        <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                          <svg 
                            className="w-2 h-2 text-primary-foreground" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {isAdmin && (
                      <Button
                        onClick={() => deletePost(post.id)}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive p-1 hover:bg-destructive/10 rounded-full transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted/50 rounded-full transition-all duration-200"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Post Media */}
                {post.media_urls && post.media_urls.length > 0 && (
                  <div className="w-full bg-muted/20">
                    {post.media_urls.map((url, idx) => (
                      <div key={idx} className="w-full">
                        {post.media_type === 'image' ? (
                          <img
                            src={url}
                            alt="Post content"
                            className="w-full h-auto object-cover max-h-[500px]"
                            onError={(e) => {
                              console.error('Error loading image:', url);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : post.media_type === 'video' ? (
                          <video
                            src={url}
                            controls
                            className="w-full h-auto max-h-[500px]"
                            onError={(e) => {
                              console.error('Error loading video:', url);
                            }}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}

                  {/* Instagram-style Actions */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <LikeButton 
                        postId={post.id}
                        size="lg"
                        showCount={true}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 text-foreground hover:text-muted-foreground hover:bg-transparent transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <MessageCircle className="w-6 h-6" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 text-foreground hover:text-primary hover:bg-transparent transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <Share className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  {post.content_text && (
                    <div className="text-sm leading-relaxed">
                      <span className="font-semibold text-foreground mr-1">gabriel</span>
                      <span className="text-foreground">{post.content_text}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={fetchPosts}
        />
      )}
    </div>
  );
};

export default FeedPage;