'use client'; // this component needs interactivity (onClick), so it runs in the browser

import { useState } from 'react';
import { Bell } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function NotifyButton() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleClick() {
    setStatus('sending');

    try {
      const res = await fetch('/api/notify', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message ?? 'Something went wrong. Try again later.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Check your connection.');
    }
  }

  const isDisabled = status === 'sending' || status === 'success';

  return (
    <div className="mt-10">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-neutral-100 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Bell className="h-4 w-4" strokeWidth={1.5} />
        {status === 'sending' ? 'Sending…' : 'Notify Hussain'}
      </button>

      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            status === 'success' ? 'text-emerald-400' : 'text-neutral-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}