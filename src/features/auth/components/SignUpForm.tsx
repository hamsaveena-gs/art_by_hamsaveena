'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { getSupabase } from '@/lib/supabase';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required').regex(/^[a-zA-Z\s'-]+$/, 'Letters only'),
  lastName:  z.string().min(1, 'Last name is required').regex(/^[a-zA-Z\s'-]+$/, 'Letters only'),
  email:     z.email('Enter a valid email address'),
  password:  z.string().min(6, 'Password must be at least 6 characters'),
  confirm:   z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

type FormValues = z.infer<typeof schema>;

export default function SignUpForm() {
  const router = useRouter();
  const [authError, setAuthError]   = useState<string | null>(null);
  const [success,   setSuccess]     = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setAuthError(null);

    const res = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email }),
    });
    const { exists } = await res.json();

    if (exists) {
      setAuthError('An account with this email already exists');
      return;
    }

    const { error } = await getSupabase().auth.signUp({
      email:    data.email,
      password: data.password,
      options:  { data: { first_name: data.firstName, last_name: data.lastName } },
    });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <div className="success-icon" style={{ margin: '0 auto 1.5rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <Heading as="h1" className="login-title">Check your email</Heading>
          <Text variant="muted" className="login-subtitle" as="p">
            We sent a confirmation link to your email. Please verify to continue.
          </Text>
          <Button href="/login" variant="primary" className="w-full mt-6">Back to Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Brand */}
        <div className="login-brand-top">
          <span className="login-brand-name">Art by Hamsaveena</span>
          <p className="login-brand-tagline">Curated art for every space</p>
        </div>

        {/* Header */}
        <div className="login-header">
          <Heading as="h1" className="login-title">Create Account</Heading>
          <Text variant="muted" className="login-subtitle">Join to start your collection</Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="login-fields">
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
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Min. 6 characters"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              error={errors.confirm?.message}
              {...register('confirm')}
            />
          </div>

          {authError && (
            <p className="login-error" role="alert">{authError}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        {/* Footer */}
        <hr className="login-separator" />
        <Text variant="footnote" className="login-footer-text">
          Already have an account?{' '}
          <a href="/login" className="login-link">Sign in</a>
        </Text>

      </div>
    </div>
  );
}
