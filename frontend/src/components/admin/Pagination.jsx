function Pagination({
  pagination,
  onPageChange,
}) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = pagination;

  return (
    <div className="flex items-center justify-between mt-5 px-1">
      {/* Results info */}
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-2 text-sm border rounded-lg bg-white
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-50 transition"
        >
          ← Previous
        </button>

        <span className="px-3 py-2 text-sm font-medium text-gray-700">
          {currentPage}
        </span>

        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-2 text-sm border rounded-lg bg-white
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-50 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Pagination;