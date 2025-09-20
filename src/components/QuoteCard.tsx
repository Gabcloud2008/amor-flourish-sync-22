import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share, Star } from 'lucide-react';

interface Quote {
  id: string;
  content_text: string;
  author: string | null;
  category: string;
  created_at: string;
  is_quote_of_day?: boolean;
  tags?: string[];
}

interface QuoteCardProps {
  quote: Quote;
  index: number;
  favoriteQuotes: Set<string>;
  onToggleFavorite: (quoteId: string) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  index,
  favoriteQuotes,
  onToggleFavorite
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cartas': return 'bg-blue-100 text-blue-700';
      case 'poemas': return 'bg-purple-100 text-purple-700';
      case 'frases': return 'bg-primary-light text-primary';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card 
      className={`card-romantic animate-slide-up ${
        quote.is_quote_of_day ? 'ring-2 ring-primary/30 bg-gradient-to-br from-card to-primary-light/20' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Quote of the day indicator */}
          {quote.is_quote_of_day && (
            <div className="flex items-center justify-center mb-4">
              <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs">
                <Star className="w-3 h-3 mr-1" />
                Frase del Día
              </Badge>
            </div>
          )}

          {/* Quote content */}
          <blockquote 
            className={`text-foreground leading-relaxed ${
              quote.is_quote_of_day ? 'text-lg font-medium text-center' : ''
            }`}
          >
            "{quote.content_text}"
          </blockquote>
          
          {/* Author */}
          {quote.author && (
            <p className={`text-muted-foreground text-sm ${
              quote.is_quote_of_day ? 'text-center' : ''
            }`}>
              — {quote.author}
            </p>
          )}

          {/* Tags */}
          {quote.tags && quote.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {quote.tags.map((tag, tagIndex) => (
                <Badge 
                  key={tagIndex} 
                  variant="outline"
                  className="text-xs px-2 py-1 bg-accent-light text-accent-foreground border-accent"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center space-x-2">
              <Badge 
                className={`text-xs px-2 py-1 ${getCategoryColor(quote.category)}`}
              >
                {quote.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(quote.created_at)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onToggleFavorite(quote.id)}
                variant="ghost"
                size="sm"
                className={`p-2 transition-all duration-300 ${
                  favoriteQuotes.has(quote.id) 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-muted-foreground hover:text-red-500'
                }`}
              >
                <Heart 
                  className={`w-4 h-4 transition-all duration-300 ${
                    favoriteQuotes.has(quote.id) ? 'fill-current scale-110' : ''
                  }`} 
                />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="nav-item p-2"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;