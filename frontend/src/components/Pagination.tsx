import './Pagination.css';

interface PaginationProps {
  currentSince: number;
  perPage: number;
  onPerPageChange: (value: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  isLoading: boolean;
  hasData: boolean;
}

export function Pagination({
  currentSince,
  perPage,
  onPerPageChange,
  onNextPage,
  onPreviousPage,
  isLoading,
  hasData,
}: PaginationProps) {
  return (
    <div className="pagination">
      <div className="pagination-controls">
        <div className="control-group">
          <label htmlFor="perPage">Per Page:</label>
          <select
            id="perPage"
            value={perPage}
            onChange={(e) => onPerPageChange(parseInt(e.target.value))}
            disabled={isLoading}
            className="select-field"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className="button-group">
          <button
            onClick={onPreviousPage}
            disabled={isLoading || currentSince === 0}
            className="btn btn-secondary"
          >
            ← Previous
          </button>

          <button
            onClick={onNextPage}
            disabled={isLoading || !hasData}
            className="btn btn-primary"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="pagination-info">
        <p>Showing <strong>{perPage}</strong> users per page</p>
      </div>
    </div>
  );
}
