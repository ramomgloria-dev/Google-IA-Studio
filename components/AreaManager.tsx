
import React, { useState } from 'react';
import { Area } from '../types';
import { Plus, Trash2, Layers, AlertTriangle, Mail, X } from 'lucide-react';

interface AreaManagerProps {
  areas: Area[];
  onAddArea: (name: string) => void;
  onDeleteArea: (id: string) => void;
  onUpdateAreaEmails: (areaId: string, emails: string[]) => void;
}

export const AreaManager: React.FC<AreaManagerProps> = ({ areas, onAddArea, onDeleteArea, onUpdateAreaEmails }) => {
  const [newAreaName, setNewAreaName] = useState('');
  const [newEmailInputs, setNewEmailInputs] = useState<Record<string, string>>({});

  const handleAdd = () => {
    if (newAreaName.trim()) {
      onAddArea(newAreaName.trim());
      setNewAreaName('');
    }
  };

  const handleAddEmail = (areaId: string) => {
    const email = newEmailInputs[areaId];
    if (email && email.trim()) {
      const area = areas.find(a => a.id === areaId);
      if (area) {
        const updatedEmails = [...(area.emails || []), email.trim()];
        onUpdateAreaEmails(areaId, updatedEmails);
        setNewEmailInputs(prev => ({ ...prev, [areaId]: '' }));
      }
    }
  };

  const handleRemoveEmail = (areaId: string, emailToRemove: string) => {
    const area = areas.find(a => a.id === areaId);
    if (area) {
      const updatedEmails = area.emails.filter(e => e !== emailToRemove);
      onUpdateAreaEmails(areaId, updatedEmails);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="text-primary-600" />
          Gerenciamento de Áreas (Clusters)
        </h2>
        <p className="text-gray-500 mt-1">
          Defina as áreas responsáveis e seus e-mails para notificação automática.
        </p>
      </div>

      <div className="p-6">
        {/* Add New Area */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            placeholder="Nome da nova área..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={!newAreaName.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        {/* Areas List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {areas.map((area) => (
            <div key={area.id} className="flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-primary-200 transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-gray-800 text-lg">{area.name}</span>
                <button
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir a área "${area.name}"?`)) {
                      onDeleteArea(area.id);
                    }
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                  title="Excluir Área"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Email Management */}
              <div className="mt-2 bg-white p-3 rounded border border-gray-200">
                <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> E-mails de Notificação
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {area.emails && area.emails.length > 0 ? (
                    area.emails.map((email, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100">
                        {email}
                        <button 
                          onClick={() => handleRemoveEmail(area.id, email)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">Nenhum e-mail cadastrado</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="email"
                    placeholder="novo@email.com"
                    className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                    value={newEmailInputs[area.id] || ''}
                    onChange={(e) => setNewEmailInputs(prev => ({ ...prev, [area.id]: e.target.value }))}
                  />
                  <button 
                    onClick={() => handleAddEmail(area.id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200 flex gap-3 text-sm">
           <AlertTriangle className="w-5 h-5 flex-shrink-0" />
           <p>
             Atenção: Ao remover uma área, certifique-se de que não existem inconsistências pendentes vinculadas a ela, pois isso pode afetar a liberação de notas fiscais.
           </p>
        </div>
      </div>
    </div>
  );
};
