import React from 'react';
import { FilterState } from '../types';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
          <Search className="w-5 h-5 text-primary-600" />
          <h2>Filtros de Pesquisa</h2>
        </div>
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-xs font-medium border border-transparent hover:border-gray-200"
        >
          <X className="w-3.5 h-3.5" />
          Limpar Filtros
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
    </div>
  );
};