import React, { useState } from 'react';
import {
  submitApplicationLead,
  type Gender,
  type Intent,
  type Timeline,
  type KeyPreference,
} from '../../api/supabase/applicationLeads';
import './component.css';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ApplicationFormProps {
  gender: 'male' | 'female';
  /** Called on successful submission with the generated tags */
  onSuccess?: (tags: string[]) => void;
}

interface FormState {
  intent: Intent | '';
  age: string;
  city: string;
  preferred_age_range: string;
  key_preference: KeyPreference | '';
  first_name: string;
  email: string;
  timeline: Timeline | '';
}

// ─── Static Data ────────────────────────────────────────────────────────────

const INTENT_OPTIONS = [
  { value: 'relationship' as Intent, label: 'Buscar una relación', emoji: '💫' },
  { value: 'social'       as Intent, label: 'Ampliar mi círculo social', emoji: '🤝' },
  { value: 'explore'      as Intent, label: 'Simplemente explorar', emoji: '🌱' },
];

const AGE_RANGE_OPTIONS = [
  '18–24', '25–29', '30–34', '35–39', '40–45',
];

const KEY_PREFERENCE_OPTIONS: { value: KeyPreference; label: string; emoji: string }[] = [
  { value: 'safety',           label: 'Seguridad y verificación', emoji: '🛡️' },
  { value: 'small_group',      label: 'Grupos pequeños y cómodos', emoji: '🌿' },
  { value: 'age_match',        label: 'Personas de mi rango de edad', emoji: '⏳' },
  { value: 'shared_interests', label: 'Intereses en común', emoji: '✨' },
];

const TIMELINE_OPTIONS = [
  { value: 'this_month' as Timeline, label: 'Este mes',          desc: 'Estoy listo/a' },
  { value: 'next_month' as Timeline, label: 'El mes que viene',  desc: 'Me lo estoy pensando' },
  { value: 'exploring'  as Timeline, label: 'Solo explorando',   desc: 'Sin compromiso' },
];

// ─── Component ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

