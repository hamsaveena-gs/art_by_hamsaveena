-- Auto-sync in_stock whenever stock_quantity changes
CREATE OR REPLACE FUNCTION sync_in_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.in_stock := NEW.stock_quantity > 0;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_in_stock
  BEFORE UPDATE OF stock_quantity ON products
  FOR EACH ROW
  EXECUTE FUNCTION sync_in_stock();

-- Atomic decrement with row lock
CREATE OR REPLACE FUNCTION decrement_stock(pid UUID, qty INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_qty INT;
BEGIN
  SELECT stock_quantity INTO current_qty
  FROM products WHERE id = pid FOR UPDATE;

  IF current_qty IS NULL OR current_qty < qty THEN
    RETURN FALSE;
  END IF;

  UPDATE products
  SET stock_quantity = stock_quantity - qty
  WHERE id = pid;

  RETURN TRUE;
END;
$$;
