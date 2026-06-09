export default function ProductImagesSkeleton() {
  return (
    <div className="product-images">
      <div className="product-image-main skeleton" />
      <div className="product-image-thumbs">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="product-thumb skeleton" />
        ))}
      </div>
    </div>
  );
}
