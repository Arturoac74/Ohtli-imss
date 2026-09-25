import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Building2,
  MapPin,
  Mail,
  Phone,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Database,
  Download,
  Upload,
  RefreshCw,
  FileCode,
  Copy,
  Check,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { UserAccount, UserRole, ResidencyYear } from '../types/ohtli';
import { DatabaseService } from '../services/databaseService';

interface UserManagementViewProps {
  currentUserRole: UserRole;
  isAdmin?: boolean;
  onRefresh?: () => void;
  onNavigateView?: (view: any) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUserRole,
  isAdmin = false,
  onNavigateView,
}) => {
  const isAuthorized = isAdmin || currentUserRole === 'DIRECTIVO';
  const [users, setUsers] = useState<UserAccount[]>(() => DatabaseService.getUsers());
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | UserRole | 'R1' | 'R2' | 'R3'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelegation, setSelectedDelegation] = useState<string>('TODAS');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Form State
  const [formRole, setFormRole] = useState<UserRole>('RESIDENTE');
  const [formMatricula, setFormMatricula] = useState('');
  const [formCurp, setFormCurp] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('Medicina Interna');
  const [formHospitalUnit, setFormHospitalUnit] = useState('HGZ No. 1 A Tlaltelolco');
  const [formDelegation, setFormDelegation] = useState('CDMX Norte');
  const [formResidencyYear, setFormResidencyYear] = useState<ResidencyYear>('R1');
  const [formAssignedTutorId, setFormAssignedTutorId] = useState('');
  const [formAcademicDegree, setFormAcademicDegree] = useState('Doctor en Ciencias Médicas');
  const [formMaxTutees, setFormMaxTutees] = useState(5);
  const [formPositionTitle, setFormPositionTitle] = useState('Coordinador Delegacional de Educación en Salud');
  const [formResearchLines, setFormResearchLines] = useState('');
  const [formIsAdmin, setFormIsAdmin] = useState(false);
  const [formCanManageUsers, setFormCanManageUsers] = useState(false);
  const [formCanEvaluateProtocols, setFormCanEvaluateProtocols] = useState(true);
  const [formCanPublishAnnouncements, setFormCanPublishAnnouncements] = useState(false);
  const [formCanAssignTutors, setFormCanAssignTutors] = useState(false);
  const [formCanExportData, setFormCanExportData] = useState(false);

  const tutorsList = useMemo(() => users.filter((u) => u.role === 'DOCENTE'), [users]);

  const delegationsList = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.delegation) set.add(u.delegation);
    });
    return Array.from(set);
  }, [users]);

  // Metrics calculation
  const metrics = useMemo(() => {
    const residents = users.filter((u) => u.role === 'RESIDENTE');
    const tutors = users.filter((u) => u.role === 'DOCENTE');
    const directors = users.filter((u) => u.role === 'DIRECTIVO');
    
    const r1Count = residents.filter((r) => r.residencyYear === 'R1').length;
    const r2Count = residents.filter((r) => r.residencyYear === 'R2').length;
    const r3Count = residents.filter((r) => r.residencyYear === 'R3').length;

    const residentsWithTutor = residents.filter((r) => r.assignedTutorId || r.assignedTutorName).length;
    const tutorCoveragePercent = residents.length > 0 ? Math.round((residentsWithTutor / residents.length) * 100) : 0;

    return {
      totalUsers: users.length,
      residentsCount: residents.length,
      r1Count,
      r2Count,
      r3Count,
      tutorsCount: tutors.length,
      directorsCount: directors.length,
      tutorCoveragePercent,
    };
  }, [users]);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Role / Year filter
      if (selectedRoleFilter === 'RESIDENTE' && user.role !== 'RESIDENTE') return false;
      if (selectedRoleFilter === 'DOCENTE' && user.role !== 'DOCENTE') return false;
      if (selectedRoleFilter === 'DIRECTIVO' && user.role !== 'DIRECTIVO') return false;
      if (selectedRoleFilter === 'R1' && (user.role !== 'RESIDENTE' || user.residencyYear !== 'R1')) return false;
      if (selectedRoleFilter === 'R2' && (user.role !== 'RESIDENTE' || user.residencyYear !== 'R2')) return false;
      if (selectedRoleFilter === 'R3' && (user.role !== 'RESIDENTE' || user.residencyYear !== 'R3')) return false;

      // Delegation filter
      if (selectedDelegation !== 'TODAS' && user.delegation !== selectedDelegation) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = user.fullName.toLowerCase().includes(q);
        const matchMatricula = user.matricula.toLowerCase().includes(q);
        const matchSpecialty = user.specialty?.toLowerCase().includes(q) || false;
        const matchUnit = user.hospitalUnit.toLowerCase().includes(q);
        const matchTutor = user.assignedTutorName?.toLowerCase().includes(q) || false;
        return matchName || matchMatricula || matchSpecialty || matchUnit || matchTutor;
      }

      return true;
    });
  }, [users, selectedRoleFilter, selectedDelegation, searchQuery]);

  const showNotification = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleOpenCreateModal = (roleToPreselect: UserRole = 'RESIDENTE') => {
    setEditingUser(null);
    setFormRole(roleToPreselect);
    setFormMatricula('');
    setFormCurp('');
    setFormFullName('');
    setFormEmail('');
    setFormPhone('');
    setFormSpecialty('Medicina Interna');
    setFormHospitalUnit('HGZ No. 1 A Tlaltelolco');
    setFormDelegation('CDMX Norte');
    setFormResidencyYear('R1');
    setFormAssignedTutorId(tutorsList[0]?.id || '');
    setFormAcademicDegree('Doctor en Ciencias Médicas');
    setFormMaxTutees(5);
    setFormPositionTitle('Coordinador Delegacional de Educación en Salud');
    setFormResearchLines('Epidemiología Clínica, Enfermedades Crónicas');
    setFormIsAdmin(roleToPreselect === 'DIRECTIVO');
    setFormCanManageUsers(roleToPreselect === 'DIRECTIVO');
    setFormCanEvaluateProtocols(true);
    setFormCanPublishAnnouncements(roleToPreselect === 'DIRECTIVO');
    setFormCanAssignTutors(roleToPreselect === 'DIRECTIVO');
    setFormCanExportData(roleToPreselect === 'DIRECTIVO');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setFormRole(user.role);
    setFormMatricula(user.matricula);
    setFormCurp(user.curp || '');
    setFormFullName(user.fullName);
    setFormEmail(user.email);
    setFormPhone(user.phone || '');
    setFormSpecialty(user.specialty || 'Medicina Interna');
    setFormHospitalUnit(user.hospitalUnit);
    setFormDelegation(user.delegation);
    setFormResidencyYear(user.residencyYear || 'R1');
    setFormAssignedTutorId(user.assignedTutorId || '');
    setFormAcademicDegree(user.academicDegree || 'Doctor en Ciencias Médicas');
    setFormMaxTutees(user.maxTutees || 5);
    setFormPositionTitle(user.positionTitle || 'Coordinador Delegacional');
    setFormResearchLines(user.researchLines?.join(', ') || '');
    setFormIsAdmin(Boolean(user.isAdmin || user.role === 'DIRECTIVO'));
    setFormCanManageUsers(Boolean(user.permissions?.canManageUsers));
    setFormCanEvaluateProtocols(Boolean(user.permissions?.canEvaluateProtocols ?? true));
    setFormCanPublishAnnouncements(Boolean(user.permissions?.canPublishAnnouncements));
    setFormCanAssignTutors(Boolean(user.permissions?.canAssignTutors));
    setFormCanExportData(Boolean(user.permissions?.canExportData));
    setIsCreateModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formFullName.trim() || !formMatricula.trim() || !formEmail.trim()) {
      showNotification('Por favor completa todos los campos obligatorios.', 'error');
      return;
    }

    const assignedTutor = tutorsList.find((t) => t.id === formAssignedTutorId);

    const userPayload: Omit<UserAccount, 'id' | 'createdAt'> = {
      matricula: formMatricula.trim(),
      curp: formCurp.trim().toUpperCase(),
      fullName: formFullName.trim(),
      email: formEmail.trim(),
      role: formRole,
      phone: formPhone.trim(),
      hospitalUnit: formHospitalUnit.trim(),
      delegation: formDelegation.trim(),
      status: 'Activo',
      specialty: formRole === 'RESIDENTE' || formRole === 'DOCENTE' ? formSpecialty : undefined,
      residencyYear: formRole === 'RESIDENTE' ? formResidencyYear : undefined,
      assignedTutorId: formRole === 'RESIDENTE' ? assignedTutor?.id : undefined,
      assignedTutorName: formRole === 'RESIDENTE' ? assignedTutor?.fullName : undefined,
      academicDegree: formRole === 'DOCENTE' ? formAcademicDegree : undefined,
      maxTutees: formRole === 'DOCENTE' ? Number(formMaxTutees) : undefined,
      positionTitle: formRole === 'DIRECTIVO' ? formPositionTitle : undefined,
      researchLines: formResearchLines
        ? formResearchLines.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined,
      isAdmin: formRole === 'DIRECTIVO' || formIsAdmin,
      permissions: {
        canManageUsers: formIsAdmin ? formCanManageUsers : false,
        canEvaluateProtocols: formCanEvaluateProtocols,
        canPublishAnnouncements: formIsAdmin ? formCanPublishAnnouncements : false,
        canAssignTutors: formIsAdmin ? formCanAssignTutors : false,
        canExportData: formIsAdmin ? formCanExportData : false,
      },
    };

    if (editingUser) {
      DatabaseService.updateUser(editingUser.id, userPayload);
      showNotification(`Usuario "${formFullName}" actualizado correctamente.`);
    } else {
      DatabaseService.addUser(userPayload);
      showNotification(`Usuario "${formFullName}" dado de alta con éxito en Ohtli 2.0.`);
    }

    setUsers(DatabaseService.getUsers());
    setIsCreateModalOpen(false);
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (window.confirm(`¿Confirmas la baja del usuario ${user.fullName} (${user.matricula})?`)) {
      DatabaseService.deleteUser(user.id);
      setUsers(DatabaseService.getUsers());
      showNotification(`Usuario ${user.fullName} eliminado de la base de datos.`, 'info');
    }
  };

  const handleExportJSON = () => {
    const json = DatabaseService.exportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ohtli_IMSS_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Respaldo institucional descargado en formato JSON.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = DatabaseService.importDatabaseJSON(content);
      if (success) {
        setUsers(DatabaseService.getUsers());
        showNotification('Base de datos restaurada correctamente desde archivo JSON.');
      } else {
        showNotification('Error al interpretar el archivo de base de datos JSON.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('¿Deseas restaurar la base de datos a los registros oficiales precargados del IMSS?')) {
      DatabaseService.resetToDefaults();
      setUsers(DatabaseService.getUsers());
      showNotification('Base de datos restablecida a los valores oficiales predeterminados.');
    }
  };

  const handleCopySQL = () => {
    const sql = DatabaseService.generateSQLDDL();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
    showNotification('Esquema SQL copiado al portapapeles.');
  };

  // Access Control Guard: If not authorized (not admin and not directivo), show restriction notice
  if (!isAuthorized) {
    return (
      <div className="bg-[#FAF8F5] rounded-2xl p-8 border border-[#6B1D2F]/20 text-center max-w-2xl mx-auto my-12 space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-[#6B1D2F]">Acceso Restringido: Administración de Usuarios</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          El módulo de <strong>Administración de Usuarios</strong> y gestión del padrón institucional está reservado exclusivamente para directivos y usuarios con privilegios de <strong>Administrador</strong>.
        </p>
        <div className="p-3 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-700">
          💡 Para otorgar o modificar permisos de administrador a tutores o directivos, dirígete al <strong>Dashboard Directivo</strong> en la pestaña <strong>"Administradores & Permisos"</strong>.
        </div>
        {onNavigateView && (
          <button
            onClick={() => onNavigateView('dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B1D2F] text-white text-xs font-bold hover:bg-[#831843] transition-all shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
            <span>Volver al Dashboard</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 transition-all animate-bounce ${
            feedbackMessage.type === 'error'
              ? 'bg-red-900 text-white border-red-700'
              : feedbackMessage.type === 'info'
              ? 'bg-amber-900 text-white border-amber-700'
              : 'bg-[#6B1D2F] text-white border-[#C5A059]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span className="text-xs font-bold">{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner & Title */}
      <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#6B1D2F]/20 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#6B1D2F] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Módulo Administrativo
              </span>
              <span className="text-xs font-bold text-[#6B1D2F] flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> Base de Datos Relacional Ohtli 2.0
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#6B1D2F] tracking-tight mt-1">
              Padrón Institucional: Residentes, Tutores y Directivos
            </h1>
            <p className="text-xs text-[#1c1917]/80 mt-1 max-w-3xl">
              Alta, seguimiento, asignación de tutores y administración de la comunidad de investigación médica en delegaciones y UMAEs del IMSS.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenCreateModal('RESIDENTE')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#6B1D2F] text-white hover:bg-[#831843] transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Alta de Usuario</span>
            </button>

            <button
              onClick={() => setIsSchemaModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-[#6B1D2F] border border-[#6B1D2F]/30 hover:bg-[#6B1D2F]/10 transition-all cursor-pointer"
              title="Ver esquema SQL / PostgreSQL y opciones de respaldo"
            >
              <FileCode className="w-4 h-4 text-[#C5A059]" />
              <span>Esquema SQL & Backup</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-[#1c1917] border border-[#1c1917]/20 hover:bg-stone-100 transition-all cursor-pointer"
              title="Descargar respaldo JSON de la base de datos"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#6B1D2F]">Total Residentes</span>
            <GraduationCap className="w-4 h-4 text-[#6B1D2F]" />
          </div>
          <div className="text-2xl font-black text-[#1c1917] mt-1">{metrics.residentsCount}</div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#1c1917]/70 mt-1">
            <span className="bg-[#6B1D2F]/10 text-[#6B1D2F] px-1.5 py-0.5 rounded">R1: {metrics.r1Count}</span>
            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">R2: {metrics.r2Count}</span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">R3: {metrics.r3Count}</span>
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#1e40af]">Tutores & CINV</span>
            <Briefcase className="w-4 h-4 text-[#1e40af]" />
          </div>
          <div className="text-2xl font-black text-[#1c1917] mt-1">{metrics.tutorsCount}</div>
          <div className="text-[10px] font-medium text-emerald-800 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Investigadores activos</span>
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#831843]">Directivos CIS</span>
            <ShieldCheck className="w-4 h-4 text-[#831843]" />
          </div>
          <div className="text-2xl font-black text-[#1c1917] mt-1">{metrics.directorsCount}</div>
          <div className="text-[10px] font-medium text-[#1c1917]/70 mt-1">
            Coordinaciones Delegacionales
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-emerald-800">Cobertura Tutoría</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{metrics.tutorCoveragePercent}%</div>
          <div className="text-[10px] font-medium text-[#1c1917]/70 mt-1">
            Residentes con tutor asignado
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, matrícula, especialidad o hospital..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#6B1D2F]/20 bg-white text-[#1c1917] placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex flex-wrap items-center gap-1 w-full md:w-auto">
          <button
            onClick={() => setSelectedRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedRoleFilter === 'ALL'
                ? 'bg-[#6B1D2F] text-white'
                : 'bg-white text-[#1c1917] border border-[#6B1D2F]/20 hover:bg-[#6B1D2F]/10'
            }`}
          >
            Todos ({users.length})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('RESIDENTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedRoleFilter === 'RESIDENTE'
                ? 'bg-[#6B1D2F] text-white'
                : 'bg-white text-[#1c1917] border border-[#6B1D2F]/20 hover:bg-[#6B1D2F]/10'
            }`}
          >
            Residentes ({metrics.residentsCount})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('R1')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedRoleFilter === 'R1'
                ? 'bg-[#6B1D2F] text-white'
                : 'bg-white text-[#6B1D2F] border border-[#6B1D2F]/20 hover:bg-[#6B1D2F]/10'
            }`}
          >
            R1
          </button>
          <button
            onClick={() => setSelectedRoleFilter('R2')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedRoleFilter === 'R2'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            R2
          </button>
          <button
            onClick={() => setSelectedRoleFilter('R3')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedRoleFilter === 'R3'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            R3
          </button>
          <button
            onClick={() => setSelectedRoleFilter('DOCENTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedRoleFilter === 'DOCENTE'
                ? 'bg-[#1e40af] text-white'
                : 'bg-white text-[#1e40af] border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Tutores ({metrics.tutorsCount})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('DIRECTIVO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedRoleFilter === 'DIRECTIVO'
                ? 'bg-[#831843] text-white'
                : 'bg-white text-[#831843] border border-pink-200 hover:bg-pink-50'
            }`}
          >
            Directivos ({metrics.directorsCount})
          </button>
        </div>

        {/* Delegation Selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#6B1D2F]" />
          <select
            value={selectedDelegation}
            onChange={(e) => setSelectedDelegation(e.target.value)}
            className="text-xs py-1.5 px-2 rounded-lg border border-[#6B1D2F]/20 bg-white text-[#1c1917] font-medium"
          >
            <option value="TODAS">Todas las Delegaciones</option>
            {delegationsList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table / Directory */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#6B1D2F]/20 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EFE9DF] text-[#6B1D2F] text-[11px] font-black uppercase tracking-wider border-b border-[#6B1D2F]/20">
                <th className="py-3 px-4">Usuario / Matrícula</th>
                <th className="py-3 px-4">Rol & Nivel</th>
                <th className="py-3 px-4">Especialidad / Cargo</th>
                <th className="py-3 px-4">Unidad Hospitalaria & Delegación</th>
                <th className="py-3 px-4">Tutor Asignado / Grado</th>
                <th className="py-3 px-4 text-center">Estatus</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6B1D2F]/10 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500 font-medium">
                    No se encontraron usuarios con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isResident = user.role === 'RESIDENTE';
                  const isTutor = user.role === 'DOCENTE';
                  const isDirector = user.role === 'DIRECTIVO';

                  return (
                    <tr key={user.id} className="hover:bg-white/70 transition-colors">
                      {/* Name & Matricula */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                            style={{ backgroundColor: user.avatarColor || '#6B1D2F' }}
                          >
                            {user.fullName.replace('Dr. ', '').replace('Dra. ', '').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-[#1c1917]">{user.fullName}</div>
                            <div className="text-[11px] font-mono text-stone-600 flex items-center gap-1.5">
                              <span>Matrícula: {user.matricula}</span>
                              {user.curp && <span className="text-[10px] text-stone-400 font-sans">({user.curp})</span>}
                            </div>
                            <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-2.5 h-2.5" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Year */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <div className="flex items-center gap-1.5">
                            {isResident && (
                              <>
                                <span className="bg-[#6B1D2F]/15 text-[#6B1D2F] font-extrabold px-2 py-0.5 rounded text-[11px]">
                                  Residente
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded font-black text-[10px] ${
                                    user.residencyYear === 'R1'
                                      ? 'bg-[#6B1D2F] text-white'
                                      : user.residencyYear === 'R2'
                                      ? 'bg-blue-700 text-white'
                                      : 'bg-emerald-700 text-white'
                                  }`}
                                >
                                  {user.residencyYear}
                                </span>
                              </>
                            )}
                            {isTutor && (
                              <span className="bg-blue-100 text-blue-900 font-extrabold px-2 py-0.5 rounded text-[11px]">
                                Tutor / CINV
                              </span>
                            )}
                            {isDirector && (
                              <span className="bg-pink-100 text-pink-900 font-extrabold px-2 py-0.5 rounded text-[11px]">
                                Directivo CIS
                              </span>
                            )}
                          </div>
                          {(user.isAdmin || user.role === 'DIRECTIVO' || user.permissions?.canManageUsers) && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.5 rounded text-[9px]">
                              <ShieldCheck className="w-2.5 h-2.5 text-[#C5A059]" />
                              <span>Admin ({user.permissions?.canManageUsers ? 'Gestión' : 'Dictámenes'})</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Specialty / Title */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1c1917]">
                          {user.specialty || user.positionTitle || 'General'}
                        </div>
                        {user.researchLines && user.researchLines.length > 0 && (
                          <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            Líneas: {user.researchLines.join(', ')}
                          </div>
                        )}
                      </td>

                      {/* Unit & Delegation */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#1c1917] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-stone-500 shrink-0" />
                          <span className="line-clamp-1">{user.hospitalUnit}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-[#C5A059]" />
                          <span>{user.delegation}</span>
                        </div>
                      </td>

                      {/* Tutor / Degree */}
                      <td className="py-3.5 px-4">
                        {isResident ? (
                          user.assignedTutorName ? (
                            <div className="font-medium text-blue-900 text-[11px]">
                              {user.assignedTutorName}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              <AlertCircle className="w-2.5 h-2.5" /> Sin Tutor Asignado
                            </span>
                          )
                        ) : isTutor ? (
                          <div className="text-[11px] text-stone-700">
                            <span className="font-semibold">{user.academicDegree || 'Investigador'}</span>
                            <div className="text-[10px] text-stone-500 mt-0.5">
                              Capacidad: {user.maxTutees || 5} tuteados
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-500">CIS / Educación</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {user.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-[#6B1D2F] hover:bg-[#6B1D2F]/10 transition-colors"
                            title="Editar usuario"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#6B1D2F]/30 shadow-2xl max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#6B1D2F]/20 pb-3">
              <div>
                <span className="bg-[#6B1D2F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  {editingUser ? 'Edición de Usuario' : 'Nuevo Registro'}
                </span>
                <h3 className="text-lg font-black text-[#6B1D2F] mt-1">
                  {editingUser ? `Modificar Datos: ${editingUser.fullName}` : 'Alta de Residente, Tutor o Directivo'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              {/* Role Selection */}
              <div>
                <label className="block font-extrabold text-[#6B1D2F] mb-1">Rol Institucional *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['RESIDENTE', 'DOCENTE', 'DIRECTIVO'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormRole(r)}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                        formRole === r
                          ? 'bg-[#6B1D2F] text-white border-[#6B1D2F] shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {r === 'RESIDENTE' ? 'Médico Residente' : r === 'DOCENTE' ? 'Tutor / CINV' : 'Directivo CIS'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Details (Matricula, CURP, Name) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Matrícula IMSS *</label>
                  <input
                    type="text"
                    required
                    value={formMatricula}
                    onChange={(e) => setFormMatricula(e.target.value)}
                    placeholder="Ej. 99482710"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-mono focus:ring-1 focus:ring-[#6B1D2F]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">CURP</label>
                  <input
                    type="text"
                    value={formCurp}
                    onChange={(e) => setFormCurp(e.target.value)}
                    placeholder="18 caracteres"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white uppercase font-mono focus:ring-1 focus:ring-[#6B1D2F]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nombre Completo con Título *</label>
                  <input
                    type="text"
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="Ej. Dra. Laura Gómez Fuentes"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-[#6B1D2F]"
                  />
                </div>
              </div>

              {/* Contact (Email, Phone) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Correo Institucional IMSS *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="nombre.apellido@imss.gob.mx"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-[#6B1D2F]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Teléfono / Conmutador Ext.</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="55 1234 5678"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-[#6B1D2F]"
                  />
                </div>
              </div>

              {/* Unit & Delegation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unidad Hospitalaria / Sede *</label>
                  <input
                    type="text"
                    required
                    value={formHospitalUnit}
                    onChange={(e) => setFormHospitalUnit(e.target.value)}
                    placeholder="Ej. UMAE HG CMN La Raza"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-[#6B1D2F]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Delegación IMSS *</label>
                  <select
                    value={formDelegation}
                    onChange={(e) => setFormDelegation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-medium focus:ring-1 focus:ring-[#6B1D2F]"
                  >
                    <option value="CDMX Norte">CDMX Norte</option>
                    <option value="CDMX Sur">CDMX Sur</option>
                    <option value="Jalisco">Jalisco</option>
                    <option value="Nuevo León">Nuevo León</option>
                    <option value="Puebla">Puebla</option>
                    <option value="Yucatán">Yucatán</option>
                    <option value="Nivel Central">Nivel Central</option>
                    <option value="Veracruz Norte">Veracruz Norte</option>
                    <option value="Sonora">Sonora</option>
                  </select>
                </div>
              </div>

              {/* Conditional Fields based on Role */}
              {formRole === 'RESIDENTE' && (
                <div className="p-3.5 bg-[#6B1D2F]/5 rounded-xl border border-[#6B1D2F]/20 space-y-3">
                  <div className="font-extrabold text-[#6B1D2F] text-[11px] uppercase">
                    Datos del Residente Médico
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Especialidad Médica *</label>
                      <input
                        type="text"
                        required
                        value={formSpecialty}
                        onChange={(e) => setFormSpecialty(e.target.value)}
                        placeholder="Ej. Medicina Interna"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-[#6B1D2F]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Año de Residencia *</label>
                      <select
                        value={formResidencyYear}
                        onChange={(e) => setFormResidencyYear(e.target.value as ResidencyYear)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-bold text-[#6B1D2F]"
                      >
                        <option value="R1">R1 (Año 1 - Protocolo)</option>
                        <option value="R2">R2 (Año 2 - Base de Datos)</option>
                        <option value="R3">R3 (Año 3 - Tesis / Artículo)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Tutor Asignado</label>
                      <select
                        value={formAssignedTutorId}
                        onChange={(e) => setFormAssignedTutorId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-medium"
                      >
                        <option value="">-- Sin tutor asignado --</option>
                        {tutorsList.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.fullName} ({t.delegation})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {formRole === 'DOCENTE' && (
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
                  <div className="font-extrabold text-[#1e40af] text-[11px] uppercase">
                    Datos del Tutor e Investigador CINV
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Grado Académico</label>
                      <input
                        type="text"
                        value={formAcademicDegree}
                        onChange={(e) => setFormAcademicDegree(e.target.value)}
                        placeholder="Ej. Dr. en Ciencias Médicas (SNII I)"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Capacidad Máxima de Tuteados</label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={formMaxTutees}
                        onChange={(e) => setFormMaxTutees(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Líneas de Investigación</label>
                      <input
                        type="text"
                        value={formResearchLines}
                        onChange={(e) => setFormResearchLines(e.target.value)}
                        placeholder="Cardiología, Ensayos Clínicos..."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formRole === 'DIRECTIVO' && (
                <div className="p-3.5 bg-pink-50/70 rounded-xl border border-pink-200 space-y-3">
                  <div className="font-extrabold text-[#831843] text-[11px] uppercase">
                    Datos Directivos y de Coordinación CIS
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Cargo / Puesto Institucional *</label>
                    <input
                      type="text"
                      required
                      value={formPositionTitle}
                      onChange={(e) => setFormPositionTitle(e.target.value)}
                      placeholder="Ej. Coordinador Delegacional de Educación en Salud"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Administrative Permissions Configuration */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-extrabold text-amber-950 text-[11px] uppercase tracking-wider">
                      Privilegios de Administrador & Permisos
                    </span>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsAdmin || formRole === 'DIRECTIVO'}
                      disabled={formRole === 'DIRECTIVO'}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormIsAdmin(checked);
                        if (checked) {
                          setFormCanManageUsers(true);
                          setFormCanEvaluateProtocols(true);
                          setFormCanPublishAnnouncements(true);
                          setFormCanAssignTutors(true);
                          setFormCanExportData(true);
                        } else {
                          setFormCanManageUsers(false);
                          setFormCanPublishAnnouncements(false);
                          setFormCanAssignTutors(false);
                          setFormCanExportData(false);
                        }
                      }}
                      className="w-4 h-4 rounded text-[#6B1D2F] focus:ring-[#6B1D2F]"
                    />
                    <span className="text-xs font-bold text-amber-950">
                      {formRole === 'DIRECTIVO' ? 'Admin por Rol Directivo' : 'Otorgar Rol Administrador'}
                    </span>
                  </label>
                </div>

                {(formIsAdmin || formRole === 'DIRECTIVO') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-200 text-xs">
                    <label className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formCanManageUsers}
                        onChange={(e) => setFormCanManageUsers(e.target.checked)}
                        className="rounded text-[#6B1D2F]"
                      />
                      <span className="text-stone-800 font-medium">Gestión de Usuarios y Altas</span>
                    </label>

                    <label className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formCanEvaluateProtocols}
                        onChange={(e) => setFormCanEvaluateProtocols(e.target.checked)}
                        className="rounded text-[#6B1D2F]"
                      />
                      <span className="text-stone-800 font-medium">Evaluación y Dictamen de Protocolos</span>
                    </label>

                    <label className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formCanAssignTutors}
                        onChange={(e) => setFormCanAssignTutors(e.target.checked)}
                        className="rounded text-[#6B1D2F]"
                      />
                      <span className="text-stone-800 font-medium">Asignación de Tutores CINV</span>
                    </label>

                    <label className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formCanExportData}
                        onChange={(e) => setFormCanExportData(e.target.checked)}
                        className="rounded text-[#6B1D2F]"
                      />
                      <span className="text-stone-800 font-medium">Exportar Bases de Datos & SQL</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-700 font-bold hover:bg-stone-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6B1D2F] text-white font-bold hover:bg-[#831843] transition-all shadow-xs"
                >
                  {editingUser ? 'Guardar Cambios' : 'Registrar en Base de Datos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SQL SCHEMA & BACKUP MODAL */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#6B1D2F]/30 shadow-2xl max-w-3xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#6B1D2F]/20 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#6B1D2F]" />
                <h3 className="text-lg font-black text-[#6B1D2F]">
                  Esquema Relacional PostgreSQL & Herramientas de Base de Datos
                </h3>
              </div>
              <button
                onClick={() => setIsSchemaModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-stone-700">
                El modelo de datos de <strong>Ohtli 2.0</strong> está diseñado siguiendo las normas de interoperabilidad del IMSS, normalizado en 3FN para PostgreSQL / Cloud SQL.
              </p>

              {/* Action Buttons inside modal */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopySQL}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#6B1D2F] text-white hover:bg-[#831843]"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copiado' : 'Copiar DDL SQL'}</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#1c1917] border border-stone-300 hover:bg-stone-100"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Backup JSON</span>
                </button>

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#1c1917] border border-stone-300 hover:bg-stone-100 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restaurar JSON</span>
                  <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                </label>

                <button
                  onClick={handleResetToDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 ml-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restablecer Predeterminados</span>
                </button>
              </div>

              {/* SQL Code Preview Block */}
              <div className="relative bg-[#1c1917] text-stone-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-72 border border-stone-700">
                <pre>{DatabaseService.generateSQLDDL()}</pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-200">
              <button
                onClick={() => setIsSchemaModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#6B1D2F] text-white font-bold hover:bg-[#831843]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
