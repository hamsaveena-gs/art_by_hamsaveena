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
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm:  z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [success,   setSuccess]   = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setAuthError(null);
    const { error } = await getSupabase().auth.updateUser({
      password: data.password,
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
          <Heading as="h1" className="login-title">Password Updated</Heading>
          <Text variant="muted" className="login-subtitle" as="p">
            Your password has been changed successfully.
          </Text>
          <Button href="/login" variant="primary" className="w-full mt-6">Sign In</Button>
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
          <Heading as="h1" className="login-title">Set New Password</Heading>
          <Text variant="muted" className="login-subtitle">Choose a strong new password</Text>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="login-fields">
            <Input
              label="New Password"
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
            {isSubmitting ? 'Updating…' : 'Update Password'}
          </Button>
        </form>

        {/* Footer */}
        <hr className="login-separator" />
        <Text variant="footnote" className="login-footer-text">
          <a href="/login" className="login-link">Back to Sign In</a>
        </Text>

      </div>
    </div>
  );
}
