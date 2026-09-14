-- Add the customer-facing order number while preserving orders.id UUIDs.
-- Run this migration once against an existing database.
BEGIN;

ALTER TABLE orders
  ADD COLUMN order_number BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1001);

-- Assign stable numbers to existing rows before enforcing NOT NULL/uniqueness.
WITH numbered AS (
  SELECT id, 1000 + ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS number
  FROM orders
)
UPDATE orders
SET order_number = numbered.number
FROM numbered
WHERE orders.id = numbered.id;

ALTER TABLE orders
  ALTER COLUMN order_number SET NOT NULL,
  ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);

-- The next generated value must follow the assigned legacy values, or remain 1001
-- when the table was empty. The identity sequence is concurrency-safe.
SELECT setval(
  pg_get_serial_sequence('orders', 'order_number'),
  COALESCE((SELECT MAX(order_number) FROM orders), 1000),
  true
);

COMMIT;
