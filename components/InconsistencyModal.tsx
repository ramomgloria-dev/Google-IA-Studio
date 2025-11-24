
import React, { useState, useEffect } from 'react';
import { Invoice, Area, User, Inconsistency } from '../types';
import { X, Save, AlertTriangle, ArrowLeft, Building2, Key, FileText, Send, Lock, ArrowRightLeft, Check, Undo2, User as UserIcon } from 'lucide-react';

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
  const [notesInput, setNotesInput] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (invoice && isOpen) {
      setLocalInvoice(JSON.parse(JSON.stringify(invoice)));
      setNotesInput({}); // Reset inputs when opening
    }
  }, [invoice, isOpen]);

  if (!isOpen || !localInvoice) return null;

  // Handle saving an individual inconsistency
  const handleResolveItem = (id: string) => {
    const note = notesInput[id];
    if (!note || note.trim().length === 0) return;

    setLocalInvoice((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        inconsistencies: prev.inconsistencies.map((inc) => {
          if (inc.id === id) {
            return { 
              ...inc, 
              isResolved: true,
              solutionNotes: note,
              resolvedAt: new Date().toISOString(),
              resolvedBy: currentUser.id
            };
          }
          return inc;
        }),
      };
    });
  };

  // Handle undoing a resolution
  const handleUndoItem = (id: string) => {
    setLocalInvoice((prev) => {
      if (!prev) return null;
      // Restore the note to the input
      const item = prev.inconsistencies.find(i => i.id === id);
      if (item && item.solutionNotes) {
        setNotesInput(curr => ({ ...curr, [id]: item.solutionNotes || '' }));
      }

      return {
        ...prev,
        inconsistencies: prev.inconsistencies.map((inc) => {
          if (inc.id === id) {
            return { 
              ...inc, 
              isResolved: false,
              resolvedAt: undefined,
              resolvedBy: undefined
            };
          }
          return inc;
        }),
      };
    });
  };

  const handleInputChange = (id: string, text: string) => {
    setNotesInput(prev => ({ ...prev, [id]: text }));
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

  const handleSave = () => {
    if (localInvoice) {
      onConfirm(localInvoice);
    }
  };

  const handleNotifyArea = (areaId: string, areaName: string) => {
    const area = areas.find(a => a.id === areaId);
    const emails = area?.emails || [];
    const emailString = emails.length > 0 ? emails.join(', ') : 'Nenhum e-mail cadastrado';
    
    alert(`NOTIFICAÇÃO ENVIADA!\n\nDestinatários: ${emailString}\nAssunto: Pendência na Nota ${localInvoice.nfeNumber}\nMensagem: "Favor verificar inconsistências pendentes na área de ${areaName}."`);
  };

  const unresolvedCount = localInvoice.inconsistencies.filter(i => !i.isResolved).length;

  // Group inconsistencies by Area
  const inconsistenciesByArea = localInvoice.inconsistencies.reduce<Record<string, Inconsistency[]>>((acc, inc) => {
    const areaId = inc.areaId;
    if (!acc[areaId]) acc[areaId] = [];
    acc[areaId].push(inc);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border flex items-center gap-3 shadow-sm ${unresolvedCount === 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-white border-amber-200 text-amber-800'}`}>
            <AlertTriangle className={`w-5 h-5 ${unresolvedCount === 0 ? 'text-green-600' : 'text-amber-600'}`} />
            <div>
              <p className="font-semibold">{unresolvedCount === 0 ? 'Todas as inconsistências resolvidas!' : `Existem ${unresolvedCount} inconsistências pendentes.`}</p>
              {unresolvedCount > 0 && (
                <p className="text-sm opacity-80 mt-1">
                  Para liberar a nota, descreva a solução de cada item e clique no botão de confirmação.
                </p>
              )}
            </div>
          </div>

          {/* Inconsistencies List Grouped by Area */}
          <div className="space-y-8">
            {Object.entries(inconsistenciesByArea).map(([areaId, items]: [string, Inconsistency[]]) => {
              const area = areas.find(a => a.id === areaId);
              const areaName = area ? area.name : 'Área Desconhecida';
              
              const areaUnresolvedCount = items.filter(i => !i.isResolved).length;
              const isAreaResolved = areaUnresolvedCount === 0;

              // Permission Logic:
              // User can edit if Role is GENERAL OR User's AreaIDs include this areaId
              const canEdit = currentUser.role === 'GENERAL' || (currentUser.areaIds && currentUser.areaIds.includes(areaId));

              return (
                <div key={areaId} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                       {areaName}
                       {isAreaResolved ? (
                         <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">OK</span>
                       ) : (
                         <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">{areaUnresolvedCount} Pendentes</span>
                       )}
                    </h4>
                    
                    {!isAreaResolved && (
                      <button 
                        onClick={() => handleNotifyArea(areaId, areaName)}
                        className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-2 py-1 rounded transition-colors"
                        title={`Notificar emails: ${area?.emails.join(', ')}`}
                      >
                        <Send className="w-3 h-3" />
                        Cobrar Área
                      </button>
                    )}
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div key={item.id} className={`p-4 transition-all ${item.isResolved ? 'bg-green-50/30' : 'bg-white'}`}>
                        
                        {/* Header Row: Description + Area Reassign */}
                        <div className="flex justify-between items-start mb-3 gap-4">
                            <div className="flex items-start gap-2">
                                <div className={`mt-1 p-1 rounded-full ${item.isResolved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {item.isResolved ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                </div>
                                <div>
                                    <span className={`text-sm font-medium ${item.isResolved ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                                        {item.description}
                                    </span>
                                    {item.isResolved && item.resolvedBy && (
                                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                            <UserIcon className="w-3 h-3" /> Resolvido por ID: {item.resolvedBy} em {new Date(item.resolvedAt!).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Area Reassignment (Only if not resolved) */}
                            {!item.isResolved && (
                                <div className="relative group shrink-0">
                                    <select
                                        value={item.areaId}
                                        onChange={(e) => handleAreaChange(item.id, e.target.value)}
                                        className="text-xs border border-gray-300 rounded-md py-1 pl-2 pr-6 appearance-none cursor-pointer hover:border-primary-400 focus:ring-1 focus:ring-primary-500 bg-white text-gray-600 shadow-sm"
                                        title="Reatribuir área responsável"
                                    >
                                        {areas.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                    <ArrowRightLeft className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Action Area */}
                        <div className="pl-8">
                            {item.isResolved ? (
                                <div className="flex items-start gap-2">
                                    <div className="flex-1 bg-white border border-green-200 rounded-md p-3 text-sm text-gray-700 relative">
                                        <span className="absolute top-0 left-0 bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded-br font-bold uppercase">Solução</span>
                                        <p className="mt-2">{item.solutionNotes}</p>
                                    </div>
                                    {/* Undo Button (Only for current user session or authorized) */}
                                    {canEdit && (
                                        <button 
                                            onClick={() => handleUndoItem(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Desfazer resolução"
                                        >
                                            <Undo2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    {canEdit ? (
                                        <>
                                            <div className="flex-1">
                                                <textarea 
                                                    value={notesInput[item.id] || ''}
                                                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                    className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[60px] resize-none"
                                                    placeholder="Descreva o que foi feito no ERP para corrigir esta inconsistência (obrigatório para liberar)..."
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleResolveItem(item.id)}
                                                disabled={!notesInput[item.id] || notesInput[item.id].trim().length < 5}
                                                className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white flex items-center justify-center shadow-md transition-all transform active:scale-95"
                                                title="Confirmar correção"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 italic bg-gray-50 px-3 py-2 rounded-md border border-gray-200 w-full">
                                            <Lock className="w-4 h-4" />
                                            Apenas usuários de "{areaName}" podem resolver este item.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-200 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium transition-colors"
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
                className="flex items-center gap-2 px-8 py-2.5 rounded-md shadow-md font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all"
              >
                <Save className="w-4 h-4" />
                Salvar e Fechar
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};
