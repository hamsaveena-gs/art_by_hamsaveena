import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(row: any): Product {
  return {
    id:            row.id,
    name:          row.name,
    slug:          row.slug,
    category:      row.category,
    price:         row.price,
    originalPrice: row.original_price ?? undefined,
    image:         row.image,
    images:        row.images,
    description:   row.description,
    dimensions:    row.dimensions,
    medium:        row.medium,
    tags:          row.tags,
    inStock:       row.in_stock,
    featured:      row.featured,
    rating:        row.rating,
    reviews:       row.reviews,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(mapProduct(data));
}
