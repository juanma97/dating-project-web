import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '../utils/analytics';

type DepthMilestone = 25 | 50 | 75 | 100;

interface UseScrollDepthOptions {
  /** Called when scroll reaches this % threshold. Used to trigger the StickyBar.
   *  Defaults to 40 — fires once after the user has seen enough content to judge. */
  stickyTriggerPct?: number;
  onStickyTrigger?: () => void;
}

/**
 * CRO: Measures how far down users scroll before bouncing.
 * Replaces the old 3s timer for the StickyBar with an intent-based trigger:
 * a user who scrolled 40% is far more qualified than one who waited 3 seconds.
 */
export const useScrollDepth = ({
  stickyTriggerPct = 40,
  onStickyTrigger,
}: UseScrollDepthOptions = {}): void => {
  const firedMilestones = useRef<Set<number>>(new Set());
  const stickyFired = useRef(false);

  useEffect(() => {
    const GA4_MILESTONES: DepthMilestone[] = [25, 50, 75, 100];

    const getScrollPct = (): number => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return 0;
      return Math.round((scrollTop / docHeight) * 100);
    };

    const handleScroll = () => {
      const pct = getScrollPct();

      // CRO: Trigger StickyBar once the user has scrolled enough to be "engaged"
      if (!stickyFired.current && pct >= stickyTriggerPct) {
        stickyFired.current = true;
        onStickyTrigger?.();
      }

      // Fire GA4 scroll depth events at standard milestones
      for (const milestone of GA4_MILESTONES) {
        if (!firedMilestones.current.has(milestone) && pct >= milestone) {
          firedMilestones.current.add(milestone);
          trackScrollDepth(milestone);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyTriggerPct, onStickyTrigger]);
};
