import React, { useState } from 'react';
import ApplicationForm from '../../components/ApplicationForm/component';
import './component.css';

// ─── Social Proof Data ──────────────────────────────────────────────────────

const STATS = [
  { value: '94%', label: 'Tasa de coincidencia en el evento' },
  { value: '2h', label: 'Promedio por sesión presencial' },
  { value: '+15', label: 'Conversaciones reales por noche' },
];

const FAQ = [
  {
    q: '¿Quién va a estos eventos?',
    a: 'Hombres de 25 a 35 años con perfil profesional, verificados antes de entrar. Sin perfiles fake, sin usuarios inactivos.',
  },
  {
    q: '¿Cuántas personas hay por evento?',
    a: 'Entre 12 y 20 personas. El tamaño es intencional: suficiente variedad, sin el caos de una discoteca.',
  },
  {
    q: '¿Es un speed dating?',
    a: 'No exactamente. Es una sesión social estructurada. Hay tiempo libre, actividades y momentos de conexión. Sin cronómetros incómodos.',
  },
  {
    q: '¿Cómo sé que las mujeres también son de calidad?',
    a: 'Aplicamos el mismo proceso de selección a ambos lados. Rechazamos el 40% de las solicitudes. El estándar es el mismo para todos.',
  },
  {
    q: '¿Qué pasa si no me encaja nadie?',
    a: 'Nada. El objetivo no es "ligar" obligatoriamente, es ampliar tu mundo social con personas que merecen tu tiempo.',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

const LandingManPage: React.FC = () => {
  const [formSuccess, setFormSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="lm-page">

      {/* ── Minimal logo header ───────────────────────────────────────── */}
      <header className="lm-header">
        <a href="/" className="lm-logo" aria-label="Volver al inicio">
          <span className="lm-logo-dot" />
          Zapyens
        </a>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="lm-hero" aria-labelledby="lm-hero-title">
        <div className="lm-hero-eyebrow">Solo para hombres de 25–35 · Plazas limitadas</div>
        <h1 className="lm-hero-title" id="lm-hero-title">
          Deja de optimizar tu bio.<br />
          <span className="lm-hero-highlight">Empieza a aparecer.</span>
        </h1>
        <p className="lm-hero-sub">
          Eventos sociales curados donde cada persona ha pasado por un proceso de selección real.
          No es una app. No es un bar. Es el atajo que no sabías que existía.
        </p>
        <a href="#lm-apply" className="lm-hero-cta">
          Solicitar mi plaza →
        </a>
        <p className="lm-hero-note">Sin coste. Sin compromiso. Solo 3 minutos.</p>
      </section>

      {/* ── Stats / Social Proof ──────────────────────────────────────── */}
      <section className="lm-stats" aria-label="Estadísticas clave">
        {STATS.map((s, i) => (
          <div key={i} className="lm-stat">
            <span className="lm-stat-value">{s.value}</span>
            <span className="lm-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Social Proof Placeholder ──────────────────────────────────── */}
      <section className="lm-proof" aria-label="Testimonios">
        <div className="lm-proof-badge">⭐ Testimonio verificado</div>
        <blockquote className="lm-quote">
          "Fui sin expectativas y salí con tres números y un café pendiente para el lunes.
          En seis meses de Tinder no conseguí eso."
        </blockquote>
        <cite className="lm-cite">— Javier, 31 años · Madrid</cite>
        <div className="lm-proof-placeholder">
          Más testimonios próximamente · Primer evento en preparación
        </div>
      </section>

      {/* ── 3-Step Process ────────────────────────────────────────────── */}
      <section className="lm-process" aria-labelledby="lm-process-title">
        <h2 className="lm-section-title" id="lm-process-title">Cómo funciona</h2>
        <p className="lm-section-sub">Sin algoritmos. Sin swipes. Sin incertidumbre.</p>

        <div className="lm-steps">
          <div className="lm-step-card">
            <div className="lm-step-num">01</div>
            <h3 className="lm-step-title">Solicitas tu plaza</h3>
            <p className="lm-step-desc">
              Rellenas el formulario en 3 minutos. Nos dices qué buscas y cuándo puedes.
              Esto no es una lista de espera: es un proceso de selección bidireccional.
            </p>
          </div>
          <div className="lm-step-connector" aria-hidden="true" />
          <div className="lm-step-card">
            <div className="lm-step-num">02</div>
            <h3 className="lm-step-title">Te confirmamos</h3>
            <p className="lm-step-desc">
              En 48h sabrás si tienes plaza. Te enviamos los detalles del evento:
              lugar, formato y el perfil del grupo. Sin sorpresas.
            </p>
          </div>
          <div className="lm-step-connector" aria-hidden="true" />
          <div className="lm-step-card">
            <div className="lm-step-num">03</div>
            <h3 className="lm-step-title">Apareces</h3>
            <p className="lm-step-desc">
              Llegas a un espacio seleccionado con 10–12 personas que ya han pasado el filtro.
              Haces lo que sabes hacer. Nosotros pusimos las condiciones; tú pones la conversación.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA + Form ────────────────────────────────────────────────── */}
      <section className="lm-apply" id="lm-apply" aria-labelledby="lm-apply-title">
        <div className="lm-apply-inner">
          <div className="lm-apply-copy">
            <div className="lm-apply-eyebrow">Acceso exclusivo · Plazas limitadas</div>
            <h2 className="lm-apply-title" id="lm-apply-title">
              {formSuccess
                ? '¡Solicitud recibida! 🎉'
                : 'Solicita tu plaza ahora'
              }
            </h2>
            {!formSuccess && (
              <p className="lm-apply-sub">
                Cupos limitados a 12 hombres por evento. El proceso de revisión tarda menos de 48h.
              </p>
            )}
          </div>

          {!formSuccess && (
            <div className="lm-apply-form">
              <ApplicationForm
                gender="male"
                onSuccess={() => setFormSuccess(true)}
              />
            </div>
          )}

          {formSuccess && (
            <div className="lm-apply-success">
              <p className="lm-apply-success-body">
                Te avisaremos en menos de 48h con los detalles de tu evento.
                Mientras tanto, nada que hacer. Ya pusiste el trabajo.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="lm-faq" aria-labelledby="lm-faq-title">
        <h2 className="lm-section-title" id="lm-faq-title">Preguntas frecuentes</h2>
        <div className="lm-faq-list">
          {FAQ.map((item, i) => (
            <div key={i} className="lm-faq-item">
              <button
                id={`lm-faq-btn-${i}`}
                className={`lm-faq-question ${openFaq === i ? 'lm-faq-question--open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                aria-controls={`lm-faq-answer-${i}`}
              >
                {item.q}
                <span className="lm-faq-icon" aria-hidden="true">
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              <div
                id={`lm-faq-answer-${i}`}
                className={`lm-faq-answer ${openFaq === i ? 'lm-faq-answer--open' : ''}`}
                role="region"
              >
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────────── */}
      <section className="lm-footer-cta" aria-label="CTA final">
        <p className="lm-footer-cta-text">¿Sigues dudando?</p>
        <h3 className="lm-footer-cta-title">
          Cada semana que esperas, otra plaza se llena.
        </h3>
        <a href="#lm-apply" className="lm-hero-cta lm-footer-cta-btn">
          Solicitar mi plaza →
        </a>
      </section>

    </div>
  );
};

export default LandingManPage;
