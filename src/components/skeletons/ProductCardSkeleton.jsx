function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-3xl h-[420px]" />

      <div className="mt-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded-xl w-3/4" />

        <div className="h-5 bg-gray-200 rounded-xl w-1/3" />

        <div className="h-4 bg-gray-200 rounded-xl w-1/2" />
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
