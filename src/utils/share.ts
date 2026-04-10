export const getEventUrl = (eventId: string, isPremium: boolean = false) => {
  const origin = window.location.origin;
  const path = isPremium ? `/premium-events/${eventId}` : `/events/${eventId}`;
  return `${origin}${path}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const shareOnWhatsApp = (title: string, url: string) => {
  const text = encodeURIComponent(`¡Mira este evento!: ${title} ${url}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
};

export const shareOnTelegram = (title: string, url: string) => {
  const text = encodeURIComponent(`¡Mira este evento!: ${title} ${url}`);
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
};

export const canUseNativeShare = (): boolean => {
  return !!navigator.share;
};

export const nativeShare = async (title: string, url: string): Promise<boolean> => {
  if (canUseNativeShare()) {
    try {
      await navigator.share({
        title,
        text: `¡Mira este evento!: ${title}`,
        url,
      });
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
      return false;
    }
  }
  return false;
};
