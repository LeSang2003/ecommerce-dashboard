function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* IMAGE */}
        <div>
          <div className="bg-gray-200 rounded-3xl h-[700px]" />

          <div className="flex gap-3 mt-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-24 h-24 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="space-y-6">
          <div className="h-12 bg-gray-200 rounded-xl w-3/4" />

          <div className="h-8 bg-gray-200 rounded-xl w-1/3" />

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-6 h-6 bg-gray-200 rounded-full" />
            ))}
          </div>

          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>

          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-24 bg-gray-200 rounded-2xl" />
            ))}
          </div>

          <div className="flex gap-4">
            <div className="h-14 w-52 bg-gray-200 rounded-2xl" />
            <div className="h-14 w-14 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailSkeleton;
