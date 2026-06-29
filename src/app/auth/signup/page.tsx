'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>}>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const { error: err } = await signUp(email, password);
    if (err) { setError(err); setLoading(false); }
    else { router.push(redirect); }
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-text text-3xl sm:text-4xl">Create Account</h1>
          <p className="text-text-muted text-sm mt-2">Sign up to place orders and save your history</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-hot/10 border border-hot/30 rounded-lg px-4 py-3 text-hot text-sm">{error}</div>
          )}

          <div>
            <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-hover border border-border rounded-lg px-4 py-3 text-text text-sm placeholder-text-faint" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-hover border border-border rounded-lg px-4 py-3 text-text text-sm placeholder-text-faint" placeholder="At least 6 characters" />
          </div>
          <div>
            <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5">Confirm Password</label>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-surface-hover border border-border rounded-lg px-4 py-3 text-text text-sm placeholder-text-faint" placeholder="Confirm your password" />
          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-3.5 rounded-lg font-medium text-sm transition-colors ${
              loading ? 'bg-surface-hover text-text-faint cursor-not-allowed' : 'bg-gold hover:bg-gold-hover text-bg'
            }`}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-text-muted text-sm">
            Already have an account?{' '}
            <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-gold hover:text-gold-hover font-medium transition-colors">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
