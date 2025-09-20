import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  quoteCounts?: {
    todos: number;
    frases: number;
    cartas: number;
    poemas: number;
  };
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  activeCategory,
  onCategoryChange,
  quoteCounts
}) => {
  const categories = [
    { id: 'todos', label: 'Todos', icon: '📝', color: 'bg-gradient-romantic' },
    { id: 'frases', label: 'Frases', icon: '💭', color: 'bg-gradient-soft' },
    { id: 'cartas', label: 'Cartas', icon: '💌', color: 'bg-gradient-accent' },
    { id: 'poemas', label: 'Poemas', icon: '📜', color: 'bg-primary-light' }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Explora por Categoría</h3>
        <p className="text-sm text-muted-foreground">Encuentra la inspiración perfecta para ti</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const count = quoteCounts ? quoteCounts[category.id as keyof typeof quoteCounts] : 0;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                isActive 
                  ? 'bg-gradient-romantic text-primary-foreground shadow-romantic scale-105 ring-2 ring-primary/30' 
                  : 'bg-card hover:bg-card-soft border border-border/50 hover:border-primary/30 shadow-soft hover:shadow-card'
              }`}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className={`text-sm font-medium ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {category.label}
                </div>
                
                {quoteCounts && count > 0 && (
                  <Badge 
                    className={`text-xs px-2 py-1 ${
                      isActive 
                        ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30' 
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}
                  >
                    {count} {count === 1 ? 'frase' : 'frases'}
                  </Badge>
                )}
              </div>
              
              {isActive && (
                <div className="absolute inset-0 bg-gradient-romantic opacity-10 rounded-2xl animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterTabs;