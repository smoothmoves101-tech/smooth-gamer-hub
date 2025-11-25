-- Create orders table to track token purchases and sales
CREATE TABLE IF NOT EXISTS public.token_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('buy', 'sell')),
  token_amount DECIMAL NOT NULL CHECK (token_amount > 0),
  payment_amount DECIMAL NOT NULL CHECK (payment_amount > 0),
  payment_currency TEXT NOT NULL DEFAULT 'MATIC',
  transaction_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fulfilled_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.token_orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (for presale)
CREATE POLICY "Anyone can create orders"
  ON public.token_orders
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON public.token_orders
  FOR SELECT
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true);

-- Create index for faster queries
CREATE INDEX idx_token_orders_wallet ON public.token_orders(wallet_address);
CREATE INDEX idx_token_orders_status ON public.token_orders(status);
CREATE INDEX idx_token_orders_created ON public.token_orders(created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_token_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_token_orders_timestamp
  BEFORE UPDATE ON public.token_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_token_orders_updated_at();