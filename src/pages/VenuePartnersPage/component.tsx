import React, { useState } from 'react';
import Footer from '../../components/Footer/component';
import { submitVenuePartnerLead } from '../../api/supabase/venuePartnerLeads';
import { useTranslation } from 'react-i18next';
import {
  trackVenuePartnerPageView,
  trackVenuePartnerFormSubmit,
  trackVenuePartnerCtaClick,
  trackVenuePartnerFormStart,
  trackVenuePartnerFormError,
} from '../../utils/analytics';
import { useSEO } from '../../hooks/useSEO';
import './component.css';

const VENUE_TYPES = [
  { value: 'restaurant', labelKey: 'venue_partners.form.type_restaurant' },
  { value: 'bar', labelKey: 'venue_partners.form.type_bar' },
  { value: 'pub', labelKey: 'venue_partners.form.type_pub' },
  { value: 'cafe', labelKey: 'venue_partners.form.type_cafe' },
  { value: 'rooftop', labelKey: 'venue_partners.form.type_rooftop' },
  { value: 'company', labelKey: 'venue_partners.form.type_company' },
  { value: 'other', labelKey: 'venue_partners.form.type_other' },
];

interface FormState {
  venue_name: string;
  venue_type: string;
  city: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  message: string;
  capacity: string;
}

const emptyForm: FormState = {
  venue_name: '',
  venue_type: '',
  city: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  message: '',
  capacity: '',
};

