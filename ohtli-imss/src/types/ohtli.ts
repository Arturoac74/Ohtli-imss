export type UserRole = 'RESIDENTE' | 'DOCENTE' | 'DIRECTIVO';

export type ResidencyYear = 'R1' | 'R2' | 'R3';

export type AppViewMode = 
  | 'dashboard' 
  | 'admin_users'
  | 'protocols_repo'
  | 'geomap' 
  | 'education' 
  | 'gamification' 
  | 'evaluations';

export interface UserPermissions {
  canManageUsers: boolean;
  canEvaluateProtocols: boolean;
  canPublishAnnouncements: boolean;
  canAssignTutors: boolean;
  canExportData: boolean;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  targetUserName: string;
  action: string;
  details: string;
}

export interface UserAccount {
  id: string;
  matricula: string;
  curp?: string;
  fullName: string;
  email: string;
  role: UserRole;
  isAdmin?: boolean;
  permissions?: UserPermissions;
  specialty?: string;
  hospitalUnit: string;
  delegation: string;
  residencyYear?: ResidencyYear; // for residents: R1, R2, R3
  assignedTutorId?: string;
  assignedTutorName?: string;
  academicDegree?: string; // for tutors: Especialista, Mtro. en Ciencias, Dr. en Ciencias
  maxTutees?: number; // for tutors
  assignedTuteesCount?: number;
  positionTitle?: string; // for directors: Jefe de División, Coordinador, etc.
  phone?: string;
  status: 'Activo' | 'Inactivo' | 'En Rotación' | 'Egresado';
  createdAt: string;
  avatarColor?: string;
  researchLines?: string[];
}

export interface ProtocolDocument {
  id: string;
  title: string;
  residentId: string;
  residentName: string;
  residentMatricula: string;
  residentYear: ResidencyYear;
  hospitalUnit: string;
  delegation: string;
  specialty: string;
  tutorId?: string;
  tutorName?: string;
  category: 'Protocolo de Investigación' | 'Base de Datos REDCap/Excel' | 'Tesis de Residencia' | 'Artículo Científico';
  phase: 'R1_PROTOCOLO' | 'R2_DATABASE' | 'R3_TESIS_ARTICULO';
  researchLine: string;
  abstract: string;
  sirelcisFolio?: string;
  status: 'Borrador' | 'Enviado a Revisión' | 'En Dictamen' | 'Aprobado con Mención' | 'Aprobado' | 'Requiere Cambios' | 'Rechazado';
  score?: number; // 0 - 100
  evaluatorComments?: string;
  evaluatorName?: string;
  evaluatedAt?: string;
  fileName: string;
  fileSizeKb: number;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'zip';
  fileUrl?: string;
  uploadDate: string;
  updatedDate: string;
  version: string;
  umbrellaProjectId?: string;
  umbrellaProjectTitle?: string;
  tags: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  category: 'protocol' | 'database' | 'thesis' | 'community';
}

export interface GamificationProfile {
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  rankDelegational: number;
  totalSubmissions: number;
  badges: Badge[];
  currentTitle: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  estimatedWeeks: number;
  completed: boolean;
  dueDate?: string;
  submittedAt?: string;
  feedback?: string;
  score?: number;
  deliverableType: 'pdf' | 'dataset' | 'article' | 'form';
  xpReward: number;
  resourceUrl?: string;
}

export interface ProtocolPhase {
  id: string;
  year: ResidencyYear;
  phaseName: string;
  title: string;
  durationMonths: number;
  progressPercent: number;
  status: 'completado' | 'en_proceso' | 'bloqueado';
  tasks: TaskItem[];
}

export interface EducationalCapsule {
  id: string;
  title: string;
  description: string;
  author: string;
  type: 'tiktok' | 'youtube' | 'saberimss' | 'x_thread' | 'podcast';
  duration: string;
  yearTarget: ResidencyYear | 'TODOS';
  tags: string[];
  thumbnailUrl: string;
  videoUrl?: string;
  likesCount: number;
  viewsCount: number;
}

export interface UmbrellaProject {
  id: string;
  title: string;
  investigatorName: string;
  investigatorUnit: string;
  delegation: string;
  specialty: string;
  description: string;
  activeResidentsCount: number;
  availableSpots: number;
  category: 'Multicéntrico' | 'Epidemiológico' | 'Clínico' | 'Innovación Tec';
  requiredYear: ResidencyYear[];
}

export interface GeoNode {
  id: string;
  name: string;
  type: 'CIEFD' | 'CINV' | 'UMAE' | 'HGZ';
  delegation: string;
  city: string;
  lat: number;
  lng: number;
  researchersCount: number;
  activeProtocolsCount: number;
  directorName: string;
  address: string;
  contactEmail: string;
  services: string[];
}

export interface ResidentProtocolSubmission {
  id: string;
  residentName: string;
  residentYear: ResidencyYear;
  hospitalUnit: string;
  delegation: string;
  protocolTitle: string;
  submittedDate: string;
  phase: string;
  status: 'Pendiente' | 'Aprobado' | 'Requiere Cambios' | 'En Revisión';
  score?: number;
  evaluatorName?: string;
  comments?: string;
  documentUrl?: string;
  umbrellaProjectName?: string;
}

export interface DelegationHeatMap {
  id: string;
  delegationName: string;
  stateCode: string;
  residentsTotal: number;
  r1ProtocolApprovalRate: number; // %
  r2DatabaseQualityRate: number; // %
  r3ThesisDefenseRate: number; // %
  publicationRate: number; // %
  cinvNodesCount: number;
  activeUmbrellaProjects: number;
  complianceStatus: 'Excelente' | 'Aceptable' | 'En Riesgo' | 'Crítico';
}

export interface DatabaseTableSchema {
  tableName: string;
  description: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
    description: string;
  }[];
}

export interface SystemModuleNode {
  id: string;
  title: string;
  category: 'frontend' | 'offline_sync' | 'backend' | 'database' | 'integrations';
  description: string;
  techStack: string[];
  connections: string[];
}
