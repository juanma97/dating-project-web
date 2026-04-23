import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { submitLead } from '../../api/supabase/leads';
import { trackStickyBarLeadSubmit, trackPremiumPromoNotifyClick } from '../../utils/analytics';
import './component.css';

export type NotifyMeSource = 'sticky-bar' | 'premium-promo';

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: NotifyMeSource;
}

const GENDERS = [
  { value: 'female', label: '👩 Mujer' },
  { value: 'male', label: '👨 Hombre' },
  { value: 'other', label: '🌈 Otro' },
];

const NotifyMeModal: React.FC<NotifyMeModalProps> = ({ isOpen, onClose, source }) => {
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = source === 'premium-promo';

  // Lock body scroll while open
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !age || !gender) return;

    setLoading(true);
    setError(null);

    try {
      await submitLead({
        event_id: isPremium ? 'premium-interest' : 'general-interest',
        city: 'Madrid',
        min_age: null,
        max_age: null,
        girls_price: null,
        boys_price: null,
        user_age: Number(age),
        user_gender: gender,
        user_email: email,
        preferred_age_range: null,
      });

      if (isPremium) {
        trackPremiumPromoNotifyClick();
      } else {
        trackStickyBarLeadSubmit(email);
      }

      setSuccess(true);
    } catch {
      setError('Algo salió mal. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state for next open
    setEmail('');
    setAge('');
    setGender('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="notify-backdrop" onClick={handleClose} aria-hidden="true" />
      <div
        className="notify-modal"
        role="dialog"
        aria-modal="true"
        aria-label={isPremium ? 'Avísame de Eventos Premium' : 'Avísame del próximo evento'}
      >
        {success ? (
          <div className="notify-success">
            <div className="notify-success-emoji">🎉</div>
            <h3 className="notify-success-title">¡Apuntado!</h3>
            <p className="notify-success-body">
              {isPremium
                ? 'Te avisaremos cuando haya plazas en los próximos Eventos Premium.'
                : 'Te avisaremos del próximo evento en Madrid.'}
            </p>
            <button className="notify-close-btn-main" onClick={handleClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="notify-header">
              <div className="notify-title-row">
                <h3 className="notify-title">
                  {isPremium ? '✨ Avísame de Eventos Premium' : '🔔 Avísame del próximo evento'}
                </h3>
                <button className="notify-x" onClick={handleClose} aria-label="Cerrar">✕</button>
              </div>
              <p className="notify-subtitle">
                {isPremium
                  ? 'Déjanos tus datos y te avisamos cuando haya plazas. Sin compromiso.'
                  : 'Te mandamos un aviso cuando abramos el próximo evento en Madrid.'}
              </p>
            </div>

            <form className="notify-form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="notify-field">
                <label htmlFor="notify-email" className="notify-label">Email *</label>
                <input
                  id="notify-email"
                  type="email"
                  className="notify-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Age */}
              <div className="notify-field">
                <label htmlFor="notify-age" className="notify-label">Tu edad *</label>
                <input
                  id="notify-age"
                  type="number"
                  className="notify-input notify-input--short"
                  placeholder="30"
                  min={18}
                  max={99}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              {/* Gender — pill buttons */}
              <div className="notify-field">
                <span className="notify-label">Género *</span>
                <div className="notify-gender-pills">
                  {GENDERS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      className={`notify-gender-pill ${gender === g.value ? 'selected' : ''}`}
                      onClick={() => setGender(g.value)}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="notify-error">⚠️ {error}</p>}

              <button
                type="submit"
                className="notify-submit"
                disabled={loading || !email || !age || !gender}
                id="notify-me-submit"
              >
                {loading ? 'Enviando...' : isPremium ? 'Avísame de plazas Premium' : 'Avísame'}
              </button>

              <p className="notify-legal">Sin spam. Solo te escribimos cuando tengamos algo para ti.</p>
            </form>
          </>
        )}
      </div>
    </>,
    document.body,
  );
};

export default NotifyMeModal;
