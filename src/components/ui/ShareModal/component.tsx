import React from 'react';
import { useTranslation } from 'react-i18next';
import { copyToClipboard, shareOnWhatsApp, shareOnTelegram } from '../../../utils/share';
import './component.css';

interface ShareModalProps {
  title: string;
  url: string;
  onClose: () => void;
  onShowToast: (message: string, type?: 'info' | 'success' | 'error') => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ title, url, onClose, onShowToast }) => {
  const { t } = useTranslation();

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      onShowToast(t('share.link_copied'), 'success');
      onClose();
    }
  };

  const handleWhatsApp = () => {
    onShowToast(t('share.open_whatsapp'), 'info');
    shareOnWhatsApp(title, url);
    onClose();
  };

  const handleTelegram = () => {
    onShowToast(t('share.open_telegram'), 'info');
    shareOnTelegram(title, url);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="modal-card share-modal-card">
        <button className="modal-close-btn" onClick={onClose} aria-label={t('lead_capture.close')}>
          ✕
        </button>

        <div className="modal-header">
          <h2 className="modal-title">{t('share.title')}</h2>
          <p className="modal-subtitle">{title}</p>
        </div>

        <div className="share-options">
          <button className="share-option-btn whatsapp" onClick={handleWhatsApp}>
            <span className="share-icon">💬</span>
            <span className="share-label">{t('share.whatsapp')}</span>
          </button>

          <button className="share-option-btn telegram" onClick={handleTelegram}>
            <span className="share-icon">✈️</span>
            <span className="share-label">{t('share.telegram')}</span>
          </button>

          <button className="share-option-btn copy" onClick={handleCopyLink}>
            <span className="share-icon">🔗</span>
            <span className="share-label">{t('share.copy_link')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
