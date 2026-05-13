const SkeletonCard = () => (
  <div style={{
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #f1f1f1'
  }}>
    <div className="skeleton-shimmer" style={{ height: 180 }} />
    <div style={{ padding: 16 }}>
      <div className="skeleton-shimmer" style={{ height: 16, width: '70%', marginBottom: 8, borderRadius: 8 }} />
      <div className="skeleton-shimmer" style={{ height: 12, width: '50%', marginBottom: 16, borderRadius: 8 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-shimmer" style={{ height: 20, width: 60, borderRadius: 8 }} />
        <div className="skeleton-shimmer" style={{ height: 36, width: 80, borderRadius: 20 }} />
      </div>
    </div>
  </div>
);

export default SkeletonCard;