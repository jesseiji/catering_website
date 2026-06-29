'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!endpoint) {
      alert('Contact form is not configured yet. Please call or text us directly!');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try calling us directly.');
      }
    } catch {
      alert('Something went wrong. Please try calling us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display font-black text-gold text-glow-gold text-4xl sm:text-5xl mb-3">
            Get in Touch
          </h1>
          <p className="text-cream-dim text-base">
            Questions, feedback, or special requests — we&apos;d love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="bg-charcoal rounded-2xl border border-gold/20 p-10 text-center">
            <div className="flex justify-center mb-4">
              <Image src="/images/icon-flame.svg" alt="" width={40} height={40} />
            </div>
            <h2 className="font-display font-bold text-gold text-2xl mb-2">Message Sent!</h2>
            <p className="text-cream-dim text-sm">We&apos;ll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-charcoal rounded-2xl border border-gold/10 p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                Name *
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream-dim/40"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                Email or Phone *
              </label>
              <input
                name="contact"
                type="text"
                required
                className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream-dim/40"
                placeholder="your@email.com or (301) 555-0123"
              />
            </div>

            <div>
              <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream-dim/40 resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all ${
                loading
                  ? 'bg-charcoal-light text-cream-dim/40 cursor-not-allowed'
                  : 'bg-red hover:bg-red-glow text-cream hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        {/* Direct contact info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-cream-dim text-sm">Or reach us directly:</p>
          <p className="text-cream text-sm">
            <a href="tel:3015325406" className="hover:text-gold transition-colors">301-532-5406</a>
            {' '}&bull;{' '}
            <a href="tel:2407306937" className="hover:text-gold transition-colors">240-730-6937</a>
          </p>
        </div>
      </div>
    </div>
  );
}
