
import React, { useState, useMemo } from 'react';
import { InvoiceList } from './components/InvoiceList';
import { FilterBar } from './components/FilterBar';
import { AnalyticsBar } from './components/AnalyticsBar';
import { InconsistencyModal } from './components/InconsistencyModal';
import { AreaManager } from './components/AreaManager';
import { UserManager } from './components/UserManager';
import { Pagination } from './components/Pagination';
import { Reports } from './components/Reports';
import { Invoice, FilterState, Area, User } from './types';
import { INITIAL_INVOICES, INITIAL_AREAS, INITIAL_USERS } from './mockData';
import { LayoutDashboard, Settings, UserCircle2, ChevronDown, BarChart2, Users } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const App: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [areas, setAreas] = useState<Area[]>(INITIAL_AREAS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  
  // Auth / Session simulation
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  
  // View State
  const [currentView, setCurrentView] = useState<'dashboard' | 'areas' | 'reports' | 'users'>('dashboard');

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
    
    const finalInvoice = {
      ...updatedInvoice,
      resolvedAt: isFullyResolved && !updatedInvoice.resolvedAt 
        ? new Date().toISOString() 
        : (!isFullyResolved ? undefined : updatedInvoice.resolvedAt)
    };

    setInvoices((prev) => 
      prev.map((inv) => inv.id === finalInvoice.id ? finalInvoice : inv)
    );
    handleCloseModal();
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); 
  };

  const clearFilters = () => {
    const emptyState = {
      company: '',
      nfeNumber: '',
      startDate: '',
      endDate: '',
      status: 'all'
    };
    setActiveFilters(emptyState);
    setCurrentPage(1);
  };

  // Area Manager Handlers
  const handleAddArea = (name: string) => {
    const newArea: Area = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      emails: []
    };
    setAreas([...areas, newArea]);
  };

  const handleDeleteArea = (id: string) => {
    setAreas(areas.filter(a => a.id !== id));
  };

  const handleUpdateAreaEmails = (areaId: string, emails: string[]) => {
    setAreas(prev => prev.map(a => a.id === areaId ? { ...a, emails } : a));
  };

  // User Manager Handlers
  const handleAddUser = (user: User) => {
    setUsers([...users, user]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
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
            <div className="flex bg-gray-100 p-1 rounded-md overflow-x-auto">
              {currentUser.allowedPages?.includes('dashboard') && (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-3 py-1 text-sm font-medium rounded-sm transition-all flex items-center gap-1 whitespace-nowrap ${
                    currentView === 'dashboard' ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LayoutDashboard className="w-3 h-3" /> Dashboard
                </button>
              )}
              {currentUser.allowedPages?.includes('reports') && (
                <button
                  onClick={() => setCurrentView('reports')}
                  className={`px-3 py-1 text-sm font-medium rounded-sm transition-all flex items-center gap-1 whitespace-nowrap ${
                    currentView === 'reports' ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart2 className="w-3 h-3" /> Relatórios
                </button>
              )}
              {currentUser.allowedPages?.includes('areas') && (
                <button
                  onClick={() => setCurrentView('areas')}
                  className={`px-3 py-1 text-sm font-medium rounded-sm transition-all flex items-center gap-1 whitespace-nowrap ${
                    currentView === 'areas' ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="w-3 h-3" /> Clusters
                </button>
              )}
              {currentUser.allowedPages?.includes('users') && (
                <button
                  onClick={() => setCurrentView('users')}
                  className={`px-3 py-1 text-sm font-medium rounded-sm transition-all flex items-center gap-1 whitespace-nowrap ${
                    currentView === 'users' ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="w-3 h-3" /> Usuários
                </button>
              )}
            </div>

            {/* User Switcher (Simulation) */}
            <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
               <UserCircle2 className="w-5 h-5 text-gray-400" />
               <div className="relative group">
                 <select 
                   className="appearance-none bg-transparent font-medium text-sm text-gray-700 pr-6 focus:outline-none cursor-pointer max-w-[100px] sm:max-w-none truncate"
                   value={currentUser.id}
                   onChange={(e) => {
                     const user = users.find(u => u.id === e.target.value);
                     if (user) {
                        setCurrentUser(user);
                        // Reset view if user loses access to current view
                        if (!user.allowedPages.includes(currentView as any)) {
                          setCurrentView('dashboard'); // Default fallback
                        }
                     }
                   }}
                 >
                   {users.map(user => (
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
        
        {currentView === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <FilterBar 
              filters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
            <AnalyticsBar invoices={filteredInvoices} />
            
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Exibindo <strong>{paginatedInvoices.length}</strong> de <strong>{filteredInvoices.length}</strong> notas encontradas
              </p>
            </div>

            <InvoiceList 
              invoices={paginatedInvoices}
              onOpenModal={handleOpenModal}
            />
            <Pagination 
              currentPage={currentPage}
              totalItems={filteredInvoices.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {currentView === 'reports' && (
           <Reports invoices={invoices} areas={areas} users={users} />
        )}

        {currentView === 'areas' && (
          <AreaManager 
            areas={areas} 
            onAddArea={handleAddArea} 
            onDeleteArea={handleDeleteArea}
            onUpdateAreaEmails={handleUpdateAreaEmails}
          />
        )}

        {currentView === 'users' && (
          <UserManager 
            users={users} 
            areas={areas}
            onAddUser={handleAddUser} 
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
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
