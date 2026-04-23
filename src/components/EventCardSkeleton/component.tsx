import React from 'react';
import './component.css';

const EventCardSkeleton: React.FC = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton-banner shimmer" />
    <div className="skeleton-badge shimmer" />
    <div className="skeleton-body">
      <div className="skeleton-title shimmer" />
      <div className="skeleton-chip shimmer" />
      <div className="skeleton-chip skeleton-chip--short shimmer" />
      <div className="skeleton-btn shimmer" />
    </div>
  </div>
);

interface EventCardSkeletonListProps {
  count?: number;
}

export const EventCardSkeletonList: React.FC<EventCardSkeletonListProps> = ({ count = 3 }) => (
  <div className="events-grid">
    {Array.from({ length: count }).map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </div>
);

export default EventCardSkeleton;
