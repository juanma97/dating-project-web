import React from 'react';
import { useNavigate } from 'react-router-dom';
import { trackViewPremiumEvents } from '../../utils/analytics';
import './component.css';

interface PremiumPromoCardProps {
  /** Called when user taps "Avísame cuando haya plazas" */
  onNotifyMe?: () => void;
}

const PremiumPromoCard: React.FC<PremiumPromoCardProps> = ({ onNotifyMe }) => {
  const navigate = useNavigate();

  const handleViewPremium = () => {
    trackViewPremiumEvents();
    navigate('/premium-events');
  };

  return (
    <div className="premium-promo-card" role="complementary" aria-label="Eventos Premium">
      <div className="premium-promo-badge">✨ Exclusivo</div>
      <h3 className="premium-promo-title">¿Buscas algo más íntimo?</h3>
      <p className="premium-promo-body">
        Eventos organizados por nosotros — locales cuidados, ratios equilibrados, experiencia completa.
      </p>
      <div className="premium-promo-actions">
        <button
          id="premium-promo-view-btn"
          className="premium-promo-btn-primary"
          onClick={handleViewPremium}
        >
          Ver Eventos Premium →
        </button>
        {onNotifyMe && (
          <button
            id="premium-promo-notify-btn"
            className="premium-promo-btn-secondary"
            onClick={onNotifyMe}
          >
            Avísame cuando haya plazas
          </button>
        )}
      </div>
    </div>
  );
};

export default PremiumPromoCard;
