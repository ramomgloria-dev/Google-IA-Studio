export interface Area {
  id: string;
  name: string;
}

export type UserRole = 'GENERAL' | 'AREA_SPECIALIST';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  areaId?: string; // If role is AREA_SPECIALIST, this is required
}

export interface Inconsistency {
  id: string;
  description: string;
  isResolved: boolean;
  areaId: string; // Linked to Area
}

export interface Invoice {
  id: string;
  nfeNumber: string;
  companyNumber: string;
  companyName: string;
  accessKey: string;
  issueDate: string; // ISO Date string YYYY-MM-DD
  resolvedAt?: string; // ISO Date string, optional
  inconsistencies: Inconsistency[];
  observations?: string;
}

export interface FilterState {
  company: string;
  nfeNumber: string;
  startDate: string;
  endDate: string;
  status: string;
}