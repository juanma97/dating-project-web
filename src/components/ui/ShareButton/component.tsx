import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getEventUrl, nativeShare, canUseNativeShare } from '../../../utils/share';
import Button from '../Button/component';
import Toast from '../Toast/component';
import ShareModal from '../ShareModal/component';

interface ShareButtonProps {
  title: string;
  eventId: string;
  isPremium?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  eventId,
  isPremium = false,
  className = '',
  variant = 'outline',
  size = 'md',
}) => {
  const { t } = useTranslation();
  const [showShareModal, setShowShareModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'info' | 'success' | 'error';
  } | null>(null);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getEventUrl(eventId, isPremium);

    if (canUseNativeShare()) {
      await nativeShare(title, url);
    } else {
      setShowShareModal(true);
    }
  };

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`share-button ${className}`}
        onClick={handleShare}
      >
        <span>📤</span> {t('share.share_button')}
      </Button>

      {showShareModal && (
        <ShareModal
          title={title}
          url={getEventUrl(eventId, isPremium)}
          onClose={() => setShowShareModal(false)}
          onShowToast={showToast}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default ShareButton;
