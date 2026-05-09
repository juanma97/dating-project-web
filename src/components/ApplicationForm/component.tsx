import React, { useState } from 'react';
import {
  submitApplicationLead,
  type Gender,
  type PreferredPlan,
  type PersonalityType,
  type ContactMethod,
} from '../../api/supabase/applicationLeads';
import './component.css';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ApplicationFormProps {
  gender: 'male' | 'female';
  onSuccess?: (tags: string[]) => void;
}

interface FormState {
  preferred_plan:   PreferredPlan | '';
  personality_type: PersonalityType | '';
  connection_goal:  string;
  contact_method:   ContactMethod | '';
  phone:            string;
  email:            string;
}

// ─── Static Data ────────────────────────────────────────────────────────────

const PLAN_OPTIONS: { value: PreferredPlan; label: string; desc: string; emoji: string }[] = [
  { value: 'afterwork', label: 'Afterwork',  desc: 'Tras la jornada, ambiente relajado', emoji: '🥂' },
  { value: 'dinner',    label: 'Cena',       desc: 'Conversación tranquila, mesa compartida', emoji: '🕯️' },
  { value: 'social',    label: 'Social',     desc: 'Actividad o juego, más movimiento', emoji: '🎲' },
];

const PERSONALITY_OPTIONS: { value: PersonalityType; label: string; desc: string; emoji: string }[] = [
  { value: 'extrovert',   label: 'Extrovertido/a', desc: 'Me lanzo, rompo el hielo fácil', emoji: '⚡' },
  { value: 'situational', label: 'Depende del día', desc: 'Cuando el ambiente me da', emoji: '🌊' },
  { value: 'quiet',       label: 'Reservado/a',    desc: 'Prefiero que me pregunten', emoji: '🌿' },
];

const CONTACT_OPTIONS: { value: ContactMethod; label: string; icon: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp', icon: '📱' },
  { value: 'email',    label: 'Email',    icon: '✉️' },
];

// ─── Validation helpers ─────────────────────────────────────────────────────

