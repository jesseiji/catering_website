'use client';

import { useState, type FormEvent } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get('name'),
      contact: formData.get('contact'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
          <h1 className="font-display font-bold text-text text-4xl sm:text-5xl">
            Get in Touch
          </h1>
          <div className="w-10 h-0.5 bg-gold mx-auto mt-4" />
          <p className="text-text-muted text-sm mt-4">
            Questions, feedback, or special requests — we&apos;d love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="bg-surface rounded-xl border border-border p-10 text-center">
            <h2 className="font-display font-bold text-text text-2xl mb-2">Message Sent</h2>
            <p className="text-text-muted text-sm">We&apos;ll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5">Name *</label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-3 text-text text-sm placeholder-text-faint"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5">Email or Phone *</label>
              <input
                name="contact"
                type="text"
                required
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-3 text-text text-sm placeholder-text-faint"
                placeholder="your@email.com or (301) 555-0123"
              />
            </div>

            <div>
              <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5">Message *</label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-3 text-text text-sm placeholder-text-faint resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-medium text-sm transition-colors ${
                loading
                  ? 'bg-surface-hover text-text-faint cursor-not-allowed'
                  : 'bg-hot hover:bg-hot-hover text-text'
              }`}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center space-y-2">
          <p className="text-text-faint text-sm">Or reach us directly:</p>
          <p className="text-text-muted text-sm">
            <a href="tel:3015325406" className="hover:text-gold transition-colors">301-532-5406</a>
            {' '}&bull;{' '}
            <a href="tel:2407306937" className="hover:text-gold transition-colors">240-730-6937</a>
          </p>
        </div>
      </div>
    </div>
  );
}
