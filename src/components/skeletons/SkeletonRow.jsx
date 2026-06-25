function SkeletonRow() {
  return (
    <tr className="animate-pulse border-t">
      <td className="p-2">
        <div className="w-14 h-14 bg-gray-300 rounded"></div>
      </td>
      <td>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </td>
      <td>
        <div className="h-4 bg-gray-300 rounded w-10"></div>
      </td>
      <td>
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
      <td>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </td>
    </tr>
  );
}

export default SkeletonRow;
