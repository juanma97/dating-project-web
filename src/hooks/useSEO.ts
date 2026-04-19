import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description?: string;
  /** Canonical URL for this page. Defaults to window.location.href */
  canonical?: string;
  /** Open Graph image URL */
  ogImage?: string;
}

/**
 * Lightweight hook for per-page SEO metadata.
 * Updates document.title and the <meta name="description"> tag dynamically
 * on each route so every page has unique, crawlable metadata.
 *
 * Falls back to the base site name if title is empty.
 */
export const useSEO = ({
  title,
  description,
  canonical,
  ogImage,
}: SEOOptions): void => {
  useEffect(() => {
    // --- Title -----------------------------------------------------------------
    const previousTitle = document.title;
    document.title = title || 'Zapyens';

    // --- Meta description -------------------------------------------------------
    let descTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDesc = descTag?.content ?? '';
    if (description) {
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.name = 'description';
        document.head.appendChild(descTag);
      }
      descTag.content = description;
    }

    // --- Open Graph title / description ----------------------------------------
    const ogTitleTag = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescTag = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const ogUrlTag = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    const ogImageTag = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');

    if (ogTitleTag) ogTitleTag.content = title;
    if (ogDescTag && description) ogDescTag.content = description;
    if (ogUrlTag) ogUrlTag.content = canonical ?? window.location.href;
    if (ogImageTag && ogImage) ogImageTag.content = ogImage;

    // --- Canonical link --------------------------------------------------------
    let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.rel = 'canonical';
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.href = canonical;
    }

    // --- Twitter card title / description -------------------------------------
    const twitterTitleTag = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const twitterDescTag = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    if (twitterTitleTag) twitterTitleTag.content = title;
    if (twitterDescTag && description) twitterDescTag.content = description;

    // Cleanup: restore original values when component unmounts
    return () => {
      document.title = previousTitle;
      if (descTag) descTag.content = previousDesc;
    };
  }, [title, description, canonical, ogImage]);
};
