import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    return NextResponse.json({ stock_quantity: 0 });
  }

  return NextResponse.json({ stock_quantity: data.stock_quantity ?? 0 });
}
