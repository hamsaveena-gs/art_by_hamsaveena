import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const CACHE_HEADERS = { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([], { headers: CACHE_HEADERS });
  }

  const { data, error } = await supabase
    .from('products')
    .select('name, tags')
    .or(`name.ilike.%${q}%,tags.cs.{${q}}`)
    .limit(10);

  if (error) {
    return NextResponse.json([], { status: 500, headers: CACHE_HEADERS });
  }

  const suggestions: string[] = [];

  // Add matching product names first
  for (const row of data ?? []) {
    if (row.name.toLowerCase().includes(q.toLowerCase())) {
      suggestions.push(row.name);
    }
  }

  // Add matching tags (deduplicated)
  for (const row of data ?? []) {
    const tags: string[] = Array.isArray(row.tags) ? row.tags : [];
    for (const tag of tags) {
      if (
        tag.toLowerCase().includes(q.toLowerCase()) &&
        !suggestions.includes(tag)
      ) {
        suggestions.push(tag);
      }
    }
  }

  // Deduplicate names (case-insensitive) and cap at 8
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of suggestions) {
    const key = s.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(s);
    }
    if (result.length === 8) break;
  }

  return NextResponse.json(result, { headers: CACHE_HEADERS });
}
