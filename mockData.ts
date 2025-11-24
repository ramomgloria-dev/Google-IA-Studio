
import { Invoice, Area, User } from './types';

export const INITIAL_AREAS: Area[] = [
  { id: '1', name: 'Central de Notas', emails: ['central.notas@empresa.com'] },
  { id: '2', name: 'Cadastro', emails: ['cadastro@empresa.com', 'master.cadastro@empresa.com'] },
  { id: '3', name: 'Comprador', emails: ['compras@empresa.com'] },
  { id: '4', name: 'Fiscal', emails: ['fiscal@empresa.com'] },
  { id: '5', name: 'Gestão de Estoque', emails: ['estoque@empresa.com'] }
];

export const INITIAL_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Administrador (Geral)', 
    role: 'GENERAL',
    code: '001',
    consincoUser: 'ADMIN',
    email: 'admin@empresa.com',
    company: 'Matriz',
    areaIds: [],
    allowedPages: ['dashboard', 'reports', 'areas', 'users'],
    allowedReports: ['proactivity', 'motives']
  },
  { 
    id: 'u2', 
    name: 'João (Fiscal)', 
    role: 'AREA_SPECIALIST', 
    code: '102',
    consincoUser: 'JOAO.SILVA',
    email: 'joao.silva@empresa.com',
    company: 'Loja 01',
    areaIds: ['4'], // Fiscal
    allowedPages: ['dashboard', 'reports'],
    allowedReports: ['proactivity']
  },
  { 
    id: 'u3', 
    name: 'Maria (Cadastro)', 
    role: 'AREA_SPECIALIST', 
    code: '103',
    consincoUser: 'MARIA.SOUZA',
    email: 'maria.souza@empresa.com',
    company: 'Matriz',
    areaIds: ['2'], // Cadastro
    allowedPages: ['dashboard'],
    allowedReports: []
  },
  { 
    id: 'u4', 
    name: 'Carlos (Comprador)', 
    role: 'AREA_SPECIALIST', 
    code: '104',
    consincoUser: 'CARLOS.OLIVEIRA',
    email: 'carlos.o@empresa.com',
    company: 'CD 01',
    areaIds: ['3'], // Comprador
    allowedPages: ['dashboard', 'reports'],
    allowedReports: ['motives']
  },
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
    ]
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
        solutionNotes: 'Alterado CFOP para 6.102 conforme orientação da contabilidade.',
        resolvedAt: '2023-10-28T10:00:00.000Z',
        resolvedBy: 'u2' // João Fiscal
      }, 
      { id: 'inc5', description: 'Falta informação de volume transportado.', isResolved: false, areaId: '5' } // Estoque
    ]
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
        solutionNotes: 'Cliente cadastrado manualmente no ERP (Cod: 998877).',
        resolvedAt: '2023-10-29T14:30:00.000Z',
        resolvedBy: 'u3' // Maria Cadastro
      } 
    ]
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
    ]
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
    ]
  },
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
        solutionNotes: 'Ajustado NCM para 8471.60.52 no cadastro de produtos.',
        resolvedAt: '2023-11-03T11:00:00.000Z',
        resolvedBy: 'u2'
      },
       { 
        id: 'inc11', 
        description: 'Divergência de valores.', 
        isResolved: true, 
        areaId: '4',
        solutionNotes: 'Valores ajustados manualmente com autorização da gerência.',
        resolvedAt: '2023-11-03T10:00:00.000Z',
        resolvedBy: 'u2'
      }
    ]
  }
];