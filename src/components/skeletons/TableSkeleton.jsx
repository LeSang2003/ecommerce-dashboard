import Skeleton from "../Skeleton";

function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      {/* Header */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>

      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 mb-3">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;
