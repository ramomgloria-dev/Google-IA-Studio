import React, { useState, useMemo } from 'react';
import { InvoiceList } from './components/InvoiceList';
import { FilterBar } from './components/FilterBar';
import { AnalyticsBar } from './components/AnalyticsBar';
import { InconsistencyModal } from './components/InconsistencyModal';
import { AreaManager } from './components/AreaManager';
import { Pagination } from './components/Pagination';
import { Invoice, FilterState, Area, User } from './types';
import { INITIAL_INVOICES, INITIAL_AREAS, INITIAL_USERS } from './mockData';
import { LayoutDashboard, Settings, UserCircle2, ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const App: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [areas, setAreas] = useState<Area[]>(INITIAL_AREAS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'areas'>('dashboard');

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    company: '',
    nfeNumber: '',
    startDate: '',
    endDate: '',
    status: 'all'
  });
  
  // Temporary filter state for the inputs (applied only on button click)
  const [tempFilters, setTempFilters] = useState<FilterState>({
    company: '',
    nfeNumber: '',
    startDate: '',
    endDate: '',
    status: 'all'
  });

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchCompany = 
        activeFilters.company === '' || 
        invoice.companyName.toLowerCase().includes(activeFilters.company.toLowerCase()) ||
        invoice.companyNumber.includes(activeFilters.company);
        
      const matchNfe = 
        activeFilters.nfeNumber === '' || 
        invoice.nfeNumber.includes(activeFilters.nfeNumber);
        
      const invoiceDate = new Date(invoice.issueDate).getTime();
      
      const matchStartDate = 
        activeFilters.startDate === '' || 
        invoiceDate >= new Date(activeFilters.startDate).getTime();
        
      const matchEndDate = 
        activeFilters.endDate === '' || 
        invoiceDate <= new Date(activeFilters.endDate).getTime();

      const unresolvedCount = invoice.inconsistencies.filter(i => !i.isResolved).length;
      
      const matchStatus = 
        activeFilters.status === 'all' ||
        (activeFilters.status === 'pending' && unresolvedCount > 0) ||
        (activeFilters.status === 'resolved' && unresolvedCount === 0);

      return matchCompany && matchNfe && matchStartDate && matchEndDate && matchStatus;
    });
  }, [invoices, activeFilters]);

  // Pagination Logic
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInvoices, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleOpenModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedInvoice(null), 300); // Wait for animation
  };

  const handleConfirmModal = (updatedInvoice: Invoice) => {
    const isFullyResolved = updatedInvoice.inconsistencies.every(i => i.isResolved);
    
    // If fully resolved and doesn't have a resolution date yet, add it
    const finalInvoice = {
      ...updatedInvoice,
      resolvedAt: isFullyResolved && !updatedInvoice.resolvedAt 
        ? new Date().toISOString() 
        : (!isFullyResolved ? undefined : updatedInvoice.resolvedAt) // Reset if un-resolved
    };

    setInvoices((prev) => 
      prev.map((inv) => inv.id === finalInvoice.id ? finalInvoice : inv)
    );
    handleCloseModal();
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setActiveFilters(tempFilters);
    setCurrentPage(1); // Reset to first page on filter apply
  };

  const clearFilters = () => {
    const emptyState = {
      company: '',
      nfeNumber: '',
      startDate: '',
      endDate: '',
      status: 'all'
    };
    setTempFilters(emptyState);
    setActiveFilters(emptyState);
    setCurrentPage(1);
  };

  // Area Manager Handlers
  const handleAddArea = (name: string) => {
    const newArea: Area = {
      id: Math.random().toString(36).substr(2, 9),
      name
    };
    setAreas([...areas, newArea]);
  };

  const handleDeleteArea = (id: string) => {
    setAreas(areas.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <LayoutDashboard size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 hidden md:block">
              Controle de Inconsistências <span className="text-primary-600">NF-e</span>
            </h1>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 md:hidden">
              <span className="text-primary-600">NF-e</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* View Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-md">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-1 text-sm font-medium rounded-sm transition-all ${
                  currentView === 'dashboard' ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('areas')}
                className={`px-3 py-1 text-sm font-medium rounded-sm transition-all flex items-center gap-1 ${
                  currentView === 'areas' ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="w-3 h-3" /> Clusters
              </button>
            </div>

            {/* User Switcher (For Demo Purposes) */}
            <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
               <UserCircle2 className="w-5 h-5 text-gray-400" />
               <div className="relative group">
                 <select 
                   className="appearance-none bg-transparent font-medium text-sm text-gray-700 pr-6 focus:outline-none cursor-pointer"
                   value={currentUser.id}
                   onChange={(e) => {
                     const user = INITIAL_USERS.find(u => u.id === e.target.value);
                     if (user) setCurrentUser(user);
                   }}
                 >
                   {INITIAL_USERS.map(user => (
                     <option key={user.id} value={user.id}>
                       {user.name}
                     </option>
                   ))}
                 </select>
                 <ChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === 'dashboard' ? (
          <>
            {/* Filter Section */}
            <FilterBar 
              filters={tempFilters}
              onFilterChange={handleFilterChange}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
            />

            {/* Analytics Section */}
            <AnalyticsBar invoices={filteredInvoices} />

            {/* Results Info */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Exibindo <strong>{paginatedInvoices.length}</strong> de <strong>{filteredInvoices.length}</strong> notas encontradas
              </p>
            </div>

            {/* List */}
            <InvoiceList 
              invoices={paginatedInvoices}
              onOpenModal={handleOpenModal}
            />

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalItems={filteredInvoices.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <AreaManager 
            areas={areas} 
            onAddArea={handleAddArea} 
            onDeleteArea={handleDeleteArea}
          />
        )}
      </main>

      {/* Modal */}
      <InconsistencyModal 
        isOpen={isModalOpen}
        invoice={selectedInvoice}
        areas={areas}
        currentUser={currentUser}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
    </div>
  );
};

export default App;