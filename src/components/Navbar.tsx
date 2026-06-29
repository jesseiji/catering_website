'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/images/icon-flame.svg" alt="" width={24} height={24} />
            <span className="font-display font-bold text-amber text-base sm:text-lg tracking-wide">
              HMH <span className="text-text-faint font-normal">&times;</span> JWB
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/menu">Menu</NavLink>
            <NavLink href="/order">Order</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            {user ? (
              <>
                <NavLink href="/account">Account</NavLink>
                <button
                  onClick={() => signOut()}
                  className="text-text-muted hover:text-amber transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink href="/auth/login">Sign In</NavLink>
            )}
            <Link
              href="/order"
              className="relative bg-crimson hover:bg-crimson-hover text-text font-medium px-5 py-2 rounded-full transition-colors"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber text-bg text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <Link href="/order" className="relative">
              <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber text-bg text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-text p-1"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border px-4 py-4 space-y-1">
          <MobileLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
          <MobileLink href="/menu" onClick={() => setMenuOpen(false)}>Menu</MobileLink>
          <MobileLink href="/order" onClick={() => setMenuOpen(false)}>Order</MobileLink>
          <MobileLink href="/contact" onClick={() => setMenuOpen(false)}>Contact</MobileLink>
          {user ? (
            <>
              <MobileLink href="/account" onClick={() => setMenuOpen(false)}>Account</MobileLink>
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="block w-full text-left text-text-muted hover:text-amber py-2.5 px-3 text-sm rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <MobileLink href="/auth/login" onClick={() => setMenuOpen(false)}>Sign In</MobileLink>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-text-muted hover:text-text transition-colors text-sm font-medium tracking-wide">
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block text-text hover:text-amber py-2.5 px-3 text-sm font-medium rounded-lg hover:bg-surface-hover transition-colors">
      {children}
    </Link>
  );
}
