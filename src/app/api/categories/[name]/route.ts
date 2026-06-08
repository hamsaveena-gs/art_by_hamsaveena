import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CategoryItem } from '@/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !('image' in body) ||
    typeof (body as Record<string, unknown>).image !== 'string' ||
    !(body as Record<string, unknown>).image
  ) {
    return NextResponse.json(
      { error: 'Body must contain a non-empty "image" string' },
      { status: 400 }
    );
  }

  const image = (body as { image: string }).image;

  const { data, error } = await supabase
    .from('categories')
    .update({ image })
    .eq('name', categoryName)
    .select('name, description, image')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: `Category "${categoryName}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(data as CategoryItem);
}
