import { timeAgo } from '../data/seed.ts';
import type { FeedItem, FeedType } from '../types.ts';

interface FeedViewProps {
  feed: FeedItem[];
}

const FEED_LABELS: Record<FeedType, { label: string; colorClass: string }> = {
  result: { label: 'Result', colorClass: 'text-[#33D6A6]' },
  reg: { label: 'Registration', colorClass: 'text-[#F5A623]' },
  info: { label: 'Update', colorClass: 'text-[#7C5CFF]' },
};

export function FeedView({ feed }: FeedViewProps) {
  return (
    <section aria-labelledby="feed-heading" className="space-y-5">
      <div>
        <h1
          id="feed-heading"
          className="font-display text-2xl sm:text-[26px] font-bold text-[#E7E9F5] tracking-tight"
        >
          Live feed
        </h1>
        <p className="text-sm text-[#9198B8] mt-1 max-w-[56ch]">
          Registrations, schedule changes, and results in the order they
          happened.
        </p>
      </div>

      <div className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl px-5 py-2">
        {feed.length === 0 ? (
          <div className="py-10 text-center">
            <h3 className="font-display text-base font-semibold text-[#E7E9F5] mb-1">
              No activity yet
            </h3>
            <p className="text-sm text-[#9198B8]">
              Everything that happens across the portal shows up here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#2A2F4A]">
            {feed.map((item) => {
              const meta = FEED_LABELS[item.type];
              return (
                <div key={item.id} className="py-3.5">
                  <div className="text-sm text-[#E7E9F5]">{item.text}</div>
                  <div className="flex items-center gap-2 text-xs text-[#9198B8] mt-1">
                    <span className={`font-medium ${meta.colorClass}`}>
                      {meta.label}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {timeAgo(item.ts)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
