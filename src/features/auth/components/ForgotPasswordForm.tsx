'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { getSupabase } from '@/lib/supabase';

const schema = z.object({
  email: z.email('Enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [success,   setSuccess]   = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setAuthError(null);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const redirectTo = `${origin}/reset-password`;
    const { error } = await getSupabase().auth.resetPasswordForEmail(data.email, {
      redirectTo,
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
            We sent a password reset link to your email. It expires in 1 hour.
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
          <Heading as="h1" className="login-title">Reset Password</Heading>
          <Text variant="muted" className="login-subtitle">Enter your email to receive a reset link</Text>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="login-fields">
            <Input
              label="Email Address"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
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
            {isSubmitting ? 'Sending…' : 'Send Reset Link'}
          </Button>
        </form>

        {/* Footer */}
        <hr className="login-separator" />
        <Text variant="footnote" className="login-footer-text">
          Remember your password?{' '}
          <a href="/login" className="login-link">Sign in</a>
        </Text>

      </div>
    </div>
  );
}
