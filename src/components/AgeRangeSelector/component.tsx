import React, { useState, useRef, useCallback, useEffect } from 'react';
import './component.css';

interface AgeRangeSelectorProps {
  min: number;
  max: number;
  initialValues?: { minAge: number; maxAge: number };
  onChange: (values: { minAge: number; maxAge: number }) => void;
}

const AgeRangeSelector: React.FC<AgeRangeSelectorProps> = ({
  min,
  max,
  initialValues = { minAge: 18, maxAge: 40 },
  onChange,
}) => {
  const [minAge, setMinAge] = useState(initialValues.minAge);
  const [maxAge, setMaxAge] = useState(initialValues.maxAge);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<'min' | 'max' | null>(null);

  const toPercent = useCallback((value: number) => ((value - min) / (max - min)) * 100, [min, max]);

  const fromPercent = useCallback(
    (percent: number) => Math.round((percent / 100) * (max - min) + min),
    [min, max],
  );

  const getPercentFromEvent = useCallback((clientX: number): number => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(0, Math.min(100, percent));
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!draggingRef.current) return;
      const percent = getPercentFromEvent(clientX);
      const value = fromPercent(percent);

      if (draggingRef.current === 'min') {
        const clamped = Math.min(value, maxAge - 1);
        setMinAge(Math.max(min, clamped));
      } else {
        const clamped = Math.max(value, minAge + 1);
        setMaxAge(Math.min(max, clamped));
      }
    },
    [fromPercent, getPercentFromEvent, min, max, minAge, maxAge],
  );

  const handleEnd = useCallback(() => {
    draggingRef.current = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  // Mouse events
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleMove, handleEnd]);

  // Touch events
  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleMove, handleEnd]);

  // Emit changes
  useEffect(() => {
    onChange({ minAge, maxAge });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minAge, maxAge]);

  const startDrag = (thumb: 'min' | 'max') => {
    draggingRef.current = thumb;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  const leftPercent = toPercent(minAge);
  const rightPercent = toPercent(maxAge);

  return (
    <div className="age-range-selector" data-testid="age-range-selector">
      <div className="age-range-label">
        <span className="age-label">
          Age range:{' '}
          <span className="age-values">
            {minAge} – {maxAge}
          </span>
        </span>
      </div>

      <div className="age-range-track-wrapper" ref={trackRef}>
        {/* Background track */}
        <div className="age-range-track" />

        {/* Highlighted range */}
        <div
          className="age-range-fill"
          style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
        />

        {/* Min handle */}
        <div
          className="age-range-handle"
          role="slider"
          aria-label="Minimum age"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={minAge}
          style={{ left: `${leftPercent}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            startDrag('min');
          }}
          onTouchStart={() => startDrag('min')}
        />

        {/* Max handle */}
        <div
          className="age-range-handle"
          role="slider"
          aria-label="Maximum age"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={maxAge}
          style={{ left: `${rightPercent}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            startDrag('max');
          }}
          onTouchStart={() => startDrag('max')}
        />
      </div>
    </div>
  );
};

export default AgeRangeSelector;
