import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Share, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import CreateQuoteModal from '@/components/CreateQuoteModal';
import QuoteCard from '@/components/QuoteCard';
import FilterTabs from '@/components/FilterTabs';

interface Quote {
  id: string;
  content_text: string;
  author: string | null;
  category: string;
  created_at: string;
  is_quote_of_day?: boolean;
  tags?: string[];
  priority?: number;
}

const QuotesPage = () => {
  const { isAdmin } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteQuotes, setFavoriteQuotes] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isQuoteOfDayModal, setIsQuoteOfDayModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [quoteOfDay, setQuoteOfDay] = useState<Quote | null>(null);

  useEffect(() => {
    fetchQuotes();
    fetchQuoteOfDay();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('quotes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes'
        },
        () => {
          fetchQuotes();
          fetchQuoteOfDay();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQuotes = async () => {
    try {
      let query = supabase
        .from('quotes')
        .select('*');

      // Apply category filter
      if (activeCategory !== 'todos') {
        query = query.eq('category', activeCategory);
      }

      const { data, error } = await query
        .order('is_quote_of_day', { ascending: false })
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Error al cargar las frases');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuoteOfDay = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_quote_of_day', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setQuoteOfDay(data || null);
    } catch (error) {
      console.error('Error fetching quote of day:', error);
    }
  };

  // Refetch quotes when category changes
  useEffect(() => {
    if (!loading) {
      fetchQuotes();
    }
  }, [activeCategory]);

  const toggleFavorite = (quoteId: string) => {
    setFavoriteQuotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(quoteId)) {
        newSet.delete(quoteId);
        toast.success('Frase removida de favoritos');
      } else {
        newSet.add(quoteId);
        toast.success('Frase añadida a favoritos');
      }
      return newSet;
    });
  };

  const getQuoteCounts = () => {
    const allQuotes = quotes;
    return {
      todos: allQuotes.length,
      frases: allQuotes.filter(q => q.category === 'frases').length,
      cartas: allQuotes.filter(q => q.category === 'cartas').length,
      poemas: allQuotes.filter(q => q.category === 'poemas').length,
    };
  };

  const openCreateQuoteModal = (isQuoteOfDay = false) => {
    setIsQuoteOfDayModal(isQuoteOfDay);
    setShowCreateModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-soft animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
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
        <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto animate-pulse-soft">
          <Sparkles className="w-8 h-8 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Frases Románticas</h1>
          <p className="text-muted-foreground">Inspiración para el corazón</p>
        </div>
      </div>

      {/* Daily Special Quote */}
      {quoteOfDay ? (
        <Card className="card-romantic animate-scale-in ring-2 ring-primary/30 bg-gradient-to-br from-card to-primary-light/20">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Frase del Día</span>
              <Star className="w-5 h-5 text-primary" />
            </div>
            <blockquote className="text-lg text-foreground font-medium leading-relaxed">
              "{quoteOfDay.content_text}"
            </blockquote>
            {quoteOfDay.author && (
              <p className="text-muted-foreground text-sm">— {quoteOfDay.author}</p>
            )}
            {quoteOfDay.tags && quoteOfDay.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 pt-2">
                {quoteOfDay.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="nav-item"
                onClick={() => toggleFavorite(quoteOfDay.id)}
              >
                <Heart className={`w-4 h-4 mr-2 ${favoriteQuotes.has(quoteOfDay.id) ? 'fill-current text-red-500' : 'text-primary'}`} />
                <span className="text-sm">Me encanta</span>
              </Button>
              <Button variant="ghost" size="sm" className="nav-item">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isAdmin && (
        <Card className="card-soft animate-scale-in border-2 border-dashed border-primary/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                No hay frase del día
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Crea una frase especial para destacar hoy
              </p>
              <Button 
                onClick={() => openCreateQuoteModal(true)}
                className="btn-romantic"
                size="sm"
              >
                <Star className="w-4 h-4 mr-2" />
                Crear Frase del Día
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <FilterTabs 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        quoteCounts={getQuoteCounts()}
      />

      {/* Quotes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {activeCategory === 'todos' ? 'Todas las Frases' : 
             activeCategory === 'frases' ? 'Frases Románticas' :
             activeCategory === 'cartas' ? 'Cartas de Amor' : 'Poemas'}
          </h2>
          {isAdmin && (
            <Button 
              onClick={() => openCreateQuoteModal(false)}
              className="btn-romantic" 
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Frase
            </Button>
          )}
        </div>

        {quotes.length === 0 ? (
          <Card className="card-soft">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                No hay frases aún
              </h3>
              <p className="text-muted-foreground text-sm">
                Pronto habrá inspiración romântica para ti
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote, index) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                index={index}
                favoriteQuotes={favoriteQuotes}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Quote Modal */}
      {showCreateModal && (
        <CreateQuoteModal
          onClose={() => setShowCreateModal(false)}
          onQuoteCreated={() => {
            fetchQuotes();
            fetchQuoteOfDay();
          }}
          defaultIsQuoteOfDay={isQuoteOfDayModal}
        />
      )}
    </div>
  );
};

export default QuotesPage;