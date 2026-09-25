import { UserAccount, ProtocolDocument, UserRole, ResidencyYear, AdminAuditLog } from '../types/ohtli';

const USERS_STORAGE_KEY = 'ohtli_users_db_v2';
const PROTOCOLS_STORAGE_KEY = 'ohtli_protocols_db_v2';
const AUDIT_LOGS_STORAGE_KEY = 'ohtli_audit_logs_v2';

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_1',
    timestamp: '2026-08-10 09:30:00',
    adminName: 'Dr. Rodrigo Mendoza Zavala',
    targetUserName: 'Dra. Carmen Valdés Ochoa',
    action: 'ASIGNACION_ADMIN',
    details: 'Se otorgaron privilegios de Administrador y Gestión de Usuarios para la CINV CDMX Norte.',
  },
  {
    id: 'log_2',
    timestamp: '2026-08-12 14:15:22',
    adminName: 'Dra. Gabriela Pacheco Lugo',
    targetUserName: 'Dr. Fernando Arredondo Gómez',
    action: 'PERMISOS_DICTAMEN',
    details: 'Habilitado permiso para emitir dictámenes y validación metodológica CAMIS.',
  },
  {
    id: 'log_3',
    timestamp: '2026-08-14 08:00:10',
    adminName: 'Dr. Rodrigo Mendoza Zavala',
    targetUserName: 'Padrón R1-R3 Nacional',
    action: 'AUDITORIA_SISTEMA',
    details: 'Verificación periódica de credenciales y roles en la base de datos institucional.',
  },
];