const VenuePartnersPage: React.FC = () => {
  const { t } = useTranslation();

  useSEO({
    title: 'Zapyens — Tu local, nuestros eventos | Colabora con nosotros',
    description:
      '¿Tienes un bar, restaurante o espacio con encanto? Colabora con Zapyens y llena tus mesas con eventos de speed dating. Sin riesgo. Contacta hoy.',
    canonical: 'https://zapyens.com/venues',
  });

  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasTrackedFormStart = React.useRef(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    trackVenuePartnerPageView();
  }, []);

  /**
   * Fires 'venue_partner_form_start' the first time the user focuses any field.
   * Using a ref so the event fires exactly once per page visit.
   */
  const handleFormStart = () => {
    if (!hasTrackedFormStart.current) {
      hasTrackedFormStart.current = true;
      trackVenuePartnerFormStart();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    handleFormStart();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCtaClick = () => {
    trackVenuePartnerCtaClick();
    document.getElementById('venue-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitVenuePartnerLead({
        venue_name: form.venue_name,
        venue_type: form.venue_type,
        city: form.city,
        contact_name: form.contact_name,
        email: form.contact_email,
        phone: form.contact_phone || null,
        message: form.message || null,
        capacity: form.capacity ? parseInt(form.capacity, 10) : null,
      });
      trackVenuePartnerFormSubmit({ venue_type: form.venue_type, city: form.city });
      setSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : t('venue_partners.form.error');
      setError(errorMsg);
      trackVenuePartnerFormError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vp-page">
      {/* ── Hero ── */}
      <section className="vp-hero">
        <div className="vp-hero-inner">
          <span className="vp-hero-badge">{t('venue_partners.hero_badge')}</span>
          <h1 className="vp-hero-title">{t('venue_partners.hero_title')}</h1>
          <p className="vp-hero-subtitle">{t('venue_partners.hero_subtitle')}</p>
          <button id="vp-cta-btn" className="vp-cta-btn" onClick={handleCtaClick}>
            {t('venue_partners.hero_cta')}
          </button>
        </div>
      </section>

      {/* ── How it works for venues ── */}
      <section className="vp-benefits">
        <div className="vp-container">
          <h2 className="vp-section-title">{t('venue_partners.benefits_title')}</h2>
          <div className="vp-benefits-grid">
            {(['b1', 'b2', 'b3', 'b4'] as const).map((key) => (
              <div key={key} className="vp-benefit-card">
                <span className="vp-benefit-icon">{t(`venue_partners.${key}_icon`)}</span>
                <h3 className="vp-benefit-title">{t(`venue_partners.${key}_title`)}</h3>
                <p className="vp-benefit-desc">{t(`venue_partners.${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof strip ── */}
      <section className="vp-proof">
        <div className="vp-container vp-proof-inner">
          {(['p1', 'p2', 'p3'] as const).map((key) => (
            <div key={key} className="vp-proof-stat">
              <span className="vp-proof-number">{t(`venue_partners.${key}_number`)}</span>
              <span className="vp-proof-label">{t(`venue_partners.${key}_label`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Registration form ── */}
      <section id="venue-form" className="vp-form-section">
        <div className="vp-container">
          <div className="vp-form-card">
            <h2 className="vp-form-title">{t('venue_partners.form.title')}</h2>
            <p className="vp-form-subtitle">{t('venue_partners.form.subtitle')}</p>

            {success ? (
              <div className="vp-success">
                <span className="vp-success-icon">🎉</span>
                <p className="vp-success-title">{t('venue_partners.form.success_title')}</p>
                <p className="vp-success-msg">{t('venue_partners.form.success_msg')}</p>
              </div>
            ) : (
              <form className="vp-form" onSubmit={handleSubmit} noValidate>
                <div className="vp-form-row">
                  <div className="vp-field">
                    <label htmlFor="vp-venue-name">{t('venue_partners.form.venue_name')} *</label>
                    <input
                      id="vp-venue-name"
                      name="venue_name"
                      type="text"
                      value={form.venue_name}
                      onChange={handleChange}
                      required
                      placeholder={t('venue_partners.form.venue_name_placeholder')}
                    />
                  </div>
                  <div className="vp-field">
                    <label htmlFor="vp-venue-type">{t('venue_partners.form.venue_type')} *</label>
                    <select
                      id="vp-venue-type"
                      name="venue_type"
                      value={form.venue_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{t('common.select')}</option>
                      {VENUE_TYPES.map((vt) => (
                        <option key={vt.value} value={vt.value}>
                          {t(vt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="vp-form-row">
                  <div className="vp-field">
                    <label htmlFor="vp-city">{t('venue_partners.form.city')} *</label>
                    <input
                      id="vp-city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder={t('venue_partners.form.city_placeholder')}
                    />
                  </div>
                  <div className="vp-field">
                    <label htmlFor="vp-contact-name">
                      {t('venue_partners.form.contact_name')} *
                    </label>
                    <input
                      id="vp-contact-name"
                      name="contact_name"
                      type="text"
                      value={form.contact_name}
                      onChange={handleChange}
                      required
                      placeholder={t('venue_partners.form.contact_name_placeholder')}
                    />
                  </div>
                </div>

                <div className="vp-form-row">
                  <div className="vp-field">
                    <label htmlFor="vp-contact-email">
                      {t('venue_partners.form.contact_email')} *
                    </label>
                    <input
                      id="vp-contact-email"
                      name="contact_email"
                      type="email"
                      value={form.contact_email}
                      onChange={handleChange}
                      required
                      placeholder={t('venue_partners.form.contact_email_placeholder')}
                    />
                  </div>
                  <div className="vp-field">
                    <label htmlFor="vp-contact-phone">
                      {t('venue_partners.form.contact_phone')}{' '}
                      <span className="vp-optional">{t('common.optional')}</span>
                    </label>
                    <input
                      id="vp-contact-phone"
                      name="contact_phone"
                      type="tel"
                      value={form.contact_phone}
                      onChange={handleChange}
                      placeholder={t('venue_partners.form.contact_phone_placeholder')}
                    />
                  </div>
                </div>

                <div className="vp-form-row">
                  <div className="vp-field">
                    <label htmlFor="vp-message">
                      {t('venue_partners.form.message')}{' '}
                      <span className="vp-optional">{t('common.optional')}</span>
                    </label>
                    <textarea
                      id="vp-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t('venue_partners.form.message_placeholder')}
                    />
                  </div>
                  <div className="vp-field">
                    <label htmlFor="vp-capacity">
                      {t('venue_partners.form.capacity')}{' '}
                      <span className="vp-optional">{t('common.optional')}</span>
                    </label>
                    <input
                      id="vp-capacity"
                      name="capacity"
                      type="number"
                      value={form.capacity}
                      onChange={handleChange}
                      placeholder={t('venue_partners.form.capacity_placeholder')}
                    />
                  </div>
                </div>

                {error && <p className="vp-form-error">⚠️ {error}</p>}

                <button
                  id="vp-submit-btn"
                  type="submit"
                  className="vp-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? t('venue_partners.form.sending') : t('venue_partners.form.submit')}
                </button>

                <p className="vp-legal">{t('venue_partners.form.legal')}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VenuePartnersPage;
