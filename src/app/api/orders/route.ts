import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSupabase } from '@/lib/supabase';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  items: OrderItem[];
}

const SHIPPING_COST      = 50;
const SHIPPING_THRESHOLD = 150;

function buildItemRows(items: OrderItem[]) {
  return items
    .map((i) => {
      const lineTotal = i.price * i.quantity;
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">${i.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">₹${lineTotal.toFixed(2)}</td>
        </tr>`;
    })
    .join('');
}

function orderHtml(items: OrderItem[], subtotal: number, shipping: number, total: number) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1c1917;">
      <div style="background:#1c1917;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Order Confirmed</h1>
      </div>
      <div style="padding:32px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <p style="color:#57534e;margin:0 0 24px;">Thank you for your order! Here is a summary:</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <thead>
            <tr style="border-bottom:2px solid #1c1917;">
              <th style="text-align:left;padding-bottom:8px;">Item</th>
              <th style="text-align:center;padding-bottom:8px;">Qty</th>
              <th style="text-align:right;padding-bottom:8px;">Price</th>
            </tr>
          </thead>
          <tbody>${buildItemRows(items)}</tbody>
        </table>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:4px 0;color:#57534e;">Subtotal</td>
            <td style="padding:4px 0;text-align:right;">₹${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#57534e;">Shipping</td>
            <td style="padding:4px 0;text-align:right;">${shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</td>
          </tr>
          <tr style="font-weight:700;font-size:16px;border-top:2px solid #1c1917;">
            <td style="padding:12px 0 0;">Total</td>
            <td style="padding:12px 0 0;text-align:right;">₹${total.toFixed(2)}</td>
          </tr>
        </table>
        <p style="color:#57534e;margin-top:24px;">We'll notify you when your order ships.</p>
      </div>
    </div>`;
}

export async function POST(request: NextRequest) {
  let body: OrderPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { firstName, lastName, email, phone, address, city, postcode, country, items } = body;

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total    = subtotal + shipping;

  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  // ── Reserve stock then save order ──
  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('name', item.name)
      .single();

    if (!product) {
      return NextResponse.json({
        error: `Product "${item.name}" not found`,
      }, { status: 400 });
    }

    const { data: ok, error: rpcError } = await supabase.rpc('decrement_stock', {
      pid: product.id,
      qty: item.quantity,
    });

    if (rpcError) {
      console.error('Stock decrement RPC error:', rpcError);
      return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
    }

    if (!ok) {
      return NextResponse.json({
        error: `Insufficient stock for "${item.name}"`,
      }, { status: 409 });
    }
  }

  const { error: dbError } = await supabase.from('orders').insert({
    user_id:    session?.user?.id ?? null,
    first_name: firstName,
    last_name:  lastName,
    email,
    phone,
    address,
    city,
    postcode,
    country,
    items,
    subtotal,
    shipping,
    total,
  });

  if (dbError) {
    console.error('Order insert error (stock already reserved):', dbError);
  }

  // ── Send emails (non-blocking — order is already saved) ──
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const adminHtml = orderHtml(items, subtotal, shipping, total);
    const customerHtml = orderHtml(items, subtotal, shipping, total);

    await Promise.allSettled([
      transporter.sendMail({
        from: `"Art Store Orders" <${process.env.EMAIL_USER}>`,
        to: 'hamsa30gs@gmail.com',
        subject: `New Order — ${firstName} ${lastName}`,
        html: adminHtml,
      }),
      transporter.sendMail({
        from: `"Art by Hamsaveena" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your order is confirmed!',
        html: customerHtml,
      }),
    ]);
  } catch (err) {
    console.error('Email send error (order already saved):', err);
  }

  return NextResponse.json({ success: true });
}
