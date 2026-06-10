ALTER TABLE products
  ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 1;

UPDATE products SET stock_quantity = 0 WHERE in_stock = false;
