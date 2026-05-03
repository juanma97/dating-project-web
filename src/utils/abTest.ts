/**
 * abTest.ts
 *
 * Lightweight A/B test engine.
 * - Persists variant in localStorage so users always see the same experience.
 * - Fires a GA4 assignment event exactly once per browser (guarded by sessionStorage).
 * - Zero external dependencies.
 */

import { trackAbTestAssigned } from './analytics';

// ─── Hero video A/B ────────────────────────────────────────────────────────

export type HeroVariant = 'gradient' | 'video';

const HERO_AB_KEY = 'zapyens_hero_ab_v1';
const HERO_AB_FIRED_KEY = 'zapyens_hero_ab_fired_v1';

/**
 * Returns the user's assigned hero variant.
 * On first call: randomly assigns 50/50 and persists to localStorage.
 * On subsequent calls: reads the stored value (stable across sessions).
 *
 * Performance contract:
 *  - 'gradient' users → zero video bytes downloaded (video element not mounted)
 *  - 'video' users    → preload="none"; video only starts buffering on autoplay
 */
export function getHeroVariant(): HeroVariant {
  try {
    const stored = localStorage.getItem(HERO_AB_KEY) as HeroVariant | null;

    if (stored === 'gradient' || stored === 'video') {
      // Known returning user — fire assignment event once per session
      fireAssignmentEventIfNeeded(stored, false);
      return stored;
    }

    // First-time assignment: 50/50 random split
    const variant: HeroVariant = Math.random() < 0.5 ? 'gradient' : 'video';
    localStorage.setItem(HERO_AB_KEY, variant);
    fireAssignmentEventIfNeeded(variant, true);
    return variant;
  } catch {
    // localStorage blocked (private mode, storage full) → default to control
    return 'gradient';
  }
}

/**
 * Fires the GA4 ab_test_assigned event at most once per browser session.
 * Using sessionStorage as the guard ensures we track assignment visits
 * without spamming the event on every page load.
 */
function fireAssignmentEventIfNeeded(variant: HeroVariant, isNewAssignment: boolean): void {
  try {
    if (sessionStorage.getItem(HERO_AB_FIRED_KEY)) return;
    sessionStorage.setItem(HERO_AB_FIRED_KEY, '1');
    trackAbTestAssigned({
      test_name: 'hero_background_v1',
      variant,
      is_new_assignment: isNewAssignment,
    });
  } catch {
    // sessionStorage blocked — silently skip
  }
}

/**
 * Force-resets the A/B assignment (useful for manual QA/testing).
 * Call from the browser console: `window.__resetHeroAB()`.
 */
if (typeof window !== 'undefined') {
  (window as any).__resetHeroAB = () => {
    localStorage.removeItem(HERO_AB_KEY);
    sessionStorage.removeItem(HERO_AB_FIRED_KEY);
    console.info('[A/B] Hero variant reset. Reload the page to get a new assignment.');
  };
}
