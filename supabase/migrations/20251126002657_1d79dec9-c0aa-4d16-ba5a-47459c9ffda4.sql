-- Add liquidity tracking to token_orders
ALTER TABLE public.token_orders
ADD COLUMN liquidity_added BOOLEAN NOT NULL DEFAULT false;

-- Create an index for efficient querying of pending liquidity additions
CREATE INDEX idx_token_orders_liquidity_pending ON public.token_orders(liquidity_added) 
WHERE liquidity_added = false;