export const INITIAL_USERS: UserAccount[] = [
  // Residentes
  {
    id: 'usr_res_1',
    matricula: '99482710',
    curp: 'MOAL970412HDFRRN01',
    fullName: 'Dr. Alejandro Morales Alarcón',
    email: 'alejandro.morales.a@imss.gob.mx',
    role: 'RESIDENTE',
    specialty: 'Medicina Interna',
    hospitalUnit: 'HGZ No. 1 A Tlaltelolco',
    delegation: 'CDMX Norte',
    residencyYear: 'R1',
    assignedTutorId: 'usr_tut_1',
    assignedTutorName: 'Dra. Carmen Valdés Ochoa (CINV)',
    phone: '55 4192 8831',
    status: 'Activo',
    createdAt: '2026-03-01',
    avatarColor: '#6B1D2F',
    researchLines: ['Enfermedades Cardiometabólicas', 'Diabetes Mellitus tipo 2'],
  },
  {
    id: 'usr_res_2',
    matricula: '98341209',
    curp: 'HESM960918MDFLSR03',
    fullName: 'Dra. Sofía Hernández Ruiz',
    email: 'sofia.hernandez.r@imss.gob.mx',
    role: 'RESIDENTE',
    specialty: 'Pediatría Médica',
    hospitalUnit: 'UMAE Hospital de Pediatría CMN Siglo XXI',
    delegation: 'CDMX Sur',
    residencyYear: 'R2',
    assignedTutorId: 'usr_tut_2',
    assignedTutorName: 'Dr. Fernando Arredondo Gómez',
    phone: '55 8391 0029',
    status: 'Activo',
    createdAt: '2025-03-01',
    avatarColor: '#1d4ed8',
    researchLines: ['Nefrología Pediátrica', 'Biomarcadores Urinarios'],
  },
  {
    id: 'usr_res_3',
    matricula: '97451023',
    curp: 'VARC951105HJCLNN02',
    fullName: 'Dr. Carlos Vázquez Romero',
    email: 'carlos.vazquez.r@imss.gob.mx',
    role: 'RESIDENTE',
    specialty: 'Cirugía General',
    hospitalUnit: 'UMAE Hospital de Especialidades CMNO',
    delegation: 'Jalisco',
    residencyYear: 'R3',
    assignedTutorId: 'usr_tut_3',
    assignedTutorName: 'Dra. Lorena Silva Méndez (SNII II)',
    phone: '33 1892 4477',
    status: 'Activo',
    createdAt: '2024-03-01',
    avatarColor: '#047857',
    researchLines: ['Cirugía Mínimamente Invasiva', 'Morbimortalidad Quirúrgica'],
  },
  {
    id: 'usr_res_4',
    matricula: '99231844',
    curp: 'GAMD980220MDFNRR09',
    fullName: 'Dra. Daniela García Montalvo',
    email: 'daniela.garcia.m@imss.gob.mx',
    role: 'RESIDENTE',
    specialty: 'Ginecología y Obstetricia',
    hospitalUnit: 'UMAE Hospital de Gineco-Obstetricia No. 3 CMN La Raza',
    delegation: 'CDMX Norte',
    residencyYear: 'R1',
    assignedTutorId: 'usr_tut_1',
    assignedTutorName: 'Dra. Carmen Valdés Ochoa (CINV)',
    phone: '55 1928 3746',
    status: 'Activo',
    createdAt: '2026-03-01',
    avatarColor: '#b45309',
    researchLines: ['Preeclampsia Severa', 'Marcadores Angiogénicos'],
  },
  {
    id: 'usr_res_5',
    matricula: '98441920',
    curp: 'RILM961208HNLGRR07',
    fullName: 'Dr. Manuel Rivas Lozano',
    email: 'manuel.rivas.l@imss.gob.mx',
    role: 'RESIDENTE',
    specialty: 'Medicina de Urgencias',
    hospitalUnit: 'UMAE Hospital de Especialidades No. 25',
    delegation: 'Nuevo León',
    residencyYear: 'R2',
    assignedTutorId: 'usr_tut_4',
    assignedTutorName: 'Dr. Héctor Treviño Cantú (CIEFD NL)',
    phone: '81 9283 7461',
    status: 'Activo',
    createdAt: '2025-03-01',
    avatarColor: '#6d28d9',
    researchLines: ['Sepsis y Choque Séptico', 'Ultrasonido POCUS en Urgencias'],
    isAdmin: false,
    permissions: {
      canManageUsers: false,
      canEvaluateProtocols: false,
      canPublishAnnouncements: false,
      canAssignTutors: false,
      canExportData: false,
    },
  },

  // Tutores e Investigadores CINV
  {
    id: 'usr_tut_1',
    matricula: '88321045',
    curp: 'VAOC720514MDFLLN05',
    fullName: 'Dra. Carmen Valdés Ochoa',
    email: 'carmen.valdes.o@imss.gob.mx',
    role: 'DOCENTE',
    specialty: 'Medicina Interna / Epidemiología Clínica',
    hospitalUnit: 'Centro de Investigación Biomédica de Oriente (CIBIOR)',
    delegation: 'CDMX Norte',
    academicDegree: 'Doctora en Ciencias Médicas (SNII I)',
    maxTutees: 6,
    assignedTuteesCount: 2,
    phone: '55 5729 6300 Ext. 2145',
    status: 'Activo',
    createdAt: '2020-01-15',
    avatarColor: '#6B1D2F',
    researchLines: ['Epidemiología de Enfermedades Crónico Degenerativas', 'Farmacoepidemiología IMSS'],
    isAdmin: true,
    permissions: {
      canManageUsers: true,
      canEvaluateProtocols: true,
      canPublishAnnouncements: true,
      canAssignTutors: true,
      canExportData: true,
    },
  },
  {
    id: 'usr_tut_2',
    matricula: '87492011',
    curp: 'AOGF680922HDFRRN04',
    fullName: 'Dr. Fernando Arredondo Gómez',
    email: 'fernando.arredondo.g@imss.gob.mx',
    role: 'DOCENTE',
    specialty: 'Pediatría / Bioestadística Médica',
    hospitalUnit: 'Coordinación Delegacional de Investigación en Salud',
    delegation: 'CDMX Sur',
    academicDegree: 'Maestro en Ciencias en Bioestadística',
    maxTutees: 5,
    assignedTuteesCount: 1,
    phone: '55 5627 6900 Ext. 1108',
    status: 'Activo',
    createdAt: '2019-08-10',
    avatarColor: '#1e40af',
    researchLines: ['Metodología de la Investigación', 'Bases de Datos REDCap'],
    isAdmin: false,
    permissions: {
      canManageUsers: false,
      canEvaluateProtocols: true,
      canPublishAnnouncements: false,
      canAssignTutors: false,
      canExportData: false,
    },
  },
  {
    id: 'usr_tut_3',
    matricula: '86192834',
    curp: 'SIML700311MJCLRR09',
    fullName: 'Dra. Lorena Silva Méndez',
    email: 'lorena.silva.m@imss.gob.mx',
    role: 'DOCENTE',
    specialty: 'Cirugía Oncológica / Investigación Traslacional',
    hospitalUnit: 'Centro de Investigación Biomédica de Occidente (CIBO)',
    delegation: 'Jalisco',
    academicDegree: 'Doctora en Ciencias Quirúrgicas (SNII II)',
    maxTutees: 4,
    assignedTuteesCount: 1,
    phone: '33 3617 0060 Ext. 3120',
    status: 'Activo',
    createdAt: '2018-04-20',
    avatarColor: '#065f46',
    researchLines: ['Oncología Gastrointestinal', 'Ensayos Clínicos Multicéntricos'],
    isAdmin: false,
    permissions: {
      canManageUsers: false,
      canEvaluateProtocols: true,
      canPublishAnnouncements: false,
      canAssignTutors: false,
      canExportData: false,
    },
  },
  {
    id: 'usr_tut_4',
    matricula: '89102938',
    curp: 'TRCH751010HNLNLL01',
    fullName: 'Dr. Héctor Treviño Cantú',
    email: 'hector.trevino.c@imss.gob.mx',
    role: 'DOCENTE',
    specialty: 'Medicina Crítica / Educación Médica',
    hospitalUnit: 'Centro de Investigación Educativa y Formación Docente (CIEFD NL)',
    delegation: 'Nuevo León',
    academicDegree: 'Maestro en Educación e Investigación en Salud',
    maxTutees: 5,
    assignedTuteesCount: 1,
    phone: '81 8344 2000 Ext. 5402',
    status: 'Activo',
    createdAt: '2021-02-15',
    avatarColor: '#7c3aed',
    researchLines: ['Formación de Médicos Residentes', 'Monitoreo Hemodinámico'],
    isAdmin: false,
    permissions: {
      canManageUsers: false,
      canEvaluateProtocols: true,
      canPublishAnnouncements: false,
      canAssignTutors: false,
      canExportData: false,
    },
  },

  // Directivos
  {
    id: 'usr_dir_1',
    matricula: '10293847',
    curp: 'MEZR650428HDFRRR08',
    fullName: 'Dr. Rodrigo Mendoza Zavala',
    email: 'rodrigo.mendoza.z@imss.gob.mx',
    role: 'DIRECTIVO',
    specialty: 'Salud Pública y Administración Médica',
    hospitalUnit: 'Jefatura de Servicios de Prestaciones Médicas',
    delegation: 'CDMX Norte',
    positionTitle: 'Coordinador Delegacional de Educación en Salud',
    phone: '55 5729 6300 Ext. 1001',
    status: 'Activo',
    createdAt: '2017-06-01',
    avatarColor: '#6B1D2F',
    isAdmin: true,
    permissions: {
      canManageUsers: true,
      canEvaluateProtocols: true,
      canPublishAnnouncements: true,
      canAssignTutors: true,
      canExportData: true,
    },
  },
  {
    id: 'usr_dir_2',
    matricula: '10384756',
    curp: 'PALG670815MDFLN006',
    fullName: 'Dra. Gabriela Pacheco Lugo',
    email: 'gabriela.pacheco.l@imss.gob.mx',
    role: 'DIRECTIVO',
    specialty: 'Medicina Preventiva',
    hospitalUnit: 'Coordinación de Investigación en Salud (Nivel Central)',
    delegation: 'Nivel Central',
    positionTitle: 'Jefa de la División de Formación e Investigación Médica',
    phone: '55 5238 2700 Ext. 1050',
    status: 'Activo',
    createdAt: '2016-09-15',
    avatarColor: '#831843',
    isAdmin: true,
    permissions: {
      canManageUsers: true,
      canEvaluateProtocols: true,
      canPublishAnnouncements: true,
      canAssignTutors: true,
      canExportData: true,
    },
  },
];

