import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mapProduct } from '@/lib/mapProduct';

const NO_CACHE = { 'Cache-Control': 'no-cache, no-store, must-revalidate' };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const price    = searchParams.get('price');
  const q        = searchParams.get('q');
  const featured = searchParams.get('featured');

  let query = supabase.from('products').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  if (featured === 'true') {
    query = query.eq('featured', true);
  }

  if (price) {
    const [minStr, maxStr] = price.split('-');
    const min = minStr ? Number(minStr) : 0;
    if (maxStr) {
      query = query.gte('price', min).lte('price', Number(maxStr));
    } else {
      query = query.gte('price', min);
    }
  }

  if (q) {
    query = query.or(`name.ilike.%${q}%,tags.cs.{${q}}`);
  }

  const { data, error } = await query.order('id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  }

  return NextResponse.json((data ?? []).map(mapProduct), { headers: NO_CACHE });
}
