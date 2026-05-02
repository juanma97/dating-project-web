import React, { useState } from 'react';
import { Event } from '../../api/model/event';
import EventsList from '../EventsList/component';
import { EventCardSkeletonList } from '../EventCardSkeleton/component';
import PremiumPromoCard from '../PremiumPromoCard/component';
import { trackWizardStep, trackWizardComplete } from '../../utils/analytics';
import './component.css';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface AgeRange {
  label: string;     // Display label e.g. "25–35"
  min: number;
  max: number;
  value: string;     // GA4 tracking value e.g. "25-35"
}

export type DatePreset = 'este-finde' | 'este-mes' | 'proximo-mes' | 'cualquier-fecha';

export interface DateOption {
  label: string;
  emoji: string;
  value: DatePreset;
  description: string;
}

export interface WizardFilters {
  ageMin: number;
  ageMax: number;
  datePreset: DatePreset;
}

// ─── Static data ───────────────────────────────────────────────────────────

const AGE_RANGES: AgeRange[] = [
  { label: '18 – 25', min: 18, max: 25, value: '18-25' },
  { label: '25 – 35', min: 25, max: 35, value: '25-35' },
  { label: '30 – 40', min: 30, max: 40, value: '30-40' },
  { label: '35 – 45', min: 35, max: 45, value: '35-45' },
  { label: '40 – 55', min: 40, max: 55, value: '40-55' },
];

const DATE_OPTIONS: DateOption[] = [
  { label: 'Este fin de semana', emoji: '⚡', value: 'este-finde', description: 'Sáb o Dom' },
  { label: 'Este mes', emoji: '📅', value: 'este-mes', description: 'Las próximas semanas' },
  { label: 'Próximo mes', emoji: '🌙', value: 'proximo-mes', description: 'Sin prisas' },
  { label: 'Cualquier fecha', emoji: '✨', value: 'cualquier-fecha', description: 'Sorpréndeme' },
];

// ─── Date filtering logic ───────────────────────────────────────────────────

/**
 * CRO: Filters events by the user's selected date preference.
 * "Este fin de semana" creates urgency — fewest results but highest intent.
 * "Cualquier fecha" is the safety net to always show something (zero empty-state).
 */
function filterEventsByDatePreset(events: Event[], preset: DatePreset): Event[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (preset === 'cualquier-fecha') return events;

  return events.filter((event) => {
    if (!event.date) return true; // edge case: no date → include the event
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    if (preset === 'este-finde') {
      // Next Saturday and Sunday from today
      const day = now.getDay(); // 0=Sun, 6=Sat
      const daysToSat = (6 - day + 7) % 7 || 7;
      const sat = new Date(now);
      sat.setDate(now.getDate() + daysToSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);
      return eventDate >= sat && eventDate <= sun;
    }

    if (preset === 'este-mes') {
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return eventDate >= now && eventDate <= endOfMonth;
    }

    if (preset === 'proximo-mes') {
      const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const endNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      return eventDate >= startNextMonth && eventDate <= endNextMonth;
    }

    return true;
  });
}

/**
 * CRO: Filters events by user's self-reported age range.
 * We include events that OVERLAP with the user's range, not just exact matches.
 * This maximizes results shown (less empty states = less drop-off).
 */
function filterEventsByAge(events: Event[], ageMin: number, ageMax: number): Event[] {
  return events.filter((event) => {
    const eMin = event.min_age ?? 18;
    const eMax = event.max_age ?? 99;
    // Overlap check: ranges overlap if eMin <= userMax && eMax >= userMin
    return eMin <= ageMax && eMax >= ageMin;
  });
}

// ─── Component ─────────────────────────────────────────────────────────────

interface WizardFunnelProps {
  allEvents: Event[];
  loading: boolean;
  /** Called when wizard completes so LandingPage can sync sticky bar etc. */
  onComplete: (filters: WizardFilters, matchCount: number) => void;
  onPremiumNotifyMe?: () => void;
}