export const INITIAL_PROTOCOLS: ProtocolDocument[] = [
  {
    id: 'proto_1',
    title: 'Eficacia de los Inhibidores SGLT2 sobre la Progresión de Enfermedad Renal Crónica en Pacientes con Diabetes Tipo 2 en el HGZ 1A',
    residentId: 'usr_res_1',
    residentName: 'Dr. Alejandro Morales Alarcón',
    residentMatricula: '99482710',
    residentYear: 'R1',
    hospitalUnit: 'HGZ No. 1 A Tlaltelolco',
    delegation: 'CDMX Norte',
    specialty: 'Medicina Interna',
    tutorId: 'usr_tut_1',
    tutorName: 'Dra. Carmen Valdés Ochoa (CINV)',
    category: 'Protocolo de Investigación',
    phase: 'R1_PROTOCOLO',
    researchLine: 'Enfermedades Cardiometabólicas y Nefropatía Diabética',
    abstract: 'Estudio de cohorte retrospectiva y prospectiva para evaluar la tasa de filtrado glomerular estimada y albuminuria en pacientes tratados con Dapagliflozina vs estándar de cuidado durante 12 meses.',
    sirelcisFolio: 'R-2026-3501-084',
    status: 'Aprobado',
    score: 96,
    evaluatorComments: 'Excelente fundamentación teórica y cálculo de tamaño muestral según fórmula de diferencias de medias. Dictamen favorable de Comité de Ética.',
    evaluatorName: 'Dra. Carmen Valdés Ochoa',
    evaluatedAt: '2026-06-12',
    fileName: 'Protocolo_SGLT2_ERC_DrMorales_R1_v2.pdf',
    fileSizeKb: 2840,
    fileType: 'pdf',
    fileUrl: '#',
    uploadDate: '2026-05-28',
    updatedDate: '2026-06-12',
    version: '2.1',
    umbrellaProjectId: 'umb_1',
    umbrellaProjectTitle: 'Registro Nacional Multicéntrico de Enfermedad Renal Diabética (RENED-IMSS)',
    tags: ['SGLT2', 'Nefropatía', 'Diabetes', 'Cohorte', 'SIRELCIS Aprobado'],
  },
  {
    id: 'proto_2',
    title: 'Base de Datos y Diccionario de Variables: Biomarcadores de Daño Renal Agudo en Pacientes Pediátricos en UCI',
    residentId: 'usr_res_2',
    residentName: 'Dra. Sofía Hernández Ruiz',
    residentMatricula: '98341209',
    residentYear: 'R2',
    hospitalUnit: 'UMAE Hospital de Pediatría CMN Siglo XXI',
    delegation: 'CDMX Sur',
    specialty: 'Pediatría Médica',
    tutorId: 'usr_tut_2',
    tutorName: 'Dr. Fernando Arredondo Gómez',
    category: 'Base de Datos REDCap/Excel',
    phase: 'R2_DATABASE',
    researchLine: 'Nefrología Pediátrica y Terapia Intensiva',
    abstract: 'Estructuración de matriz de captura electrónica de 45 variables clínicas, paraclínicas (NGAL, KIM-1 séricos y urinarios) y desenlaces a los 28 días de estancia en UCIP.',
    sirelcisFolio: 'R-2025-3603-019',
    status: 'Aprobado con Mención',
    score: 98,
    evaluatorComments: 'Estructura de variables impecable con validaciones numéricas de rangos fisiológicos pediátricos listas para exportación a R/SPSS.',
    evaluatorName: 'Dr. Fernando Arredondo Gómez',
    evaluatedAt: '2026-04-18',
    fileName: 'Diccionario_Variables_REDCap_BiomarcadoresPed.xlsx',
    fileSizeKb: 1420,
    fileType: 'xlsx',
    fileUrl: '#',
    uploadDate: '2026-04-10',
    updatedDate: '2026-04-18',
    version: '1.4',
    tags: ['REDCap', 'Pediatría', 'Biomarcadores', 'AKI', 'UCIP'],
  },
  {
    id: 'proto_3',
    title: 'Tesis de Residencia: Morbilidad y Estancia Hospitalaria en Apendicectomía Laparoscópica de Puerto Único vs Convencional',
    residentId: 'usr_res_3',
    residentName: 'Dr. Carlos Vázquez Romero',
    residentMatricula: '97451023',
    residentYear: 'R3',
    hospitalUnit: 'UMAE Hospital de Especialidades CMNO',
    delegation: 'Jalisco',
    specialty: 'Cirugía General',
    tutorId: 'usr_tut_3',
    tutorName: 'Dra. Lorena Silva Méndez (SNII II)',
    category: 'Tesis de Residencia',
    phase: 'R3_TESIS_ARTICULO',
    researchLine: 'Cirugía Laparoscópica Avanzada y Seguridad del Paciente',
    abstract: 'Ensayo clínico cuasiexperimental con 160 pacientes intervenidos de urgencia en CMNO. Análisis de dolor postoperatorio mediante escala EVA, complicaciones Clavien-Dindo y días de incapacidad.',
    sirelcisFolio: 'R-2024-1401-112',
    status: 'Enviado a Revisión',
    score: 92,
    evaluatorComments: 'Revisión metodológica preliminar completada. Pendiente última validación del resumen estructurado en inglés.',
    evaluatorName: 'Dra. Lorena Silva Méndez',
    evaluatedAt: '2026-07-02',
    fileName: 'Tesis_Final_Apendicectomia_DrVazquez_R3.pdf',
    fileSizeKb: 5120,
    fileType: 'pdf',
    fileUrl: '#',
    uploadDate: '2026-06-25',
    updatedDate: '2026-07-02',
    version: '3.0',
    tags: ['Tesis R3', 'Cirugía', 'Laparoscopía', 'Clavien-Dindo', 'CMNO'],
  },
  {
    id: 'proto_4',
    title: 'Utilidad del Cociente sFlt-1/PlGF para Predicción de Complicaciones Materno-Fetales en Preeclampsia Temprana',
    residentId: 'usr_res_4',
    residentName: 'Dra. Daniela García Montalvo',
    residentMatricula: '99231844',
    residentYear: 'R1',
    hospitalUnit: 'UMAE Hospital de Gineco-Obstetricia No. 3 CMN La Raza',
    delegation: 'CDMX Norte',
    specialty: 'Ginecología y Obstetricia',
    tutorId: 'usr_tut_1',
    tutorName: 'Dra. Carmen Valdés Ochoa (CINV)',
    category: 'Protocolo de Investigación',
    phase: 'R1_PROTOCOLO',
    researchLine: 'Medicina Materno Fetal y Preeclampsia',
    abstract: 'Estudio de pruebas diagnósticas prospectivo para determinar sensibilidad y especificidad del cociente angiogénico en gestantes de 20 a 34 semanas de gestación ingresadas a Triage Obstétrico.',
    sirelcisFolio: 'R-2026-3504-041',
    status: 'En Dictamen',
    score: 88,
    evaluatorComments: 'Enviado a sesión plenaria de Comité Local de Investigación en Salud (CLIES 3504). Correcciones menores de criterios de exclusión atendidas.',
    evaluatorName: 'Dra. Carmen Valdés Ochoa',
    evaluatedAt: '2026-07-15',
    fileName: 'Protocolo_Preeclampsia_sFlt1_DraGarcia_R1.pdf',
    fileSizeKb: 3180,
    fileType: 'pdf',
    fileUrl: '#',
    uploadDate: '2026-07-05',
    updatedDate: '2026-07-15',
    version: '1.2',
    tags: ['Ginecología', 'Preeclampsia', 'Biomarcadores', 'sFlt-1/PlGF', 'CMN La Raza'],
  },
  {
    id: 'proto_5',
    title: 'Protocolo POCUS: Rendimiento del Índice VExUS en Reanimación Hídrica de Pacientes en Choque Séptico en Urgencias',
    residentId: 'usr_res_5',
    residentName: 'Dr. Manuel Rivas Lozano',
    residentMatricula: '98441920',
    residentYear: 'R2',
    hospitalUnit: 'UMAE Hospital de Especialidades No. 25',
    delegation: 'Nuevo León',
    specialty: 'Medicina de Urgencias',
    tutorId: 'usr_tut_4',
    tutorName: 'Dr. Héctor Treviño Cantú (CIEFD NL)',
    category: 'Base de Datos REDCap/Excel',
    phase: 'R2_DATABASE',
    researchLine: 'Medicina Crítica y Ultrasonografía Clínica',
    abstract: 'Matriz de recolección de scores de congestión venosa sistémica (VExUS Grados 0 a 3) y balance hídrico acumulado a las 72 horas en pacientes sépticos.',
    sirelcisFolio: 'R-2025-1901-073',
    status: 'Requiere Cambios',
    score: 78,
    evaluatorComments: 'Falta estandarizar la prueba de concordancia interobservador (Kappa de Cohen) para las mediciones Doppler de la vena porta y suprahepática.',
    evaluatorName: 'Dr. Héctor Treviño Cantú',
    evaluatedAt: '2026-07-20',
    fileName: 'VExUS_Protocol_Dataset_DrRivas_R2.docx',
    fileSizeKb: 1890,
    fileType: 'docx',
    fileUrl: '#',
    uploadDate: '2026-07-10',
    updatedDate: '2026-07-20',
    version: '1.1',
    tags: ['POCUS', 'VExUS', 'Urgencias', 'Choque Séptico', 'Doppler'],
  },
];

