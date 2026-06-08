import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CategoryItem } from '@/types';

export async function GET() {
  const { data, error } = await supabase
    .from('categories')
    .select('name, description, image')
    .order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []) as CategoryItem[]);
}
