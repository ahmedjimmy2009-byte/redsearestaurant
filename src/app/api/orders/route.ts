import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, phone, email, type, payment, address, notes, items, subtotal, delivery_fee, total } = body;
    if (!customer || !phone || !type || !payment || !items?.length)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    if (type === 'delivery' && !address)
      return NextResponse.json({ error: 'Address required for delivery' }, { status: 400 });
    const id = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('orders').insert([{ 
      id, customer, phone, email: email || null, type, payment,
      address: address || null, notes: notes || null,
      items, subtotal, delivery_fee, total, status: 'new',
    }]).select().single();
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }
    return NextResponse.json({ success: true, orderId: id, order: data });
  } catch (err) {
    console.error('Order API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}