// Helper database functions with localStorage persistence
export const DatabaseService = {
  getUsers(): UserAccount[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed: UserAccount[] = JSON.parse(stored);
        // Normalize permissions & isAdmin
        return parsed.map((u) => ({
          ...u,
          isAdmin: u.isAdmin !== undefined ? u.isAdmin : u.role === 'DIRECTIVO',
          permissions: u.permissions || {
            canManageUsers: u.role === 'DIRECTIVO' || !!u.isAdmin,
            canEvaluateProtocols: u.role === 'DIRECTIVO' || u.role === 'DOCENTE',
            canPublishAnnouncements: u.role === 'DIRECTIVO',
            canAssignTutors: u.role === 'DIRECTIVO',
            canExportData: u.role === 'DIRECTIVO',
          },
        }));
      }
    } catch (e) {
      console.error('Error reading users from localStorage:', e);
    }
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  },

  saveUsers(users: UserAccount[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
    }
  },

  addUser(userData: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount {
    const users = this.getUsers();
    const newUser: UserAccount = {
      ...userData,
      id: `usr_${userData.role.toLowerCase().slice(0, 3)}_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      avatarColor: userData.role === 'RESIDENTE' ? '#6B1D2F' : userData.role === 'DOCENTE' ? '#1d4ed8' : '#831843',
    };

    const updated = [newUser, ...users];
    this.saveUsers(updated);
    return newUser;
  },

  updateUser(id: string, updates: Partial<UserAccount>): UserAccount | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    this.saveUsers(users);
    return updatedUser;
  },

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length !== users.length) {
      this.saveUsers(filtered);
      return true;
    }
    return false;
  },

  getTutors(): UserAccount[] {
    return this.getUsers().filter((u) => u.role === 'DOCENTE');
  },

  getResidents(): UserAccount[] {
    return this.getUsers().filter((u) => u.role === 'RESIDENTE');
  },

  getDirectors(): UserAccount[] {
    return this.getUsers().filter((u) => u.role === 'DIRECTIVO');
  },

  getAdministrators(): UserAccount[] {
    return this.getUsers().filter((u) => u.isAdmin === true || u.role === 'DIRECTIVO' || u.permissions?.canManageUsers === true);
  },

  updateUserPermissions(
    userId: string,
    permissions: Partial<UserAccount['permissions']>,
    isAdmin?: boolean,
    adminName: string = 'Dr. Rodrigo Mendoza Zavala'
  ): UserAccount | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    const currentPermissions = users[index].permissions || {
      canManageUsers: false,
      canEvaluateProtocols: false,
      canPublishAnnouncements: false,
      canAssignTutors: false,
      canExportData: false,
    };

    const newPermissions = {
      ...currentPermissions,
      ...permissions,
    };

    const isUserAdmin = isAdmin !== undefined ? isAdmin : (newPermissions.canManageUsers || users[index].role === 'DIRECTIVO');

    const updatedUser: UserAccount = {
      ...users[index],
      isAdmin: isUserAdmin,
      permissions: newPermissions,
    };

    users[index] = updatedUser;
    this.saveUsers(users);

    this.addAuditLog({
      adminName,
      targetUserName: updatedUser.fullName,
      action: isUserAdmin ? 'ASIGNACION_PERMISOS' : 'MODIFICACION_PERMISOS',
      details: `Permisos actualizados: Gestión Usuarios (${newPermissions.canManageUsers ? 'SÍ' : 'NO'}), Dictámenes (${newPermissions.canEvaluateProtocols ? 'SÍ' : 'NO'}), Difusión (${newPermissions.canPublishAnnouncements ? 'SÍ' : 'NO'}), Asignación Tutores (${newPermissions.canAssignTutors ? 'SÍ' : 'NO'}).`,
    });

    return updatedUser;
  },

  grantAdminRole(
    userId: string,
    adminName: string = 'Dr. Rodrigo Mendoza Zavala'
  ): UserAccount | null {
    return this.updateUserPermissions(
      userId,
      {
        canManageUsers: true,
        canEvaluateProtocols: true,
        canPublishAnnouncements: true,
        canAssignTutors: true,
        canExportData: true,
      },
      true,
      adminName
    );
  },

  revokeAdminRole(
    userId: string,
    adminName: string = 'Dr. Rodrigo Mendoza Zavala'
  ): UserAccount | null {
    return this.updateUserPermissions(
      userId,
      {
        canManageUsers: false,
        canEvaluateProtocols: false,
        canPublishAnnouncements: false,
        canAssignTutors: false,
        canExportData: false,
      },
      false,
      adminName
    );
  },

  getAuditLogs(): AdminAuditLog[] {
    try {
      const stored = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading audit logs:', e);
    }
    return INITIAL_AUDIT_LOGS;
  },

  addAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const now = new Date();
    const timestampStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    const newLog: AdminAuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: timestampStr,
    };
    const updated = [newLog, ...logs].slice(0, 50);
    try {
      localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving audit log:', e);
    }
  },

  // Protocol Repository Functions
  getProtocols(): ProtocolDocument[] {
    try {
      const stored = localStorage.getItem(PROTOCOLS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading protocols from localStorage:', e);
    }
    this.saveProtocols(INITIAL_PROTOCOLS);
    return INITIAL_PROTOCOLS;
  },

  saveProtocols(protocols: ProtocolDocument[]): void {
    try {
      localStorage.setItem(PROTOCOLS_STORAGE_KEY, JSON.stringify(protocols));
    } catch (e) {
      console.error('Error saving protocols to localStorage:', e);
    }
  },

  addProtocol(protocolData: Omit<ProtocolDocument, 'id' | 'uploadDate' | 'updatedDate'>): ProtocolDocument {
    const protocols = this.getProtocols();
    const now = new Date().toISOString().split('T')[0];
    const newProtocol: ProtocolDocument = {
      ...protocolData,
      id: `proto_${Date.now()}`,
      uploadDate: now,
      updatedDate: now,
    };

    const updated = [newProtocol, ...protocols];
    this.saveProtocols(updated);
    return newProtocol;
  },

  updateProtocol(id: string, updates: Partial<ProtocolDocument>): ProtocolDocument | null {
    const protocols = this.getProtocols();
    const index = protocols.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProtocol = {
      ...protocols[index],
      ...updates,
      updatedDate: new Date().toISOString().split('T')[0],
    };
    protocols[index] = updatedProtocol;
    this.saveProtocols(protocols);
    return updatedProtocol;
  },

  evaluateProtocol(
    id: string,
    status: ProtocolDocument['status'],
    score: number,
    evaluatorComments: string,
    evaluatorName: string
  ): ProtocolDocument | null {
    return this.updateProtocol(id, {
      status,
      score,
      evaluatorComments,
      evaluatorName,
      evaluatedAt: new Date().toISOString().split('T')[0],
    });
  },

  deleteProtocol(id: string): boolean {
    const protocols = this.getProtocols();
    const filtered = protocols.filter((p) => p.id !== id);
    if (filtered.length !== protocols.length) {
      this.saveProtocols(filtered);
      return true;
    }
    return false;
  },

  // Export / Backup / Reset
  exportDatabaseJSON(): string {
    const dbDump = {
      version: '2.0-IMSS-Ohtli',
      exportDate: new Date().toISOString(),
      metadata: {
        system: 'Ohtli 2.0 - Estrategia de Capacitación en Investigación Médica IMSS',
        organization: 'Instituto Mexicano del Seguro Social',
        delegationsCovered: 32,
      },
      collections: {
        users: this.getUsers(),
        protocols: this.getProtocols(),
      },
    };
    return JSON.stringify(dbDump, null, 2);
  },

  importDatabaseJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.collections?.users && Array.isArray(parsed.collections.users)) {
        this.saveUsers(parsed.collections.users);
      }
      if (parsed.collections?.protocols && Array.isArray(parsed.collections.protocols)) {
        this.saveProtocols(parsed.collections.protocols);
      }
      return true;
    } catch (e) {
      console.error('Error importing database:', e);
      return false;
    }
  },

  resetToDefaults(): void {
    this.saveUsers(INITIAL_USERS);
    this.saveProtocols(INITIAL_PROTOCOLS);
  },

  generateSQLDDL(): string {
    return `
-- =========================================================================
-- ESQUEMA RELACIONAL Y BASE DE DATOS OFICIAL: OHTLI 2.0 (IMSS)
-- Coordinación de Educación e Investigación en Salud (CIS)
-- PostgreSQL 15+ / Cloud SQL Compliant
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Catálogo de Delegaciones y Unidades Médicas
CREATE TABLE delegations (
    delegation_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    region VARCHAR(50) NOT NULL
);

-- 2. Tabla Principal de Usuarios (Residentes, Tutores, Directivos)
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4(),
    matricula VARCHAR(20) UNIQUE NOT NULL,
    curp VARCHAR(18) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('RESIDENTE', 'DOCENTE', 'DIRECTIVO')),
    specialty VARCHAR(100),
    hospital_unit VARCHAR(150) NOT NULL,
    delegation_id VARCHAR(50) NOT NULL,
    residency_year VARCHAR(5) CHECK (residency_year IN ('R1', 'R2', 'R3')),
    assigned_tutor_id VARCHAR(50) REFERENCES users(user_id) ON DELETE SET NULL,
    academic_degree VARCHAR(100),
    max_tutees INT DEFAULT 5,
    position_title VARCHAR(150),
    phone VARCHAR(30),
    status VARCHAR(20) DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo', 'En Rotación', 'Egresado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Repositorio Institucional de Protocolos y Entregables de Investigación
CREATE TABLE protocol_repository (
    protocol_id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    resident_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    tutor_id VARCHAR(50) REFERENCES users(user_id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Protocolo de Investigación',
        'Base de Datos REDCap/Excel',
        'Tesis de Residencia',
        'Artículo Científico'
    )),
    phase VARCHAR(30) NOT NULL CHECK (phase IN ('R1_PROTOCOLO', 'R2_DATABASE', 'R3_TESIS_ARTICULO')),
    research_line TEXT NOT NULL,
    abstract TEXT NOT NULL,
    sirelcis_folio VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Enviado a Revisión' CHECK (status IN (
        'Borrador',
        'Enviado a Revisión',
        'En Dictamen',
        'Aprobado con Mención',
        'Aprobado',
        'Requiere Cambios',
        'Rechazado'
    )),
    score NUMERIC(5,2) CHECK (score >= 0 AND score <= 100),
    evaluator_comments TEXT,
    evaluator_name VARCHAR(150),
    evaluated_at TIMESTAMP WITH TIME ZONE,
    file_name VARCHAR(255) NOT NULL,
    file_size_kb INT NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    file_url TEXT,
    version VARCHAR(10) DEFAULT '1.0',
    umbrella_project_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Rendimiento y Búsqueda
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_matricula ON users(matricula);
CREATE INDEX idx_users_delegation ON users(delegation_id);
CREATE INDEX idx_protocols_resident ON protocol_repository(resident_id);
CREATE INDEX idx_protocols_tutor ON protocol_repository(tutor_id);
CREATE INDEX idx_protocols_phase ON protocol_repository(phase);
CREATE INDEX idx_protocols_status ON protocol_repository(status);
`.trim();
  },
};
