import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

export async function POST(request: NextRequest) {
  let body: OrderPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { firstName, lastName, email, phone, address, city, postcode, country, items } = body;

  // ── Use reduce to build totals and item rows ──
  const { subtotal, itemRows } = items.reduce<{ subtotal: number; itemRows: string }>(
    (acc, item) => {
      const lineTotal = item.price * item.quantity;
      return {
        subtotal: acc.subtotal + lineTotal,
        itemRows: acc.itemRows + `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">${item.name}</td>
            <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">₹${lineTotal.toFixed(2)}</td>
          </tr>`,
      };
    },
    { subtotal: 0, itemRows: '' }
  );

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total    = subtotal + shipping;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1c1917;">
      <div style="background:#1c1917;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">New Order Received</h1>
      </div>
      <div style="padding:32px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">

        <h2 style="font-size:16px;margin-bottom:4px;">Customer</h2>
        <p style="margin:0 0 16px;color:#57534e;">
          ${firstName} ${lastName}<br/>
          ${email}<br/>
          ${phone}
        </p>

        <h2 style="font-size:16px;margin-bottom:4px;">Shipping Address</h2>
        <p style="margin:0 0 24px;color:#57534e;">
          ${address}<br/>
          ${city}, ${postcode}<br/>
          ${country}
        </p>

        <h2 style="font-size:16px;margin-bottom:12px;">Order Items</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <thead>
            <tr style="border-bottom:2px solid #1c1917;">
              <th style="text-align:left;padding-bottom:8px;">Item</th>
              <th style="text-align:center;padding-bottom:8px;">Qty</th>
              <th style="text-align:right;padding-bottom:8px;">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
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
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Art Store Orders" <${process.env.EMAIL_USER}>`,
      to: 'hamsa30gs@gmail.com',
      subject: `New Order — ${firstName} ${lastName}`,
      html,
    });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
