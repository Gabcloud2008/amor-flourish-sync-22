import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface LikeButtonProps {
  postId: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  postId, 
  size = 'md', 
  showCount = false,
  className = '' 
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkLikeStatus();
    }
    fetchLikeCount();
    
    // Set up real-time subscription for likes
    const channel = supabase
      .channel(`likes-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchLikeCount();
          if (user) {
            checkLikeStatus();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, user]);

  const checkLikeStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      // No like found, which is fine
      setIsLiked(false);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) throw error;
      setLikeCount(count || 0);
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const toggleLike = async () => {
    if (!user) return;
    if (loading) return; // Prevent double clicks

    setLoading(true);

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
        // Update state optimistically
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // Like - check if already exists first
        const { data: existingLike } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingLike) {
          const { error } = await supabase
            .from('likes')
            .insert({
              post_id: postId,
              user_id: user.id
            });

          if (error && error.code !== '23505') throw error; // Ignore duplicate key errors
          
          // Update state optimistically
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic updates on error
      checkLikeStatus();
      fetchLikeCount();
    } finally {
      setLoading(false);
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-7 h-7';
      default: return 'w-6 h-6';
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleLike}
        disabled={loading}
        className={`p-0 transition-all duration-300 hover:bg-transparent active:scale-95 ${
          isLiked 
            ? 'text-primary hover:text-primary-soft animate-scale-in' 
            : 'text-foreground hover:text-primary'
        }`}
      >
        <Heart 
          className={`${getIconSize()} transition-all duration-300 ${
            isLiked ? 'fill-current scale-110 drop-shadow-soft' : 'hover:scale-105'
          }`} 
        />
      </Button>
      
      {showCount && (
        <span className="text-sm font-semibold text-foreground animate-fade-in">
          {likeCount > 0 ? `${likeCount} ${likeCount === 1 ? 'like' : 'likes'}` : 'Se el primero en dar like'}
        </span>
      )}
    </div>
  );
};

export default LikeButton;