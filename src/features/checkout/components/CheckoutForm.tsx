'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useUser } from '@/hooks/useUser';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import OrderSummary from '@/features/checkout/components/OrderSummary';
import { useRouter } from 'next/navigation';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';

const schema = z.object({
  firstName:  z.string().min(1, 'First name is required').regex(/^[a-zA-Z\s'-]+$/, 'First name must contain only letters'),
  lastName:   z.string().min(1, 'Last name is required').regex(/^[a-zA-Z\s'-]+$/, 'Last name must contain only letters'),
  email:      z.email('Enter a valid email address'),
  phone:      z.string().min(7, 'Enter a valid phone number').max(10, 'Phone number must not exceed 10 digits'),
  address:    z.string().min(5, 'Enter your full street address'),
  city:       z.string().min(1, 'City is required'),
  postcode:   z.string().regex(/^\d{6}$/, 'Postcode must be exactly 6 digits'),
  country:    z.string().min(1, 'Select a country'),
  cardName:   z.string().min(1, 'Name on card is required'),
  cardNumber: z
    .string()
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Enter a valid 16-digit card number'),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY')
    .refine((val) => {
      const [mm, yy] = val.split('/');
      const month = parseInt(mm, 10);
      const year = 2000 + parseInt(yy, 10);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      return year > currentYear || (year === currentYear && month >= currentMonth);
    }, 'Card has expired'),
  cardCvc: z
    .string()
    .regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits'),
});

type FormValues = z.infer<typeof schema>;

const countryOptions = [
  { value: 'AU', label: 'Australia' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'JP', label: 'Japan' },
  { value: 'IN', label: 'India' },
];

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function formatExpiry(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 4)
    .replace(/^(\d{2})(\d)/, '$1/$2');
}

export default function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const price = totalPrice();
  const { firstName, lastName, email, loading } = useUser();
  const [orderError, setOrderError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Prefill shipping fields once the session resolves
  useEffect(() => {
    if (loading) return;
    if (firstName) setValue('firstName', firstName);
    if (lastName)  setValue('lastName',  lastName);
    if (email)     setValue('email',     email);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const onSubmit = async (data: FormValues) => {
    setOrderError(null);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        items: items.map((i) => ({
          name:     i.product.name,
          quantity: i.quantity,
          price:    i.product.price,
        })),
      }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      setOrderError(error || 'Something went wrong');
      return;
    }
    clearCart();
    router.push('/checkout/success');
  };

  if (items.length === 0 && !isSubmitSuccessful) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <Text variant="plain" as="p" className="empty-title">Your cart is empty</Text>
          <Button href="/products" variant="primary" className="mt-6">Shop Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Heading as="h1" className="page-title">Checkout</Heading>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form" noValidate>

          {/* ── Shipping ── */}
          <section className="checkout-section">
            <Heading as="h2" className="checkout-section-title">Shipping Details</Heading>
            <div className="form-row">
              <Input
                label="First Name"
                id="firstName"
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                id="lastName"
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            <Input
              label="Email Address"
              id="email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Phone"
              id="phone"
              type="tel"
              autoComplete="tel"
              maxLength={10}
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Street Address"
              id="address"
              autoComplete="street-address"
              error={errors.address?.message}
              {...register('address')}
            />
            <div className="form-row">
              <Input
                label="City"
                id="city"
                autoComplete="address-level2"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                label="Postcode"
                id="postcode"
                autoComplete="postal-code"
                maxLength={6}
                error={errors.postcode?.message}
                {...register('postcode')}
              />
            </div>
            <Select
              label="Country"
              id="country"
              options={countryOptions}
              placeholder="Select a country"
              error={errors.country?.message}
              {...register('country')}
            />
          </section>

          {/* ── Payment ── */}
          <section className="checkout-section">
            <Heading as="h2" className="checkout-section-title">Payment Details</Heading>
            <Input
              label="Name on Card"
              id="cardName"
              autoComplete="cc-name"
              error={errors.cardName?.message}
              {...register('cardName')}
            />
            <Input
              label="Card Number"
              id="cardNumber"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              error={errors.cardNumber?.message}
              {...register('cardNumber', {
                onChange: (e) =>
                  setValue('cardNumber', formatCardNumber(e.target.value), {
                    shouldValidate: true,
                  }),
              })}
            />
            <div className="form-row">
              <Input
                label="Expiry (MM/YY)"
                id="cardExpiry"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                maxLength={5}
                error={errors.cardExpiry?.message}
                {...register('cardExpiry', {
                  onChange: (e) =>
                    setValue('cardExpiry', formatExpiry(e.target.value), {
                      shouldValidate: true,
                    }),
                })}
              />
              <Input
                label="CVC"
                id="cardCvc"
                autoComplete="cc-csc"
                placeholder="123"
                maxLength={4}
                error={errors.cardCvc?.message}
                {...register('cardCvc')}
              />
            </div>
          </section>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing…' : `Pay ₹${(price + (price >= 150 ? 0 : 50)).toFixed(2)}`}
          </Button>
        </form>

        <OrderSummary items={items} totalPrice={price} />
      </div>
    </div>
  );
}
