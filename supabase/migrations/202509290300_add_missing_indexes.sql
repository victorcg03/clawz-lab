-- Migration: Add missing indexes for foreign keys
-- File: 202509290300_add_missing_indexes.sql
-- Description: Add indexes for foreign key columns to improve query performance

-- Add indexes for cart_items table
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- Add indexes for custom_request_media table  
CREATE INDEX IF NOT EXISTS idx_custom_request_media_request_id ON custom_request_media(request_id);

-- Add indexes for messages table
CREATE INDEX IF NOT EXISTS idx_messages_request_id ON messages(request_id);

-- Add indexes for order_items table
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Add indexes for orders table
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Add indexes for product_variants table
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- Add indexes for quotes table
CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON quotes(request_id);

-- Comment explaining the performance improvement
COMMENT ON INDEX idx_cart_items_cart_id IS 'Improves performance for cart item queries by cart_id';
COMMENT ON INDEX idx_custom_request_media_request_id IS 'Improves performance for custom request media queries';
COMMENT ON INDEX idx_messages_request_id IS 'Improves performance for message queries by request_id';
COMMENT ON INDEX idx_order_items_order_id IS 'Improves performance for order item queries by order_id';
COMMENT ON INDEX idx_orders_user_id IS 'Improves performance for order queries by user_id';
COMMENT ON INDEX idx_product_variants_product_id IS 'Improves performance for product variant queries';
COMMENT ON INDEX idx_quotes_request_id IS 'Improves performance for quote queries by request_id';