import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    return NextResponse.json({ exists: false }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
  );

  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const exists = !error && (data?.users?.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  ) ?? false);

  return NextResponse.json({ exists });
}
