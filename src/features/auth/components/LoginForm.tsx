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
  email:    z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setAuthError(null);
    const { error } = await getSupabase().auth.signInWithPassword({
      email:    data.email,
      password: data.password,
    });
    if (error) {
      setAuthError(error.message);
      return;
    }
    router.push('/');
  };

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
          <Heading as="h1" className="login-title">Welcome Back</Heading>
          <Text variant="muted" className="login-subtitle">Sign in to continue to your account</Text>
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
            <div>
              <Input
                label="Password"
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="login-forgot-row">
                <a href="#" className="login-link login-link--sm">Forgot password?</a>
              </div>
            </div>
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
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        {/* Footer */}
        <hr className="login-separator" />
        <Text variant="footnote" className="login-footer-text">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="login-link">Sign up free</a>
        </Text>

      </div>
    </div>
  );
}
