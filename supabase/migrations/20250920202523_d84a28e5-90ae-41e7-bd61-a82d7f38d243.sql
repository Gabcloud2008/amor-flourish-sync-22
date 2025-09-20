-- Add new columns to quotes table for enhanced functionality
ALTER TABLE public.quotes 
ADD COLUMN is_quote_of_day boolean DEFAULT false,
ADD COLUMN tags text[] DEFAULT '{}',
ADD COLUMN priority integer DEFAULT 0;

-- Create index for better performance on filtering
CREATE INDEX idx_quotes_category ON public.quotes(category);
CREATE INDEX idx_quotes_tags ON public.quotes USING GIN(tags);
CREATE INDEX idx_quotes_quote_of_day ON public.quotes(is_quote_of_day) WHERE is_quote_of_day = true;

-- Add check constraint to ensure only one quote of the day per category at a time
CREATE OR REPLACE FUNCTION check_single_quote_of_day() RETURNS TRIGGER AS $$
BEGIN
  -- If setting as quote of the day, unset others in the same category
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

CREATE TRIGGER ensure_single_quote_of_day
  BEFORE INSERT OR UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION check_single_quote_of_day();

-- Enable real-time for quotes
ALTER TABLE public.quotes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;

-- Enable real-time for likes
ALTER TABLE public.likes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;