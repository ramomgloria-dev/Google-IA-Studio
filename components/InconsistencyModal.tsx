import React, { useState, useEffect } from 'react';
import { Invoice, Area, User, Inconsistency } from '../types';
import { X, Save, AlertTriangle, ArrowLeft, Building2, Key, FileText, Send, Lock, ArrowRightLeft } from 'lucide-react';

interface InconsistencyModalProps {
  invoice: Invoice | null;
  areas: Area[];
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedInvoice: Invoice) => void;
}

export const InconsistencyModal: React.FC<InconsistencyModalProps> = ({
  invoice,
  areas,
  currentUser,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [localInvoice, setLocalInvoice] = useState<Invoice | null>(null);
  
  // Validation Constants
  const MIN_OBSERVATION_LENGTH = 50;

  useEffect(() => {
    if (invoice && isOpen) {
      setLocalInvoice(JSON.parse(JSON.stringify(invoice)));
    }
  }, [invoice, isOpen]);

  if (!isOpen || !localInvoice) return null;

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setLocalInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        inconsistencies: prev.inconsistencies.map((inc) => {
          if (inc.id === id) {
            return { 
              ...inc, 
              isResolved: checked,
              // If checking (resolving), add timestamp and user. If unchecking, remove them.
              resolvedAt: checked ? new Date().toISOString() : undefined,
              resolvedBy: checked ? currentUser.id : undefined
            };
          }
          return inc;
        }),
      };
    });
  };

  const handleAreaChange = (inconsistencyId: string, newAreaId: string) => {
    setLocalInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        inconsistencies: prev.inconsistencies.map((inc) =>
          inc.id === inconsistencyId ? { ...inc, areaId: newAreaId } : inc
        ),
      };
    });
  };

  const handleObservationChange = (text: string) => {
    setLocalInvoice((prev) => {
      if (!prev) return null;
      return { ...prev, observations: text };
    });
  };

  const handleSave = () => {
    if (localInvoice && !isSaveDisabled) {
      onConfirm(localInvoice);
    }
  };

  const handleNotifyArea = (areaName: string) => {
    alert(`E-mail de notificação enviado para a equipe de: ${areaName}.\n\n"Existem pendências na nota ${localInvoice.nfeNumber} que impedem sua liberação. Favor verificar na Consinco."`);
  };

  const unresolvedCount = localInvoice.inconsistencies.filter(i => !i.isResolved).length;
  const observationLength = localInvoice.observations?.length || 0;
  const isSaveDisabled = observationLength < MIN_OBSERVATION_LENGTH;

  // Group inconsistencies by Area
  const inconsistenciesByArea = localInvoice.inconsistencies.reduce<Record<string, Inconsistency[]>>((acc, inc) => {
    const areaId = inc.areaId;
    if (!acc[areaId]) acc[areaId] = [];
    acc[areaId].push(inc);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-primary-600" />
              Detalhes da Nota Fiscal {localInvoice.nfeNumber}
            </h2>
            <div className="text-sm text-gray-500 flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                Empresa: <strong className="text-gray-700">{localInvoice.companyNumber} - {localInvoice.companyName}</strong>
              </span>
              <span className="flex items-center gap-1">
                 <Key className="w-4 h-4" />
                 Chave: <span className="font-mono text-xs bg-gray-200 px-1 rounded">{localInvoice.accessKey}</span>
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border flex items-center gap-3 ${unresolvedCount === 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <AlertTriangle className={`w-5 h-5 ${unresolvedCount === 0 ? 'text-green-600' : 'text-amber-600'}`} />
            <div>
              <p className="font-semibold">{unresolvedCount === 0 ? 'Todas as inconsistências resolvidas!' : `Existem ${unresolvedCount} inconsistências pendentes.`}</p>
              <p className="text-sm opacity-80">
                {unresolvedCount > 0 && "A nota só será liberada após todas as áreas resolverem suas pendências."}
              </p>
            </div>
          </div>

          {/* Inconsistencies List Grouped by Area */}
          <div className="space-y-6">
            {Object.entries(inconsistenciesByArea).map(([areaId, items]: [string, Inconsistency[]]) => {
              const area = areas.find(a => a.id === areaId);
              const areaName = area ? area.name : 'Área Desconhecida / Removida';
              
              const areaUnresolvedCount = items.filter(i => !i.isResolved).length;
              const isAreaResolved = areaUnresolvedCount === 0;

              // Check permissions
              const canEdit = currentUser.role === 'GENERAL' || currentUser.areaId === areaId;

              return (
                <div key={areaId} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                       {areaName}
                       {isAreaResolved ? (
                         <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">OK</span>
                       ) : (
                         <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{areaUnresolvedCount} Pendentes</span>
                       )}
                    </h4>
                    
                    {!isAreaResolved && (
                      <button 
                        onClick={() => handleNotifyArea(areaName)}
                        className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-800 hover:underline"
                        title="Enviar e-mail de cobrança para esta área"
                      >
                        <Send className="w-3 h-3" />
                        Notificar {areaName}
                      </button>
                    )}
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className={`flex items-start gap-3 p-4 transition-all ${item.isResolved ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        {/* Checkbox Section */}
                        <div className="pt-0.5">
                          {canEdit ? (
                            <input
                              type="checkbox"
                              checked={item.isResolved}
                              onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                            />
                          ) : (
                            <div className="w-5 h-5 flex items-center justify-center">
                              {item.isResolved ? (
                                <input type="checkbox" checked disabled className="w-5 h-5 text-gray-400 rounded" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-400" title="Você não tem permissão para resolver este item" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Description Section */}
                        <div className="flex-1">
                          <span className={`text-base ${item.isResolved ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {item.description}
                          </span>
                          {!canEdit && !item.isResolved && (
                             <p className="text-xs text-red-500 mt-1">Apenas usuários da área "{areaName}" ou Geral podem resolver.</p>
                          )}
                          {item.isResolved && item.resolvedBy && (
                            <p className="text-xs text-green-600 mt-1">Resolvido por ID: {item.resolvedBy} em {new Date(item.resolvedAt!).toLocaleDateString()}</p>
                          )}
                        </div>

                        {/* Area Reassignment Dropdown */}
                        <div className="flex items-center">
                           <div className="relative group">
                              <select
                                value={item.areaId}
                                onChange={(e) => handleAreaChange(item.id, e.target.value)}
                                disabled={item.isResolved}
                                className={`text-xs border rounded-md py-1 pl-2 pr-6 appearance-none cursor-pointer focus:ring-1 focus:ring-primary-500 focus:outline-none bg-white ${item.isResolved ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-300 hover:border-primary-400 text-gray-600'}`}
                                title="Reatribuir área responsável"
                              >
                                {areas.map(a => (
                                  <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                              </select>
                              {!item.isResolved && (
                                <ArrowRightLeft className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                              )}
                           </div>
                        </div>

                        {/* Status Tag */}
                        {item.isResolved && (
                          <span className="flex-shrink-0 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                            Corrigido
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
           {/* Observations Area */}
           <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Observações Gerais <span className="text-red-500">*</span>
              </label>
              <span className={`text-xs font-medium ${isSaveDisabled ? 'text-red-500' : 'text-green-600'}`}>
                {observationLength}/{MIN_OBSERVATION_LENGTH} caracteres
              </span>
            </div>
            <textarea
              className={`w-full h-24 p-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm transition-all ${isSaveDisabled ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              placeholder="Descreva detalhadamente as ações tomadas... (Mínimo 50 caracteres)"
              value={localInvoice.observations || ''}
              onChange={(e) => handleObservationChange(e.target.value)}
            />
            {isSaveDisabled && (
              <p className="text-xs text-red-500 mt-1">
                É necessário descrever a solução com pelo menos {MIN_OBSERVATION_LENGTH} caracteres.
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-md font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={`flex items-center gap-2 px-6 py-2 rounded-md shadow-sm font-medium transition-all transform active:scale-95 ${
                  isSaveDisabled 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                <Save className="w-4 h-4" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};