import React, { useState } from 'react';
import ApplicationForm from '../../components/ApplicationForm/component';
import './component.css';

// ─── Social Proof Data ──────────────────────────────────────────────────────

const STATS = [
  { value: '100%', label: 'Perfiles verificados antes de entrar' },
  { value: '≤16', label: 'Personas por evento. Siempre.' },
  { value: '48h', label: 'Tiempo máximo de respuesta a tu solicitud' },
];

const FAQ = [
  {
    q: '¿Cómo garantizáis la seguridad?',
    a: 'Cada persona pasa por un proceso de verificación antes de acceder a un evento. No aceptamos perfiles anónimos ni reservas de último minuto sin revisión.',
  },
  {
    q: '¿Cuántas personas hay en cada evento?',
    a: 'Máximo 16. El tamaño es una decisión deliberada: lo suficientemente pequeño para que no haya "escapatoria" fácil, lo suficientemente grande para que haya opciones.',
  },
  {
    q: '¿Tengo que hablar con todo el mundo?',
    a: 'No. No es un speed dating cronometrado. Hay estructura, pero también libertad. Si alguien no te genera curiosidad, nadie te obliga a nada.',
  },
  {
    q: '¿Qué tipo de hombres van a estos eventos?',
    a: 'Perfiles profesionales de 25 a 35 años con la misma selección que tú. Rechazamos el 40% de las solicitudes masculinas. El estándar no es negociable.',
  },
  {
    q: '¿Qué pasa si no conecto con nadie?',
    a: 'Habrás pasado una tarde interesante con personas interesantes. A veces eso también tiene valor. No garantizamos flechazos, sí garantizamos calidad.',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

const LandingWomenPage: React.FC = () => {
  const [formSuccess, setFormSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="lw-page">

      {/* ── Minimal logo header ───────────────────────────────────────── */}
      <header className="lw-header">
        <a href="/" className="lw-logo" aria-label="Volver al inicio">
          <span className="lw-logo-dot" />
          Zapyens
        </a>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="lw-hero" aria-labelledby="lw-hero-title">
        <div className="lw-hero-eyebrow">Solo para mujeres de 25–35 · Acceso por invitación</div>
        <h1 className="lw-hero-title" id="lw-hero-title">
          El trabajo de filtrar<br />
          <span className="lw-hero-highlight">ya está hecho.</span>
        </h1>
        <p className="lw-hero-sub">
          Eventos sociales donde cada persona ha sido verificada. No aplicaciones. No perfiles falsos.
          Solo personas reales, en espacios reales, con intención real.
        </p>
        <a href="#lw-apply" className="lw-hero-cta">
          Solicitar acceso →
        </a>
        <p className="lw-hero-note">Sin coste. Sin compromiso. Respuesta en 48h.</p>
      </section>

      {/* ── Stats / Social Proof ──────────────────────────────────────── */}
      <section className="lw-stats" aria-label="Estadísticas clave">
        {STATS.map((s, i) => (
          <div key={i} className="lw-stat">
            <span className="lw-stat-value">{s.value}</span>
            <span className="lw-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Social Proof Placeholder ──────────────────────────────────── */}
      <section className="lw-proof" aria-label="Testimonios">
        <div className="lw-proof-badge">⭐ Testimonio verificado</div>
        <blockquote className="lw-quote">
          "Por primera vez en mucho tiempo fui a un plan de este tipo sin ansiedad.
          Todo el mundo era exactamente lo que esperaba. Ninguna sorpresa desagradable."
        </blockquote>
        <cite className="lw-cite">— Laura, 29 años · Barcelona</cite>
        <div className="lw-proof-placeholder">
          Más testimonios próximamente · Primer evento en preparación
        </div>
      </section>

      {/* ── 3-Step Process ────────────────────────────────────────────── */}
      <section className="lw-process" aria-labelledby="lw-process-title">
        <h2 className="lw-section-title" id="lw-process-title">Cómo funciona</h2>
        <p className="lw-section-sub">Diseñado para que llegues sabiendo exactamente qué esperar.</p>

        <div className="lw-steps">
          <div className="lw-step-card">
            <div className="lw-step-num">01</div>
            <h3 className="lw-step-title">Solicitas tu plaza</h3>
            <p className="lw-step-desc">
              Tres minutos. Nos dices qué buscas y qué es importante para ti.
              Usamos esa información para cuadrar el grupo, no para hacer marketing.
            </p>
          </div>
          <div className="lw-step-connector" aria-hidden="true" />
          <div className="lw-step-card">
            <div className="lw-step-num">02</div>
            <h3 className="lw-step-title">Revisamos y confirmamos</h3>
            <p className="lw-step-desc">
              En 48h recibirás confirmación. Te enviamos el perfil general del grupo,
              el espacio, y lo que necesitas saber. Con tiempo. Sin prisas.
            </p>
          </div>
          <div className="lw-step-connector" aria-hidden="true" />
          <div className="lw-step-card">
            <div className="lw-step-num">03</div>
            <h3 className="lw-step-title">Apareces (o no)</h3>
            <p className="lw-step-desc">
              Si confirmas, llegas a un espacio cuidado con personas que han pasado
              el mismo proceso que tú. Si en algún momento no te sientes cómoda, nos lo dices. Punto.
            </p>
          </div>
        </div>
      </section>

      {/* ── Trust Module ──────────────────────────────────────────────── */}
      <section className="lw-trust" aria-labelledby="lw-trust-title">
        <h2 className="lw-section-title" id="lw-trust-title">Lo que diferencia a Zapyens</h2>
        <div className="lw-trust-grid">
          <div className="lw-trust-item">
            <span className="lw-trust-icon">🛡️</span>
            <h3>Verificación real</h3>
            <p>No solo un checkbox. Revisamos cada solicitud manualmente.</p>
          </div>
          <div className="lw-trust-item">
            <span className="lw-trust-icon">🌿</span>
            <h3>Grupos pequeños</h3>
            <p>Máximo 16 personas. Puedes irte cuando quieras sin drama.</p>
          </div>
          <div className="lw-trust-item">
            <span className="lw-trust-icon">📍</span>
            <h3>Espacios seguros</h3>
            <p>Locales seleccionados, céntricos, con personal informado.</p>
          </div>
          <div className="lw-trust-item">
            <span className="lw-trust-icon">🔕</span>
            <h3>Sin presión</h3>
            <p>No es speed dating. No hay cronómetros ni guiones incómodos.</p>
          </div>
        </div>
      </section>

      {/* ── CTA + Form ────────────────────────────────────────────────── */}
      <section className="lw-apply" id="lw-apply" aria-labelledby="lw-apply-title">
        <div className="lw-apply-inner">
          <div className="lw-apply-copy">
            <div className="lw-apply-eyebrow">Acceso por solicitud · Plazas limitadas</div>
            <h2 className="lw-apply-title" id="lw-apply-title">
              {formSuccess
                ? '¡Solicitud recibida! 🎉'
                : 'Solicitar acceso al evento'
              }
            </h2>
            {!formSuccess && (
              <p className="lw-apply-sub">
                Máximo 8 mujeres por evento para garantizar equilibrio y comodidad.
                Cuéntanos quién eres y te respondemos en 48h.
              </p>
            )}
          </div>

          {!formSuccess && (
            <div className="lw-apply-form">
              <ApplicationForm
                gender="female"
                onSuccess={() => setFormSuccess(true)}
              />
            </div>
          )}

          {formSuccess && (
            <div className="lw-apply-success">
              <p className="lw-apply-success-body">
                Hemos recibido tu solicitud. En menos de 48h te diremos si hay plaza
                en el próximo evento y te enviamos todos los detalles.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="lw-faq" aria-labelledby="lw-faq-title">
        <h2 className="lw-section-title" id="lw-faq-title">Preguntas frecuentes</h2>
        <div className="lw-faq-list">
          {FAQ.map((item, i) => (
            <div key={i} className="lw-faq-item">
              <button
                id={`lw-faq-btn-${i}`}
                className={`lw-faq-question ${openFaq === i ? 'lw-faq-question--open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                aria-controls={`lw-faq-answer-${i}`}
              >
                {item.q}
                <span className="lw-faq-icon" aria-hidden="true">
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              <div
                id={`lw-faq-answer-${i}`}
                className={`lw-faq-answer ${openFaq === i ? 'lw-faq-answer--open' : ''}`}
                role="region"
              >
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────────── */}
      <section className="lw-footer-cta" aria-label="CTA final">
        <p className="lw-footer-cta-text">¿Todavía evaluando?</p>
        <h3 className="lw-footer-cta-title">
          Las plazas se llenan deprisa. El proceso de revisión lleva 48h.
        </h3>
        <a href="#lw-apply" className="lw-hero-cta lw-footer-cta-btn">
          Solicitar acceso →
        </a>
      </section>

    </div>
  );
};

export default LandingWomenPage;