const WizardFunnel: React.FC<WizardFunnelProps> = ({
  allEvents,
  loading,
  onComplete,
  onPremiumNotifyMe,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAge, setSelectedAge] = useState<AgeRange | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [matchedEvents, setMatchedEvents] = useState<Event[]>([]);

  // ── Step 1: Age selection ──────────────────────────────────────────────

  const handleAgeSelect = (range: AgeRange) => {
    setSelectedAge(range);

    // CRO: Track which age segment is most popular → informs future event lineup
    trackWizardStep({ step_number: 1, value: range.value });

    // Advance immediately on selection — no extra confirmation step needed
    setStep(2);
  };

  // ── Step 2: Date selection → computes results ──────────────────────────

  const handleDateSelect = (option: DateOption) => {
    setSelectedDate(option);

    // CRO: Track date preference — "este-finde" high intent, others show planning horizon
    trackWizardStep({ step_number: 2, value: option.value });

    if (!selectedAge) return;

    // Apply both filters and compute matches
    const byAge = filterEventsByAge(allEvents, selectedAge.min, selectedAge.max);
    const result = filterEventsByDatePreset(byAge, option.value);

    setMatchedEvents(result);
    setStep(3);

    // CRO: wizard_complete is the core conversion micro-event of the v2 funnel
    trackWizardComplete({
      age_range: selectedAge.value,
      date_preset: option.value,
      results_count: result.length,
    });

    onComplete({ ageMin: selectedAge.min, ageMax: selectedAge.max, datePreset: option.value }, result.length);
  };

  // ── Step 3: Reset ──────────────────────────────────────────────────────

  const handleReset = () => {
    setStep(1);
    setSelectedAge(null);
    setSelectedDate(null);
    setMatchedEvents([]);
  };

  // ── Progress bar ───────────────────────────────────────────────────────

  const progressPct = step === 1 ? 0 : step === 2 ? 50 : 100;

  return (
    <section className="wizard-funnel" id="wizard" aria-label="Encuentra tu evento">
      {/* ── Progress bar ── */}
      {step < 3 && (
        <div className="wizard-progress" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="wizard-progress-track">
            <div
              className="wizard-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="wizard-progress-label">Paso {step} de 2</p>
        </div>
      )}

      {/* ── Step 1: Age range ── */}
      {step === 1 && (
        <div className="wizard-step" role="group" aria-labelledby="wizard-step1-title">
          <div className="wizard-step-header">
            <span className="wizard-step-emoji">🎂</span>
            <h2 className="wizard-step-title" id="wizard-step1-title">
              ¿Cuál es tu rango de edad?
            </h2>
            <p className="wizard-step-subtitle">
              Te mostramos eventos donde encajas perfectamente
            </p>
          </div>
          <div className="wizard-pills" role="list">
            {AGE_RANGES.map((range) => (
              <button
                key={range.value}
                id={`age-pill-${range.value}`}
                className="wizard-pill"
                onClick={() => handleAgeSelect(range)}
                aria-label={`Seleccionar rango de edad ${range.label}`}
                role="listitem"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Date preference ── */}
      {step === 2 && (
        <div className="wizard-step wizard-step--dates" role="group" aria-labelledby="wizard-step2-title">
          <div className="wizard-step-header">
            <span className="wizard-step-emoji">📆</span>
            <h2 className="wizard-step-title" id="wizard-step2-title">
              ¿Cuándo quieres ir?
            </h2>
            {/* CRO: Show selected age to reinforce personalization feeling */}
            {selectedAge && (
              <p className="wizard-step-subtitle">
                Perfecto para <strong>{selectedAge.label} años</strong> · Elige cuándo
              </p>
            )}
          </div>
          <div className="wizard-date-grid" role="list">
            {DATE_OPTIONS.map((option) => (
              <button
                key={option.value}
                id={`date-pill-${option.value}`}
                className="wizard-date-card"
                onClick={() => handleDateSelect(option)}
                aria-label={`Seleccionar fecha: ${option.label}`}
                role="listitem"
              >
                <span className="wizard-date-emoji">{option.emoji}</span>
                <span className="wizard-date-label">{option.label}</span>
                <span className="wizard-date-desc">{option.description}</span>
              </button>
            ))}
          </div>
          <button className="wizard-back-btn" onClick={() => setStep(1)} aria-label="Volver al paso anterior">
            ← Cambiar edad
          </button>
        </div>
      )}

      {/* ── Step 3: Results ── */}
      {step === 3 && (
        <div className="wizard-step wizard-step--results">

          {/* Results header — always shown */}
          <div className="wizard-results-header">
            <div className="wizard-results-summary">
              {loading ? (
                <p className="wizard-results-loading">Buscando eventos…</p>
              ) : matchedEvents.length > 0 ? (
                <>
                  <span className="wizard-results-count">{matchedEvents.length}</span>
                  <span className="wizard-results-label">
                    {matchedEvents.length === 1 ? 'evento para ti' : 'eventos para ti'}
                  </span>
                </>
              ) : (
                <span className="wizard-results-label wizard-results-label--empty">
                  Sin eventos exactos para esos filtros
                </span>
              )}
            </div>

            {selectedAge && selectedDate && matchedEvents.length > 0 && (
              <div className="wizard-results-tags">
                <span className="wizard-tag">{selectedAge.label} años</span>
                <span className="wizard-tag">{selectedDate.label}</span>
                <button className="wizard-reset-btn" onClick={handleReset} id="wizard-reset-btn">
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <EventCardSkeletonList count={3} />
          ) : matchedEvents.length > 0 ? (
            // ── Has results: show matched events ────────────────────────────
            <div className="wizard-events-list">
              <EventsList
                events={matchedEvents}
                onPremiumNotifyMe={onPremiumNotifyMe}
              />
            </div>
          ) : (
            // ── Empty state: restart CTA + Premium upsell ────────────────
            // CRO: Never leave the user at a dead end.
            // Two recovery paths: try again (low friction) or upgrade to Premium (high value).
            <div className="wizard-empty-state">
              <p className="wizard-empty-body">
                No encontramos eventos que coincidan exactamente, pero tenemos alternativas para ti:
              </p>

              {/* Path 1: restart wizard (lowers barrier to re-engagement) */}
              <button
                id="wizard-restart-btn"
                className="wizard-restart-btn"
                onClick={handleReset}
              >
                🔄 Intentar con otros filtros
              </button>

              {/* Path 2: Premium events upsell — curated events always available */}
              <div className="wizard-empty-premium">
                <p className="wizard-empty-premium-label">O descubre nuestros eventos exclusivos:</p>
                <PremiumPromoCard onNotifyMe={onPremiumNotifyMe} />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default WizardFunnel;
