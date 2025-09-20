-- Add new columns to quotes table for enhanced functionality (if not exists)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'is_quote_of_day') THEN
    ALTER TABLE public.quotes ADD COLUMN is_quote_of_day boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'tags') THEN
    ALTER TABLE public.quotes ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'priority') THEN
    ALTER TABLE public.quotes ADD COLUMN priority integer DEFAULT 0;
  END IF;
END $$;

-- Create indexes for better performance on filtering (if not exists)
CREATE INDEX IF NOT EXISTS idx_quotes_category ON public.quotes(category);
CREATE INDEX IF NOT EXISTS idx_quotes_tags ON public.quotes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_of_day ON public.quotes(is_quote_of_day) WHERE is_quote_of_day = true;

-- Create function and trigger for single quote of the day per category
CREATE OR REPLACE FUNCTION check_single_quote_of_day() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_quote_of_day = true THEN
    UPDATE public.quotes 
    SET is_quote_of_day = false 
    WHERE category = NEW.category 
    AND id != NEW.id 
    AND is_quote_of_day = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_single_quote_of_day ON public.quotes;
CREATE TRIGGER ensure_single_quote_of_day
  BEFORE INSERT OR UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION check_single_quote_of_day();

-- Enable real-time for quotes table
ALTER TABLE public.quotes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;