import React, { useState } from 'react';
import { Area } from '../types';
import { Plus, Trash2, Layers, AlertTriangle } from 'lucide-react';

interface AreaManagerProps {
  areas: Area[];
  onAddArea: (name: string) => void;
  onDeleteArea: (id: string) => void;
}

export const AreaManager: React.FC<AreaManagerProps> = ({ areas, onAddArea, onDeleteArea }) => {
  const [newAreaName, setNewAreaName] = useState('');

  const handleAdd = () => {
    if (newAreaName.trim()) {
      onAddArea(newAreaName.trim());
      setNewAreaName('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="text-primary-600" />
          Gerenciamento de Áreas (Clusters)
        </h2>
        <p className="text-gray-500 mt-1">
          Defina as áreas responsáveis pela tratativa das inconsistências.
        </p>
      </div>

      <div className="p-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areas.map((area) => (
            <div key={area.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-primary-200 transition-colors">
              <span className="font-medium text-gray-700">{area.name}</span>
              <button
                onClick={() => {
                  if (confirm(`Tem certeza que deseja excluir a área "${area.name}"?`)) {
                    onDeleteArea(area.id);
                  }
                }}
                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                title="Excluir Área"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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