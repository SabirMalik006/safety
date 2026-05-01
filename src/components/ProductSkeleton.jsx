import './ProductSkeleton.css';

const ProductSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image pulse"></div>
      <div className="skeleton-content">
        <div className="skeleton-text skeleton-title pulse"></div>
        <div className="skeleton-text skeleton-price pulse"></div>
        <div className="skeleton-button pulse"></div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="skeleton-grid">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductSkeleton;
