
import React, { useState } from 'react';
import { User, Area, UserRole, PagePermission, ReportPermission } from '../types';
import { Plus, Trash2, Edit2, UserCircle2, Save, X, CheckSquare, Square } from 'lucide-react';

interface UserManagerProps {
  users: User[];
  areas: Area[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({ users, areas, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  
  const emptyUser: Partial<User> = {
    name: '',
    code: '',
    consincoUser: '',
    email: '',
    company: '',
    role: 'AREA_SPECIALIST',
    areaIds: [],
    allowedPages: ['dashboard'],
    allowedReports: []
  };

  const handleEdit = (user: User) => {
    setCurrentUser({ ...user });
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentUser({ ...emptyUser, id: Math.random().toString(36).substr(2, 9) });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!currentUser.name || !currentUser.email || !currentUser.id) return;
    
    if (users.find(u => u.id === currentUser.id)) {
      onUpdateUser(currentUser as User);
    } else {
      onAddUser(currentUser as User);
    }
    setIsEditing(false);
    setCurrentUser({});
  };

  const toggleArea = (areaId: string) => {
    const currentIds = currentUser.areaIds || [];
    const newIds = currentIds.includes(areaId) 
      ? currentIds.filter(id => id !== areaId)
      : [...currentIds, areaId];
    setCurrentUser(prev => ({ ...prev, areaIds: newIds }));
  };

  const togglePage = (page: PagePermission) => {
    const currentPages = currentUser.allowedPages || [];
    const newPages = currentPages.includes(page)
      ? currentPages.filter(p => p !== page)
      : [...currentPages, page];
    setCurrentUser(prev => ({ ...prev, allowedPages: newPages }));
  };

  const toggleReport = (report: ReportPermission) => {
    const currentReports = currentUser.allowedReports || [];
    const newReports = currentReports.includes(report)
      ? currentReports.filter(r => r !== report)
      : [...currentReports, report];
    setCurrentUser(prev => ({ ...prev, allowedReports: newReports }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
             <UserCircle2 className="text-primary-600" />
             {users.find(u => u.id === currentUser.id) ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
             <X />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Basic Info */}
           <div className="space-y-4">
             <h4 className="font-semibold text-gray-700 border-b pb-1">Informações Básicas (Consinco)</h4>
             
             <div>
               <label className="block text-sm font-medium text-gray-600">Nome Completo</label>
               <input 
                 type="text" 
                 value={currentUser.name || ''}
                 onChange={e => setCurrentUser(prev => ({...prev, name: e.target.value}))}
                 className="w-full border border-gray-300 rounded p-2"
               />
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-600">Cod. Usuário</label>
                 <input 
                   type="text" 
                   value={currentUser.code || ''}
                   onChange={e => setCurrentUser(prev => ({...prev, code: e.target.value}))}
                   className="w-full border border-gray-300 rounded p-2"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-600">Usuário Consinco</label>
                 <input 
                   type="text" 
                   value={currentUser.consincoUser || ''}
                   onChange={e => setCurrentUser(prev => ({...prev, consincoUser: e.target.value}))}
                   className="w-full border border-gray-300 rounded p-2 uppercase"
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-600">Empresa (Loja/Filial)</label>
               <input 
                 type="text" 
                 value={currentUser.company || ''}
                 onChange={e => setCurrentUser(prev => ({...prev, company: e.target.value}))}
                 className="w-full border border-gray-300 rounded p-2"
                 placeholder="Ex: Matriz, Loja 01..."
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-600">E-mail</label>
               <input 
                 type="email" 
                 value={currentUser.email || ''}
                 onChange={e => setCurrentUser(prev => ({...prev, email: e.target.value}))}
                 className="w-full border border-gray-300 rounded p-2"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-600">Tipo de Perfil</label>
               <select 
                 value={currentUser.role}
                 onChange={e => setCurrentUser(prev => ({...prev, role: e.target.value as UserRole}))}
                 className="w-full border border-gray-300 rounded p-2"
               >
                 <option value="AREA_SPECIALIST">Especialista de Área</option>
                 <option value="GENERAL">Administrador Geral</option>
               </select>
             </div>
           </div>

           {/* Permissions */}
           <div className="space-y-6">
             <div>
                <h4 className="font-semibold text-gray-700 border-b pb-1 mb-3">Áreas Vinculadas (Clusters)</h4>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {areas.map(area => (
                    <div 
                      key={area.id} 
                      onClick={() => toggleArea(area.id)}
                      className={`cursor-pointer p-2 rounded border text-sm flex items-center gap-2 transition-colors ${currentUser.areaIds?.includes(area.id) ? 'bg-primary-50 border-primary-300 text-primary-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                    >
                      {currentUser.areaIds?.includes(area.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      {area.name}
                    </div>
                  ))}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Páginas Permitidas</h4>
                  <div className="space-y-2">
                    {['dashboard', 'reports', 'areas', 'users'].map(page => (
                      <div key={page} onClick={() => togglePage(page as PagePermission)} className="flex items-center gap-2 cursor-pointer text-sm">
                         {currentUser.allowedPages?.includes(page as PagePermission) ? <CheckSquare className="w-4 h-4 text-green-600" /> : <Square className="w-4 h-4 text-gray-400" />}
                         <span className="capitalize">{page}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Relatórios Permitidos</h4>
                  <div className="space-y-2">
                    {['proactivity', 'motives'].map(rep => (
                      <div key={rep} onClick={() => toggleReport(rep as ReportPermission)} className="flex items-center gap-2 cursor-pointer text-sm">
                         {currentUser.allowedReports?.includes(rep as ReportPermission) ? <CheckSquare className="w-4 h-4 text-green-600" /> : <Square className="w-4 h-4 text-gray-400" />}
                         <span className="capitalize">{rep === 'proactivity' ? 'Proatividade' : 'Motivos'}</span>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
           </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Salvar Usuário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserCircle2 className="text-primary-600" />
            Gerenciamento de Usuários
          </h2>
          <p className="text-gray-500 mt-1">
            Cadastre usuários, defina perfis Consinco e permissões de acesso.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
             <tr>
               <th className="px-6 py-3">Nome / E-mail</th>
               <th className="px-6 py-3">Consinco</th>
               <th className="px-6 py-3">Empresa</th>
               <th className="px-6 py-3">Perfil</th>
               <th className="px-6 py-3">Áreas (Clusters)</th>
               <th className="px-6 py-3 text-right">Ações</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs"><span className="font-semibold">User:</span> {user.consincoUser}</div>
                  <div className="text-xs text-gray-500">Cod: {user.code}</div>
                </td>
                 <td className="px-6 py-4 text-gray-700 font-medium">
                  {user.company}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'GENERAL' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role === 'GENERAL' ? 'Admin' : 'Especialista'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.areaIds.map(aid => {
                      const area = areas.find(a => a.id === aid);
                      return area ? (
                        <span key={aid} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200">
                          {area.name}
                        </span>
                      ) : null;
                    })}
                    {user.areaIds.length === 0 && <span className="text-gray-400 text-xs italic">Nenhuma</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors mr-2">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if(confirm('Excluir usuário?')) onDeleteUser(user.id) }} className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};