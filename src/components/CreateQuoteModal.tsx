import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';

interface CreateQuoteModalProps {
  onClose: () => void;
  onQuoteCreated: () => void;
  defaultIsQuoteOfDay?: boolean;
}

const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({ 
  onClose, 
  onQuoteCreated, 
  defaultIsQuoteOfDay = false 
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('frases');
  const [isQuoteOfDay, setIsQuoteOfDay] = useState(defaultIsQuoteOfDay);
  const [isForEveryone, setIsForEveryone] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const availableTags = [
    'Super para ti',
    'Mega para ti', 
    'Para ti',
    'Especial',
    'Destacada',
    'Favorita'
  ];

  const categories = [
    { value: 'frases', label: 'Frases' },
    { value: 'cartas', label: 'Cartas' },
    { value: 'poemas', label: 'Poemas' }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          content_text: content.trim(),
          author: author.trim() || null,
          category,
          is_quote_of_day: isQuoteOfDay,
          tags: selectedTags,
          priority: isQuoteOfDay ? 1 : 0
        });

      if (error) throw error;

      toast.success(
        isQuoteOfDay 
          ? 'Frase del día creada exitosamente' 
          : 'Frase creada exitosamente'
      );
      onQuoteCreated();
      onClose();
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('Error al crear la frase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="card-romantic max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground flex items-center justify-center gap-2">
            {defaultIsQuoteOfDay ? (
              <>
                <Star className="w-5 h-5 text-primary" />
                Crear Frase del Día
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-primary" />
                Crear Nueva Frase
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm">
            {defaultIsQuoteOfDay 
              ? "Crea una frase especial que se destacará como la frase del día"
              : "Añade una nueva frase romántica a la colección"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Content Textarea */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Contenido de la frase *
            </label>
            <Textarea
              placeholder="Escribe aquí la frase romántica..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-romantic min-h-[100px] resize-none"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Autor (opcional)
            </label>
            <Input
              placeholder="Anónimo"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="input-romantic"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Categoría
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="input-romantic">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border rounded-button">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-4 p-4 bg-card-soft rounded-button">
            <h4 className="text-sm font-medium text-foreground">Opciones</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="quote-of-day"
                checked={isQuoteOfDay}
                onCheckedChange={(checked) => setIsQuoteOfDay(checked as boolean)}
              />
              <label htmlFor="quote-of-day" className="text-sm text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Frase del día
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="for-everyone"
                checked={isForEveryone}
                onCheckedChange={(checked) => setIsForEveryone(checked as boolean)}
              />
              <label htmlFor="for-everyone" className="text-sm text-foreground">
                Frase para todos
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Etiquetas
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card-soft text-muted-foreground hover:bg-primary-light'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground">Seleccionadas:</span>
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="btn-soft flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !content.trim()}
              className="btn-romantic flex-1"
            >
              {loading ? 'Creando...' : (defaultIsQuoteOfDay ? 'Crear Frase del Día' : 'Crear Frase')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteModal;