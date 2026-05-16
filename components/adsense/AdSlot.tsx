'use client';
import { useEffect } from 'react';
import { SITE } from '@/lib/format';

declare global { interface Window { adsbygoogle: unknown[] } }

export function AdSlot({ slot, format = 'auto', responsive = true }: {
  slot: string; format?: string; responsive?: boolean;
}) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);

  if (!SITE.adsenseClient) {
    return (
      <div className="ad-slot" role="complementary" aria-label="advertisement">
        <span className="badge">AD · {slot}</span>
        <div className="size">애드센스 PUB ID 미설정 (.env.local 참조)</div>
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', margin: '32px 0' }}
      data-ad-client={SITE.adsenseClient}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
