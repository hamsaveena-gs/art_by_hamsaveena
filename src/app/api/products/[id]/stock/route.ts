import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const NO_CACHE = { 'Cache-Control': 'no-cache, no-store, must-revalidate' };

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('products')
    .select('stock_quantity')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ stock_quantity: 0 }, { headers: NO_CACHE });
  }

  return NextResponse.json({ stock_quantity: data.stock_quantity ?? 0 }, { headers: NO_CACHE });
}
