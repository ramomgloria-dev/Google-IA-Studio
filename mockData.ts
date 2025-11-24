import { Invoice, Area, User } from './types';

export const INITIAL_AREAS: Area[] = [
  { id: '1', name: 'Central de Notas' },
  { id: '2', name: 'Cadastro' },
  { id: '3', name: 'Comprador' },
  { id: '4', name: 'Fiscal' },
  { id: '5', name: 'Gestão de Estoque' }
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Administrador (Geral)', role: 'GENERAL' },
  { id: 'u2', name: 'João (Fiscal)', role: 'AREA_SPECIALIST', areaId: '4' },
  { id: 'u3', name: 'Maria (Cadastro)', role: 'AREA_SPECIALIST', areaId: '2' },
  { id: 'u4', name: 'Carlos (Comprador)', role: 'AREA_SPECIALIST', areaId: '3' },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: '1',
    nfeNumber: '0015023',
    companyNumber: '1001',
    companyName: 'Tech Solutions Ltda',
    accessKey: '35230912345678000199550010000015023123456789',
    issueDate: '2023-10-25',
    inconsistencies: [
      { id: 'inc1', description: 'NCM do produto "Teclado Mecânico" inválido para a operação.', isResolved: false, areaId: '4' }, // Fiscal
      { id: 'inc2', description: 'Alíquota de ICMS difere do cadastro do produto.', isResolved: false, areaId: '2' } // Cadastro
    ],
    observations: ''
  },
  {
    id: '2',
    nfeNumber: '0015024',
    companyNumber: '2050',
    companyName: 'Logística Rapida S.A.',
    accessKey: '35230998765432000188550010000015024987654321',
    issueDate: '2023-10-26',
    inconsistencies: [
      { id: 'inc3', description: 'Divergência no valor total dos produtos x valor da nota.', isResolved: false, areaId: '1' }, // Central
      { 
        id: 'inc4', 
        description: 'CFOP 5.102 incompatível com destinatário fora do estado.', 
        isResolved: true, 
        areaId: '4',
        resolvedAt: '2023-10-28T10:00:00.000Z',
        resolvedBy: 'u2' // João Fiscal
      }, 
      { id: 'inc5', description: 'Falta informação de volume transportado.', isResolved: false, areaId: '5' } // Estoque
    ],
    observations: 'Aguardando retorno do setor fiscal.'
  },
  {
    id: '3',
    nfeNumber: '0015025',
    companyNumber: '1001',
    companyName: 'Tech Solutions Ltda',
    accessKey: '35231011223344000177550010000015025112233445',
    issueDate: '2023-10-27',
    resolvedAt: '2023-10-29T14:30:00.000Z',
    inconsistencies: [
      { 
        id: 'inc6', 
        description: 'CNPJ do destinatário não cadastrado na base.', 
        isResolved: true, 
        areaId: '2',
        resolvedAt: '2023-10-29T14:30:00.000Z',
        resolvedBy: 'u3' // Maria Cadastro
      } 
    ],
    observations: 'Cliente cadastrado manualmente no sistema legado pelo operador João Silva.'
  },
  {
    id: '4',
    nfeNumber: '0000892',
    companyNumber: '3099',
    companyName: 'Mercado Varejo Express',
    accessKey: '41231099887766000155550010000000892998877665',
    issueDate: '2023-10-28',
    inconsistencies: [
      { id: 'inc7', description: 'Produto sem código de barras (GTIN).', isResolved: false, areaId: '2' }, // Cadastro
      { id: 'inc8', description: 'Data de saída anterior à data de emissão.', isResolved: false, areaId: '1' } // Central
    ],
    observations: ''
  },
  {
    id: '5',
    nfeNumber: '0015026',
    companyNumber: '1001',
    companyName: 'Tech Solutions Ltda',
    accessKey: '35231155443322000111550010000015026554433221',
    issueDate: '2023-11-01',
    inconsistencies: [
      { id: 'inc9', description: 'Valor do IPI não calculado.', isResolved: false, areaId: '4' } // Fiscal
    ],
    observations: ''
  },
  // Adding more resolved data for reports testing
  {
    id: '6',
    nfeNumber: '0015027',
    companyNumber: '5005',
    companyName: 'Indústria Metalúrgica',
    accessKey: '35231155443322000111550010000015027554433229',
    issueDate: '2023-11-02',
    resolvedAt: '2023-11-03T11:00:00.000Z',
    inconsistencies: [
      { 
        id: 'inc10', 
        description: 'NCM do produto "Teclado Mecânico" inválido para a operação.', 
        isResolved: true, 
        areaId: '4',
        resolvedAt: '2023-11-03T11:00:00.000Z',
        resolvedBy: 'u2'
      },
       { 
        id: 'inc11', 
        description: 'NCM do produto "Teclado Mecânico" inválido para a operação.', 
        isResolved: true, 
        areaId: '4',
        resolvedAt: '2023-11-03T10:00:00.000Z',
        resolvedBy: 'u2'
      }
    ],
    observations: 'Correção em lote.'
  }
];