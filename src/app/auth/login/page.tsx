'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      router.push(redirect);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-text text-3xl sm:text-4xl">Welcome Back</h1>
          <p className="text-text-muted text-sm mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-crimson/10 border border-crimson/30 rounded-lg px-4 py-3 text-crimson text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-hover border border-border rounded-lg px-4 py-3 text-text text-sm placeholder-text-faint"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-hover border border-border rounded-lg px-4 py-3 text-text text-sm placeholder-text-faint"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className={`w-full py-3.5 rounded-lg font-medium text-sm transition-colors ${
              loading ? 'bg-surface-hover text-text-faint cursor-not-allowed' : 'bg-amber hover:bg-amber-hover text-bg'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-text-muted text-sm">
            Don&apos;t have an account?{' '}
            <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-amber hover:text-amber-hover font-medium transition-colors">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
