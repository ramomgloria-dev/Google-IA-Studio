import React from 'react';
import { Invoice } from '../types';
import { AlertCircle, CheckCircle2, Eye, Calendar, Building, FileDigit, Hash } from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  onOpenModal: (invoice: Invoice) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onOpenModal }) => {
  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-dashed border-gray-300">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileDigit className="text-gray-400 w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Nenhuma nota encontrada</h3>
        <p className="text-gray-500 mt-1">Tente ajustar os filtros de pesquisa.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-1"><Hash className="w-3 h-3" /> Nota Fiscal</div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-1"><Building className="w-3 h-3" /> Empresa</div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Emissão</div>
              </th>
              <th className="px-6 py-4">Inconsistências</th>
              <th className="px-6 py-4">Chave de Acesso</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((invoice) => {
              const unresolvedCount = invoice.inconsistencies.filter(i => !i.isResolved).length;
              const isFullyResolved = unresolvedCount === 0;

              return (
                <tr 
                  key={invoice.id} 
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${isFullyResolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isFullyResolved ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {isFullyResolved ? 'Resolvido' : 'Pendente'}
                     </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {invoice.nfeNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{invoice.companyName}</span>
                      <span className="text-xs text-gray-500">Cod: {invoice.companyNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(invoice.issueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`text-lg font-bold ${unresolvedCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                         {unresolvedCount}
                       </span>
                       <span className="text-xs text-gray-500">pendentes de {invoice.inconsistencies.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 select-all">
                      {invoice.accessKey.substring(0, 20)}...
                    </code>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onOpenModal(invoice)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-all border border-gray-200 shadow-sm"
                      title="Ver Detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};