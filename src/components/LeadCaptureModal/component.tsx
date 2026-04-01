import React, { useState } from 'react';
import { Event } from '../../api/model/event';
import { submitLead } from '../../api/supabase/leads';
import { trackPremiumEventLeadSubmit } from '../../utils/analytics';
import './component.css';

interface LeadCaptureModalProps {
  event: Event;
  onClose: () => void;
}

const GENDER_OPTIONS = [
  { value: 'female', label: '👩 Mujer' },
  { value: 'male', label: '👨 Hombre' },
  { value: 'other', label: '🌈 Otro' },
];

const AGE_RANGE_OPTIONS = [
  { value: '', label: 'Sin preferencia' },
  { value: '18-25', label: '18–25' },
  { value: '25-35', label: '25–35' },
  { value: '35-45', label: '35–45' },
  { value: '45+', label: '45+' },
];

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ event, onClose }) => {
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [preferredAgeRange, setPreferredAgeRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !age || !gender) return;

    setLoading(true);
    setError(null);

    try {
      await submitLead({
        event_id: event.id,
        city: event.city,
        min_age: event.min_age,
        max_age: event.max_age,
        girls_price: event.girls_price,
        boys_price: event.boys_price,
        user_age: Number(age),
        user_gender: gender,
        user_email: email,
        preferred_age_range: preferredAgeRange || null,
      });

      trackPremiumEventLeadSubmit({
        event_id: event.id,
        city: event.city,
        user_age: Number(age),
        user_gender: gender,
        girls_price: event.girls_price,
        boys_price: event.boys_price,
      });

      setSuccess(true);
    } catch (err) {
      setError('Algo salió mal. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>

        {success ? (
          <div className="modal-success">
            <div className="success-emoji">🎉</div>
            <h2>¡Todo listo!</h2>
            <p>Te avisaremos cuando abramos las plazas 🎉</p>
            <button className="btn-cta-primary" onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <span className="modal-badge">🔥 Plazas limitadas</span>
              <h2 className="modal-title">Reserva tu plaza</h2>
              <p className="modal-subtitle">
                Estamos validando demanda. Te avisaremos cuando abramos inscripciones.
              </p>
            </div>

            <div className="modal-event-summary">
              <span>📅 {event.date}</span>
              {event.city && <span>📍 {event.city}</span>}
              {(event.min_age || event.max_age) && (
                <span>👥 {event.min_age || 18}–{event.max_age || 99} años</span>
              )}
            </div>

            <form className="lead-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="lead-email">Email *</label>
                <input
                  id="lead-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lead-age">Edad *</label>
                  <input
                    id="lead-age"
                    type="number"
                    placeholder="25"
                    min={18}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lead-gender">Género *</label>
                  <select
                    id="lead-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Selecciona...</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lead-age-range">
                  Rango de edad preferido{' '}
                  <span className="optional-label">(opcional)</span>
                </label>
                <select
                  id="lead-age-range"
                  value={preferredAgeRange}
                  onChange={(e) => setPreferredAgeRange(e.target.value)}
                >
                  {AGE_RANGE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {error && <p className="form-error">⚠️ {error}</p>}

              <button
                type="submit"
                className="btn-cta-primary"
                disabled={loading || !email || !age || !gender}
              >
                {loading ? 'Enviando...' : '👉 Apuntarme (Plazas limitadas)'}
              </button>

              <p className="form-legal">
                Sin registro obligatorio · Sin spam · Solo te avisamos cuando abramos plazas.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;