const PHONE_REGEX = /^\+?[\d\s\-().]{8,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Component ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

const ApplicationForm: React.FC<ApplicationFormProps> = ({ gender, onSuccess }) => {
  const [step, setStep]           = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]  = useState(false);
  const [error, setError]          = useState<string | null>(null);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);

  const [form, setForm] = useState<FormState>({
    preferred_plan:   '',
    personality_type: '',
    connection_goal:  '',
    contact_method:   '',
    phone:            '',
    email:            '',
  });

  // ── Handlers ───────────────────────────────────────────────────────────

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // ── Step Validation ────────────────────────────────────────────────────

  const canProceedStep1 = form.preferred_plan !== '';
  const canProceedStep2 = form.personality_type !== '';
  const canProceedStep3 = form.connection_goal.trim().length >= 10;

  const canSubmit = (() => {
    if (form.contact_method === 'whatsapp') return PHONE_REGEX.test(form.phone);
    if (form.contact_method === 'email')    return EMAIL_REGEX.test(form.email);
    return false;
  })();

  // ── Submit ─────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      const { tags } = await submitApplicationLead({
        gender:           gender as Gender,
        preferred_plan:   form.preferred_plan as PreferredPlan,
        personality_type: form.personality_type as PersonalityType,
        connection_goal:  form.connection_goal.trim(),
        contact_method:   form.contact_method as ContactMethod,
        phone:            form.contact_method === 'whatsapp' ? form.phone : undefined,
        email:            form.contact_method === 'email'    ? form.email : undefined,
        source:           gender === 'male' ? 'landing_man' : 'landing_women',
      });
      setGeneratedTags(tags);
      setSubmitted(true);
      onSuccess?.(tags);
    } catch (err) {
      setError('Algo salió mal. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Progress ────────────────────────────────────────────────────────────

  const progressPct = ((step - 1) / TOTAL_STEPS) * 100;

  // ── Success ─────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="af-success" role="alert">
        <div className="af-success-icon">🎉</div>
        <h3 className="af-success-title">¡Solicitud recibida!</h3>
        <p className="af-success-body">
          {form.contact_method === 'whatsapp'
            ? 'Te confirmaremos tu plaza por WhatsApp en menos de 48h.'
            : 'Te enviaremos los detalles por email en menos de 48h.'}
        </p>
        {import.meta.env.DEV && (
          <details className="af-debug">
            <summary>Tags (dev)</summary>
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

      {/* ── Step 1: Plan Preference ── */}
      {step === 1 && (
        <div className="af-step" id="af-step-1">
          <h3 className="af-step-title">¿Qué plan te va más?</h3>
          <p className="af-step-subtitle">Así diseñamos el evento que encaja contigo.</p>
          <div className="af-options" role="group" aria-label="Tipo de plan preferido">
            {PLAN_OPTIONS.map(opt => (
              <button
                key={opt.value}
                id={`af-plan-${opt.value}`}
                className={`af-option-btn ${form.preferred_plan === opt.value ? 'af-option-btn--selected' : ''}`}
                onClick={() => setField('preferred_plan', opt.value)}
                aria-pressed={form.preferred_plan === opt.value}
              >
                <span className="af-option-emoji">{opt.emoji}</span>
                <span className="af-option-text">
                  <span className="af-option-label">{opt.label}</span>
                  <span className="af-option-desc">{opt.desc}</span>
                </span>
              </button>
            ))}
          </div>
          <button
            id="af-next-1"
            className="af-btn-primary af-btn-full"
            onClick={nextStep}
            disabled={!canProceedStep1}
          >
            Continuar →
          </button>
        </div>
      )}

      {/* ── Step 2: Personality Type ── */}
      {step === 2 && (
        <div className="af-step" id="af-step-2">
          <h3 className="af-step-title">¿Cómo eres en un plan nuevo?</h3>
          <p className="af-step-subtitle">Sin juicios. Solo para cuadrar los grupos.</p>
          <div className="af-options" role="group" aria-label="Tipo de personalidad">
            {PERSONALITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                id={`af-personality-${opt.value}`}
                className={`af-option-btn ${form.personality_type === opt.value ? 'af-option-btn--selected' : ''}`}
                onClick={() => setField('personality_type', opt.value)}
                aria-pressed={form.personality_type === opt.value}
              >
                <span className="af-option-emoji">{opt.emoji}</span>
                <span className="af-option-text">
                  <span className="af-option-label">{opt.label}</span>
                  <span className="af-option-desc">{opt.desc}</span>
                </span>
              </button>
            ))}
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

      {/* ── Step 3: Connection Goal (open-ended) ── */}
      {step === 3 && (
        <div className="af-step" id="af-step-3">
          <h3 className="af-step-title">¿Con quién te gustaría conectar?</h3>
          <p className="af-step-subtitle">
            Sin filtros, en tus palabras. Cuanto más específico/a, mejor el cuadre.
          </p>
          <div className="af-field-group">
            <textarea
              id="af-connection-goal"
              className="af-textarea"
              placeholder={
                gender === 'male'
                  ? 'Ej: Alguien que tenga carácter, que sepa lo que quiere y que no tenga miedo de decirlo...'
                  : 'Ej: Alguien tranquilo, con ambición pero sin prisa, que valore una conversación buena sobre la cantidad...'
              }
              value={form.connection_goal}
              onChange={e => setField('connection_goal', e.target.value)}
              rows={4}
              maxLength={400}
              aria-label="Con quién te gustaría conectar"
            />
            <span className="af-char-count">
              {form.connection_goal.length}/400
            </span>
          </div>
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

      {/* ── Step 4: Contact Method (conditional) ── */}
      {step === 4 && (
        <div className="af-step" id="af-step-4">
          <h3 className="af-step-title">¿Dónde te avisamos si encajas?</h3>
          <p className="af-step-subtitle">Solo te contactamos si hay plaza para ti.</p>

          {/* Contact method selector */}
          <div className="af-contact-toggle" role="group" aria-label="Método de contacto">
            {CONTACT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                id={`af-contact-${opt.value}`}
                className={`af-contact-btn ${form.contact_method === opt.value ? 'af-contact-btn--selected' : ''}`}
                onClick={() => {
                  setField('contact_method', opt.value);
                  // Clear the other field when switching
                  if (opt.value === 'whatsapp') setField('email', '');
                  else setField('phone', '');
                }}
                aria-pressed={form.contact_method === opt.value}
              >
                <span className="af-contact-icon">{opt.icon}</span>
                <span className="af-contact-label">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Conditional WhatsApp field */}
          {form.contact_method === 'whatsapp' && (
            <div className="af-field-group af-field-animated" key="whatsapp-field">
              <label className="af-label" htmlFor="af-phone">Tu número de WhatsApp</label>
              <input
                id="af-phone"
                className="af-input"
                type="tel"
                placeholder="+34 600 000 000"
                value={form.phone}
                onChange={e => setField('phone', e.target.value)}
                autoComplete="tel"
                aria-label="Número de WhatsApp"
              />
              <p className="af-microcopy">
                📲 Confirmamos plazas por WhatsApp 24-48h antes del evento. Sin grupos, sin spam.
              </p>
            </div>
          )}

          {/* Conditional Email field */}
          {form.contact_method === 'email' && (
            <div className="af-field-group af-field-animated" key="email-field">
              <label className="af-label" htmlFor="af-email">Tu email</label>
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
          )}

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

          <p className="af-privacy">Sin spam. Solo te contactamos si hay plaza para ti.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;