const ApplicationForm: React.FC<ApplicationFormProps> = ({ gender, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);

  const [form, setForm] = useState<FormState>({
    intent: '',
    age: '',
    city: '',
    preferred_age_range: '',
    key_preference: '',
    first_name: '',
    email: '',
    timeline: '',
  });

  // ── Handlers ───────────────────────────────────────────────────────────

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!form.intent || !form.age || !form.first_name || !form.email || !form.timeline) return;
    setSubmitting(true);
    setError(null);

    try {
      const { tags } = await submitApplicationLead({
        gender: gender as Gender,
        age: parseInt(form.age, 10),
        city: form.city || undefined,
        intent: form.intent as Intent,
        preferred_age_range: form.preferred_age_range || undefined,
        key_preference: (form.key_preference as KeyPreference) || undefined,
        first_name: form.first_name,
        email: form.email,
        timeline: form.timeline as Timeline,
        source: gender === 'male' ? 'landing_man' : 'landing_women',
      });
      setGeneratedTags(tags);
      setSubmitted(true);
      onSuccess?.(tags);
    } catch {
      setError('Algo salió mal. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step validation ────────────────────────────────────────────────────

  const canProceedStep1 = form.intent !== '';
  const canProceedStep2 = form.age !== '' && parseInt(form.age, 10) >= 18 && parseInt(form.age, 10) <= 65;
  const canProceedStep3 = gender === 'male' ? form.preferred_age_range !== '' : form.key_preference !== '';
  const canSubmit = form.first_name.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.timeline !== '';

  // ── Progress ────────────────────────────────────────────────────────────

  const progressPct = ((step - 1) / TOTAL_STEPS) * 100;

  // ── Submitted state ─────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="af-success" role="alert">
        <div className="af-success-icon">🎉</div>
        <h3 className="af-success-title">¡Solicitud recibida!</h3>
        <p className="af-success-body">
          Te contactaremos en las próximas 48h con los detalles del próximo evento.
        </p>
        {/* Dev-only: show generated tags for verification */}
        {process.env.NODE_ENV === 'development' && (
          <details className="af-debug">
            <summary>Tags generados (dev only)</summary>
            <code>{generatedTags.join(' | ')}</code>
          </details>
        )}
      </div>
    );
  }

  return (
    <div className="af-container" role="form" aria-label="Formulario de solicitud">

      {/* Progress bar */}
      <div className="af-progress" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
        <div className="af-progress-track">
          <div className="af-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="af-progress-label">Paso {step} de {TOTAL_STEPS}</span>
      </div>

      {/* ── Step 1: Intent ── */}
      {step === 1 && (
        <div className="af-step" id="af-step-1">
          <h3 className="af-step-title">¿Qué te trae por aquí?</h3>
          <p className="af-step-subtitle">Sin filtros. Solo curiosidad.</p>
          <div className="af-options" role="group" aria-label="Motivo de registro">
            {INTENT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                id={`af-intent-${opt.value}`}
                className={`af-option-btn ${form.intent === opt.value ? 'af-option-btn--selected' : ''}`}
                onClick={() => { setField('intent', opt.value); }}
                aria-pressed={form.intent === opt.value}
              >
                <span className="af-option-emoji">{opt.emoji}</span>
                <span className="af-option-label">{opt.label}</span>
              </button>
            ))}
          </div>
          <button
            id="af-next-1"
            className="af-btn-primary"
            onClick={nextStep}
            disabled={!canProceedStep1}
          >
            Continuar →
          </button>
        </div>
      )}

      {/* ── Step 2: Profile ── */}
      {step === 2 && (
        <div className="af-step" id="af-step-2">
          <h3 className="af-step-title">Cuéntanos un poco sobre ti</h3>
          <p className="af-step-subtitle">Necesitamos esto para encontrar tu grupo ideal.</p>

          <div className="af-field-group">
            <label className="af-label" htmlFor="af-age">Tu edad</label>
            <input
              id="af-age"
              className="af-input"
              type="number"
              min={18}
              max={65}
              placeholder="Ej: 28"
              value={form.age}
              onChange={e => setField('age', e.target.value)}
              aria-label="Tu edad"
            />
          </div>

          <div className="af-field-group">
            <label className="af-label" htmlFor="af-city">Ciudad <span className="af-optional">(opcional)</span></label>
            <input
              id="af-city"
              className="af-input"
              type="text"
              placeholder="Ej: Madrid"
              value={form.city}
              onChange={e => setField('city', e.target.value)}
              aria-label="Tu ciudad"
            />
          </div>

          <div className="af-step-nav">
            <button className="af-btn-ghost" onClick={prevStep}>← Atrás</button>
            <button
              id="af-next-2"
              className="af-btn-primary"
              onClick={nextStep}
              disabled={!canProceedStep2}
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Preferences (gender-branched) ── */}
      {step === 3 && (
        <div className="af-step" id="af-step-3">
          {gender === 'male' ? (
            <>
              <h3 className="af-step-title">¿Qué rango de edad te interesa?</h3>
              <p className="af-step-subtitle">Cuanto más específico, mejor el cuadre.</p>
              <div className="af-pills" role="group" aria-label="Rango de edad preferido">
                {AGE_RANGE_OPTIONS.map(range => {
                  const val = range.replace('–', '-');
                  return (
                    <button
                      key={val}
                      id={`af-age-range-${val}`}
                      className={`af-pill ${form.preferred_age_range === val ? 'af-pill--selected' : ''}`}
                      onClick={() => setField('preferred_age_range', val)}
                      aria-pressed={form.preferred_age_range === val}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <h3 className="af-step-title">¿Qué es lo más importante para ti?</h3>
              <p className="af-step-subtitle">Así ajustamos cada evento a tus expectativas.</p>
              <div className="af-options" role="group" aria-label="Preferencia principal">
                {KEY_PREFERENCE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    id={`af-pref-${opt.value}`}
                    className={`af-option-btn ${form.key_preference === opt.value ? 'af-option-btn--selected' : ''}`}
                    onClick={() => setField('key_preference', opt.value)}
                    aria-pressed={form.key_preference === opt.value}
                  >
                    <span className="af-option-emoji">{opt.emoji}</span>
                    <span className="af-option-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="af-step-nav">
            <button className="af-btn-ghost" onClick={prevStep}>← Atrás</button>
            <button
              id="af-next-3"
              className="af-btn-primary"
              onClick={nextStep}
              disabled={!canProceedStep3}
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Commitment ── */}
      {step === 4 && (
        <div className="af-step" id="af-step-4">
          <h3 className="af-step-title">Casi listo</h3>
          <p className="af-step-subtitle">Solo necesitamos saber cómo contactarte.</p>

          <div className="af-field-group">
            <label className="af-label" htmlFor="af-first-name">Nombre</label>
            <input
              id="af-first-name"
              className="af-input"
              type="text"
              placeholder="Tu nombre"
              value={form.first_name}
              onChange={e => setField('first_name', e.target.value)}
              autoComplete="given-name"
              aria-label="Tu nombre"
            />
          </div>

          <div className="af-field-group">
            <label className="af-label" htmlFor="af-email">Email</label>
            <input
              id="af-email"
              className="af-input"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={e => setField('email', e.target.value)}
              autoComplete="email"
              aria-label="Tu email"
            />
          </div>

          <div className="af-field-group">
            <label className="af-label">¿Cuándo estás disponible?</label>
            <div className="af-timeline-grid" role="group" aria-label="Disponibilidad temporal">
              {TIMELINE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  id={`af-timeline-${opt.value}`}
                  className={`af-timeline-btn ${form.timeline === opt.value ? 'af-timeline-btn--selected' : ''}`}
                  onClick={() => setField('timeline', opt.value)}
                  aria-pressed={form.timeline === opt.value}
                >
                  <span className="af-timeline-label">{opt.label}</span>
                  <span className="af-timeline-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="af-error" role="alert">{error}</p>}

          <div className="af-step-nav">
            <button className="af-btn-ghost" onClick={prevStep}>← Atrás</button>
            <button
              id="af-submit-btn"
              className="af-btn-cta"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              aria-busy={submitting}
            >
              {submitting ? 'Enviando…' : 'Solicitar mi plaza →'}
            </button>
          </div>

          <p className="af-privacy">
            Sin spam. Solo te contactaremos para confirmar tu plaza.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;
