import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    // Always show first, last, current, and surrounding pages
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - 2 && i > 1) ||
        (i === currentPage + 2 && i < totalPages)
      ) {
        pages.push('...');
      }
    }
    // Remove duplicates caused by '...' logic if distinct check is needed, 
    // but the simple logic above usually works for standard ranges.
    // A simpler approach for small ranges:
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
        p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
    );
  };
  
  // Use a simpler array generation for the buttons to avoid complexity with ellipses for now
  // given the likely small dataset, but robust enough for growth.
  const renderPageButtons = () => {
    const pages = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage < maxVisibleButtons - 1) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages.map(page => (
        <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
        >
            {page}
        </button>
    ));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-gray-200 mt-4 bg-white rounded-lg shadow-sm">
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-medium text-gray-900">{startItem}</span> a{' '}
        <span className="font-medium text-gray-900">{endItem}</span> de{' '}
        <span className="font-medium text-gray-900">{totalItems}</span> resultados
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
            {renderPageButtons()}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Próximo"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};