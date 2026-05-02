import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardFunnel, { WizardFilters } from '../../components/WizardFunnel/component';
import MatchGuaranteeModule from '../../components/MatchGuaranteeModule/component';
import NotifyMeModal, { NotifyMeSource } from '../../components/NotifyMeModal/component';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import { useSEO } from '../../hooks/useSEO';
import { useTranslation } from 'react-i18next';
import './component.css';

const FindEventPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useSEO({
    title: 'Encuentra tu evento — Zapyens',
    description:
      'Dinos tu edad y cuándo quieres ir — te mostramos los eventos de speed dating en Madrid que encajan contigo.',
    canonical: 'https://zapyens.com/encontrar',
  });

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifySource] = useState<NotifyMeSource>('premium-promo');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await eventsApi.fetchEvents();
        setAllEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('landing.error_fetch'));
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, []);

  const handleWizardComplete = (_filters: WizardFilters, _matchCount: number) => {
    // Future: persist filters in sessionStorage for back-navigation recovery
  };

  return (
    <div className="find-event-page">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="find-event-header">
        <button
          className="find-event-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver a la página anterior"
        >
          ← Volver
        </button>
        <div className="find-event-title-block">
          <h1 className="find-event-title">Encuentra tu evento</h1>
          <p className="find-event-subtitle">📍 Solo en Madrid</p>
        </div>
      </div>

      {/* ── Error state ──────────────────────────────────────────── */}
      {error && (
        <div className="container">
          <p className="find-event-error">{error}</p>
        </div>
      )}

      {/* ── Social proof — shown above wizard to prime confidence ── */}
      <div className="container">
        <MatchGuaranteeModule />
      </div>

      {/* ── Wizard ───────────────────────────────────────────────── */}
      <WizardFunnel
        allEvents={allEvents}
        loading={loading}
        onComplete={handleWizardComplete}
        onPremiumNotifyMe={() => setNotifyModalOpen(true)}
      />

      <NotifyMeModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        source={notifySource}
      />
    </div>
  );
};

export default FindEventPage;
