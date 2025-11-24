import React from 'react';
import { FilterState } from '../types';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-lg border-b pb-2">
        <Search className="w-5 h-5 text-primary-600" />
        <h2>Filtros de Pesquisa</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Company Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Empresa (Nome ou Nº)</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Ex: 123 ou Tech Solutions"
            value={filters.company}
            onChange={(e) => onFilterChange('company', e.target.value)}
          />
        </div>

        {/* Invoice Number Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Nº Nota Fiscal</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Ex: 55021"
            value={filters.nfeNumber}
            onChange={(e) => onFilterChange('nfeNumber', e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Status</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">Todas as Situações</option>
            <option value="pending">Com Inconsistências</option>
            <option value="resolved">Resolvidas / OK</option>
          </select>
        </div>

        {/* Date Range Filters */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Data Emissão (Início)</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Data Emissão (Fim)</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm font-medium"
        >
          <X className="w-4 h-4" />
          Limpar
        </button>
        <button
          onClick={onApplyFilters}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md shadow-sm transition-all text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          Filtrar
        </button>
      </div>
    </div>
  );
};