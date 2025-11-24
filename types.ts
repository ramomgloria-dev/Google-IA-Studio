
export interface Area {
  id: string;
  name: string;
  emails: string[]; // List of emails for this area (e.g. sector alias)
}

export type UserRole = 'GENERAL' | 'AREA_SPECIALIST';

export type PagePermission = 'dashboard' | 'reports' | 'areas' | 'users';
export type ReportPermission = 'proactivity' | 'motives';

export interface User {
  id: string;
  name: string; // Full Name
  role: UserRole;
  
  // Consinco Specifics
  code: string;
  consincoUser: string;
  email: string;
  company: string; // New Field: Company/Store linkage

  // Permissions & Scope
  areaIds: string[]; // Can belong to multiple areas
  allowedPages: PagePermission[]; 
  allowedReports: ReportPermission[];
}

export interface Inconsistency {
  id: string;
  description: string;
  isResolved: boolean;
  areaId: string; // Linked to Area
  solutionNotes?: string; // Specific note on how this was resolved
  resolvedAt?: string; // ISO Date string of when specific item was resolved
  resolvedBy?: string; // User ID who resolved it
}

export interface Invoice {
  id: string;
  nfeNumber: string;
  companyNumber: string;
  companyName: string;
  accessKey: string;
  issueDate: string; // ISO Date string YYYY-MM-DD
  resolvedAt?: string; // ISO Date string, optional (when whole invoice was finished)
  inconsistencies: Inconsistency[];
}

export interface FilterState {
  company: string;
  nfeNumber: string;
  startDate: string;
  endDate: string;
  status: string;
}