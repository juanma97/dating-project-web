import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import AgeRangeSelector from '../AgeRangeSelector/component';
import DateRangeSelector from '../DateRangeSelector/component';
import { SeekerFilters } from '../Seeker/component';
import './component.css';

interface SeekerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SeekerFilters) => void;
  currentFilters: SeekerFilters;
  resultsCount?: number;
  isFiltering?: boolean;
}

const GENDERS = [
  { value: 'straight', labelKey: 'seeker.straight', flag: '👫' },
  { value: 'gay', labelKey: 'seeker.gay', flag: '👬' },
  { value: 'lesbian', labelKey: 'seeker.lesbian', flag: '👭' },
  { value: 'bisexual', labelKey: 'seeker.bisexual', flag: '🏳️‍🌈' },
  { value: 'non-binary', labelKey: 'seeker.non_binary', flag: '🏳️‍⚧️' },
];

const SeekerModal: React.FC<SeekerModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  resultsCount = 0,
  isFiltering = false,
}) => {
  const { t } = useTranslation();

  // Local draft state — only committed when user clicks Apply
  const [draft, setDraft] = useState<SeekerFilters>(currentFilters);

  // Sync draft when modal opens (pick up latest applied filters)
  useEffect(() => {
    if (isOpen) {
      setDraft(currentFilters);
    }
  }, [isOpen]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    const reset: SeekerFilters = {
      ageMin: 25,
      ageMax: 40,
      gender: '',
      dateStart: null,
      dateEnd: null,
    };
    setDraft(reset);
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="seeker-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className="seeker-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t('seeker.filters_title')}
      >
        {/* Header */}
        <div className="seeker-modal-header">
          <h2 className="seeker-modal-title">{t('seeker.filters_title')}</h2>
          <button
            className="seeker-modal-close"
            onClick={onClose}
            aria-label={t('common.cancel')}
          >
            ✕
          </button>
        </div>

        {/* Filters body */}
        <div className="seeker-modal-body">
          {/* Age */}
          <div className="seeker-modal-filter-group">
            <AgeRangeSelector
              min={18}
              max={65}
              initialValues={{ minAge: draft.ageMin, maxAge: draft.ageMax }}
              onChange={(values) =>
                setDraft((prev) => ({
                  ...prev,
                  ageMin: values.minAge,
                  ageMax: values.maxAge,
                }))
              }
            />
          </div>

          {/* Dates */}
          <div className="seeker-modal-filter-group">
            <label className="seeker-modal-label">{t('seeker.dates')}</label>
            <DateRangeSelector
              initialStartDate={draft.dateStart}
              initialEndDate={draft.dateEnd}
              onChange={(range) =>
                setDraft((prev) => ({
                  ...prev,
                  dateStart: range.startDate,
                  dateEnd: range.endDate,
                }))
              }
            />
          </div>

          {/* Gender */}
          <div className="seeker-modal-filter-group">
            <label htmlFor="modal-gender" className="seeker-modal-label">
              {t('seeker.gender')}
            </label>
            <div className="seeker-modal-select-wrapper">
              <select
                id="modal-gender"
                name="gender"
                value={draft.gender}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="seeker-modal-select"
              >
                <option value="">{t('seeker.select_gender')}</option>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.flag} {t(g.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="seeker-modal-footer">
          <button className="seeker-modal-reset-btn" onClick={handleReset}>
            {t('landing.clear_filters')}
          </button>
          <button className="seeker-modal-apply-btn" onClick={handleApply}>
            {isFiltering
              ? '...'
              : t('seeker.apply_filters', { count: resultsCount })}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default SeekerModal;
