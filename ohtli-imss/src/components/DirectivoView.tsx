import React, { useState, useEffect } from 'react';
import { DelegationHeatMap, AppViewMode, UserAccount, UserPermissions, AdminAuditLog } from '../types/ohtli';
import { DatabaseService } from '../services/databaseService';
import {
  Building2,
  TrendingUp,
  BarChart3,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  Send,
  Users,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Lock,
  KeyRound,
  FileSpreadsheet,
  Check,
  X,
  History,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
} from 'lucide-react';

interface DirectivoViewProps {
  heatmapData: DelegationHeatMap[];
  onPublishAnnouncement: (title: string, message: string) => void;
  onNavigateView?: (view: AppViewMode) => void;
}

export const DirectivoView: React.FC<DirectivoViewProps> = ({
  heatmapData,
  onPublishAnnouncement,
  onNavigateView,
}) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'administrators'>('monitoring');
  const [selectedDelegation, setSelectedDelegation] = useState<DelegationHeatMap>(heatmapData[0]);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [publishedAlert, setPublishedAlert] = useState<string | null>(null);

  // Administrators and permissions state
  const [administrators, setAdministrators] = useState<UserAccount[]>([]);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [adminSearch, setAdminSearch] = useState('');
  
  // Grant admin modal state
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [customPermissions, setCustomPermissions] = useState<UserPermissions>({
    canManageUsers: true,
    canEvaluateProtocols: true,
    canPublishAnnouncements: false,
    canAssignTutors: true,
    canExportData: false,
  });
  const [grantSuccessMsg, setGrantSuccessMsg] = useState<string | null>(null);

  // Load database state
  const reloadData = () => {
    const users = DatabaseService.getUsers();
    setAllUsers(users);
    setAdministrators(DatabaseService.getAdministrators());
    setAuditLogs(DatabaseService.getAuditLogs());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const totalResidentsNational = heatmapData.reduce((acc, curr) => acc + curr.residentsTotal, 0);

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementMessage) return;

    onPublishAnnouncement(announcementTitle, announcementMessage);
    setPublishedAlert('Comunicado institucional enviado a todas las delegaciones.');
    setAnnouncementTitle('');
    setAnnouncementMessage('');

    setTimeout(() => {
      setPublishedAlert(null);
    }, 3000);
  };

  // Toggle individual permission directly in the table
  const handleTogglePermission = (userId: string, permKey: keyof UserPermissions, currentValue: boolean) => {
    const updated = DatabaseService.updateUserPermissions(
      userId,
      { [permKey]: !currentValue },
      undefined,
      'Dr. Rodrigo Mendoza Zavala'
    );
    if (updated) {
      reloadData();
      showAdminToast(`Permiso "${permKey}" actualizado para ${updated.fullName}`);
    }
  };

  // Revoke admin status
  const handleRevokeAdmin = (user: UserAccount) => {
    if (user.role === 'DIRECTIVO') {
      alert('Los usuarios con rol estructural DIRECTIVO mantienen permisos por jerarquía institucional.');
      return;
    }
    if (window.confirm(`¿Confirmas la revocación de permisos de administrador para ${user.fullName}?`)) {
      DatabaseService.revokeAdminRole(user.id, 'Dr. Rodrigo Mendoza Zavala');
      reloadData();
      showAdminToast(`Permisos de administrador revocados para ${user.fullName}`);
    }
  };

  // Grant admin to candidate
  const handleGrantAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) return;

    const targetUser = allUsers.find((u) => u.id === selectedCandidateId);
    if (!targetUser) return;

    DatabaseService.updateUserPermissions(
      selectedCandidateId,
      customPermissions,
      true,
      'Dr. Rodrigo Mendoza Zavala'
    );

    reloadData();
    setIsGrantModalOpen(false);
    setSelectedCandidateId('');
    showAdminToast(`¡Permisos de Administrador otorgados exitosamente a ${targetUser.fullName}!`);
  };

  const showAdminToast = (msg: string) => {
    setGrantSuccessMsg(msg);
    setTimeout(() => setGrantSuccessMsg(null), 4000);
  };

  // Potential candidates to promote (Docentes or users not already having canManageUsers)
  const candidateUsers = allUsers.filter(
    (u) => u.role === 'DOCENTE' || u.role === 'DIRECTIVO'
  );

  const filteredAdmins = administrators.filter((adm) => {
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase();
    return (
      adm.fullName.toLowerCase().includes(q) ||
      adm.matricula.toLowerCase().includes(q) ||
      adm.hospitalUnit.toLowerCase().includes(q) ||
      adm.delegation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Executive Header Banner */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 md:p-6 border border-[#6B1D2F]/20 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-[#6B1D2F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Panel Directivo & Autoridades IMSS
              </span>
              <span className="text-xs text-[#6B1D2F] font-bold">
                Monitoreo Institucional Nivel Central (CPEI, CCEI, CAMIS, JDIS)
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#6B1D2F]">
              Dashboard Directivo y de Gobernanza Ohtli 2.0
            </h1>
            <p className="text-xs text-[#1c1917]/80 mt-1">
              Supervisión de cumplimiento de protocolos R1-R3, gobernanza de roles y asignación de permisos de administración.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateView && (
              <button
                onClick={() => onNavigateView('admin_users')}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#6B1D2F] hover:bg-[#521624] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Users className="w-4 h-4" />
                <span>Padrón de Usuarios</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tab Switcher */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#6B1D2F]/15">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'monitoring'
                ? 'bg-[#6B1D2F] text-white shadow-xs'
                : 'bg-[#F3EFE6] text-[#1c1917]/80 hover:bg-[#E6DFD3] hover:text-[#6B1D2F]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Monitoreo y Eficiencia Nacional</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('administrators');
              reloadData();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'administrators'
                ? 'bg-[#6B1D2F] text-white shadow-xs'
                : 'bg-[#F3EFE6] text-[#1c1917]/80 hover:bg-[#E6DFD3] hover:text-[#6B1D2F]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pestaña Administradores & Permisos</span>
            <span className="bg-[#FAF8F5] text-[#6B1D2F] text-[10px] font-black px-1.5 py-0.5 rounded-full border border-[#6B1D2F]/20">
              {administrators.length}
            </span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {grantSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{grantSuccessMsg}</span>
          </div>
          <button onClick={() => setGrantSuccessMsg(null)} className="text-emerald-800 hover:text-emerald-950 font-bold">
            ×
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: MONITOREO Y EFICIENCIA NACIONAL */}
      {/* ========================================================================= */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Top Key National Performance Indicators (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B1D2F]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/70">Residentes Totales</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-[#6B1D2F]">
                {totalResidentsNational.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 100% Cobertura Ohtli 2.0
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B1D2F]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/70">Aprobación R1 Protocolos</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-[#6B1D2F]">84.2%</div>
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18% vs año anterior (meta 80%)
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B1D2F]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/70">Graduación a Tiempo R3</span>
                <BarChart3 className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div className="text-2xl font-black text-[#6B1D2F]">72.5%</div>
              <div className="text-[11px] text-[#6B1D2F] font-bold">
                Meta histórica IMSS superada (&gt;50%)
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B1D2F]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/70">Nodos CINV / CIEFD</span>
                <Building2 className="w-4 h-4 text-[#6B1D2F]" />
              </div>
              <div className="text-2xl font-black text-[#6B1D2F]">18 Nodos</div>
              <div className="text-[11px] text-[#6B1D2F] font-bold">
                Red Nacional Conectada
              </div>
            </div>
          </div>

          {/* National Heatmap by Delegation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-[#FAF8F5] rounded-2xl p-5 md:p-6 border border-[#6B1D2F]/20 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#6B1D2F]/15 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-[#6B1D2F] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Desempeño y Cumplimiento por Órgano de Operación Administrativa (OOAD)
                  </h2>
                  <p className="text-xs text-[#1c1917]/70 mt-0.5">
                    Selecciona una delegación para ver el análisis de avance R1-R3 y productividad científica.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
                {heatmapData.map((del) => (
                  <div
                    key={del.delegationId}
                    onClick={() => setSelectedDelegation(del)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedDelegation.delegationId === del.delegationId
                        ? 'border-[#6B1D2F] bg-white ring-2 ring-[#6B1D2F]/20 shadow-xs'
                        : 'border-[#6B1D2F]/15 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#6B1D2F] bg-[#6B1D2F]/10 px-1.5 py-0.5 rounded">
                          {del.delegationId}
                        </span>
                        <h3 className="font-extrabold text-sm text-[#1c1917] mt-1">
                          {del.delegationName}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          del.complianceStatus === 'Excelente'
                            ? 'bg-emerald-100 text-emerald-800'
                            : del.complianceStatus === 'Favorable'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {del.complianceStatus}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-[#1c1917]/70">Avance R1 Protocolos:</span>
                          <span className="text-[#6B1D2F]">{del.r1ProtocolApprovalRate}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#6B1D2F]/15 rounded-full overflow-hidden mt-0.5">
                          <div
                            className="h-full bg-[#6B1D2F] rounded-full"
                            style={{ width: `${del.r1ProtocolApprovalRate}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-[11px] text-[#1c1917]/70 font-medium pt-1">
                        <span>Defensa Tesis R3: <strong>{del.r3ThesisDefenseRate}%</strong></span>
                        <span>Publicaciones: <strong>{del.publicationRate}%</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Delegation Diagnostic & Broadcast Channel */}
            <div className="space-y-6">
              
              {/* Selected Delegation Details */}
              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-3">
                <div className="border-b border-[#6B1D2F]/15 pb-2">
                  <span className="text-[10px] font-extrabold uppercase bg-[#6B1D2F] text-white px-2 py-0.5 rounded">
                    Diagnóstico Delegacional
                  </span>
                  <h3 className="font-extrabold text-base text-[#6B1D2F] mt-1">
                    {selectedDelegation.delegationName}
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded bg-white border border-[#6B1D2F]/10 font-semibold">
                    <span>Centros Nodos CINV:</span>
                    <span className="text-[#6B1D2F] font-extrabold">{selectedDelegation.cinvNodesCount} Unidades</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white border border-[#6B1D2F]/10 font-semibold">
                    <span>Proyectos Paraguas Activos:</span>
                    <span className="text-[#6B1D2F] font-extrabold">{selectedDelegation.activeUmbrellaProjects} Proyectos</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white border border-[#6B1D2F]/10 font-semibold">
                    <span>Calidad BD REDCap R2:</span>
                    <span className="text-emerald-700 font-extrabold">{selectedDelegation.r2DatabaseQualityRate}% Validado</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white border border-[#6B1D2F]/10 font-semibold">
                    <span>Estatus de Cumplimiento:</span>
                    <span className="font-extrabold text-[#6B1D2F]">{selectedDelegation.complianceStatus}</span>
                  </div>
                </div>
              </div>

              {/* Institutional Broadcast Manager */}
              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-3">
                <h3 className="font-extrabold text-sm text-[#6B1D2F] flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4" /> Canal Institucional de Difusión Nacional
                </h3>
                <p className="text-xs text-[#1c1917]/70">
                  Publica comunicados, convocatorias urgentes y avisos de comités para todos los residentes y docentes IMSS.
                </p>

                <form onSubmit={handleSendAnnouncement} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                      placeholder="Título del comunicado (ej: Convocatoria FIS 2026)"
                      className="w-full p-2.5 rounded-xl border border-[#6B1D2F]/30 bg-white text-xs outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows={3}
                      value={announcementMessage}
                      onChange={(e) => setAnnouncementMessage(e.target.value)}
                      placeholder="Mensaje oficial para enviar notificación asíncrona..."
                      className="w-full p-2.5 rounded-xl border border-[#6B1D2F]/30 bg-white text-xs outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                    />
                  </div>

                  {publishedAlert && (
                    <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900">
                      {publishedAlert}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#6B1D2F] text-white font-bold text-xs rounded-xl hover:bg-[#4A1320] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Difundir a Nivel Nacional</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PESTAÑA ADMINISTRADORES Y GESTIÓN DE PERMISOS */}
      {/* ========================================================================= */}
      {activeTab === 'administrators' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Admin KPI Header Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B1D2F]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/70">Administradores Activos</span>
                <ShieldCheck className="w-4 h-4 text-[#6B1D2F]" />
              </div>
              <div className="text-2xl font-black text-[#6B1D2F]">
                {administrators.length}
              </div>
              <div className="text-[11px] text-[#6B1D2F]/80 font-semibold">
                Directivos y Tutores con rol de gestión
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B1D2F]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/70">Gestión de Usuarios</span>
                <Users className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl font-black text-emerald-800">
                {administrators.filter((a) => a.permissions?.canManageUsers).length}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                Habilitados para dar altas y bajas
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B1D2F]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/70">Emisión de Dictámenes</span>
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-2xl font-black text-blue-800">
                {administrators.filter((a) => a.permissions?.canEvaluateProtocols).length}
              </div>
              <div className="text-[11px] text-blue-700 font-semibold">
                Evaluadores bioéticos autorizados
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B1D2F]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/70">Gobernanza RBAC</span>
                <KeyRound className="w-4 h-4 text-purple-700" />
              </div>
              <div className="text-2xl font-black text-purple-900">
                100% Auditado
              </div>
              <div className="text-[11px] text-purple-800 font-semibold">
                Trazabilidad por matrícula IMSS
              </div>
            </div>
          </div>

          {/* Quick Access Action Card to User Management Module */}
          <div className="bg-gradient-to-r from-[#FAF8F5] to-white rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F] text-[11px] font-bold uppercase">
                <Lock className="w-3 h-3" /> Acceso Restringido a Administradores
              </div>
              <h2 className="text-lg font-black text-[#6B1D2F]">
                Módulo Central de Administración de Usuarios (Padrón de Residentes, Tutores y Directivos)
              </h2>
              <p className="text-xs text-[#1c1917]/70 max-w-2xl">
                Este módulo solo está visible y disponible para usuarios con permisos administrativos activos. Permite la creación, edición, vinculación de tutores y gestión de bajas en tiempo real.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsGrantModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#F3EFE6] hover:bg-[#E6DFD3] text-[#6B1D2F] border border-[#6B1D2F]/30 transition-all shadow-xs cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Otorgar Permisos a Usuario</span>
              </button>

              {onNavigateView && (
                <button
                  onClick={() => onNavigateView('admin_users')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#6B1D2F] hover:bg-[#4A1320] text-white transition-all shadow-xs cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Abrir Administración de Usuarios</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </button>
              )}
            </div>
          </div>

          {/* Administrators Table & Live Permission Matrix */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#6B1D2F]/20 shadow-xs overflow-hidden">
            <div className="p-4 md:p-5 border-b border-[#6B1D2F]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#6B1D2F] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#6B1D2F]" />
                  <span>Matriz de Administradores y Asignación de Permisos</span>
                </h3>
                <p className="text-xs text-[#1c1917]/70 mt-0.5">
                  Modifica los permisos granulares en tiempo real. Los cambios se guardan y auditan inmediatamente en la base de datos.
                </p>
              </div>

              {/* Search filter */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#1c1917]/40" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Buscar administrador o matrícula..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#6B1D2F]/20 text-xs outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F3EFE6] text-[#6B1D2F] font-extrabold uppercase text-[10px] tracking-wider border-b border-[#6B1D2F]/20">
                    <th className="py-3 px-4">Administrador / Matrícula</th>
                    <th className="py-3 px-3">Rol & Unidad Hospitalaria</th>
                    <th className="py-3 px-2 text-center" title="Permite dar de alta, editar y gestionar residentes y tutores">
                      Gestión Usuarios
                    </th>
                    <th className="py-3 px-2 text-center" title="Permite dictaminar protocolos y emitir dictámenes">
                      Dictámenes Bioéticos
                    </th>
                    <th className="py-3 px-2 text-center" title="Permite enviar alertas y comunicados nacionales">
                      Difusión Nacional
                    </th>
                    <th className="py-3 px-2 text-center" title="Permite asignar o reasignar tutores a residentes">
                      Asignar Tutores
                    </th>
                    <th className="py-3 px-2 text-center" title="Permite exportar respaldos SQL y JSON">
                      Respaldos / DDL
                    </th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B1D2F]/10">
                  {filteredAdmins.map((admin) => {
                    const isDirectivo = admin.role === 'DIRECTIVO';
                    const perms = admin.permissions || {
                      canManageUsers: false,
                      canEvaluateProtocols: false,
                      canPublishAnnouncements: false,
                      canAssignTutors: false,
                      canExportData: false,
                    };

                    return (
                      <tr key={admin.id} className="hover:bg-white/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                              style={{ backgroundColor: admin.avatarColor || '#6B1D2F' }}
                            >
                              {admin.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <div>
                              <div className="font-extrabold text-[#1c1917] flex items-center gap-1.5">
                                <span>{admin.fullName}</span>
                                {isDirectivo && (
                                  <span className="text-[9px] bg-[#6B1D2F] text-white px-1.5 py-0.2 rounded font-black">
                                    DIRECTIVO
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#1c1917]/60 font-mono">
                                Matrícula: <strong>{admin.matricula}</strong> • {admin.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-[#6B1D2F]">
                            {admin.positionTitle || admin.academicDegree || admin.role}
                          </div>
                          <div className="text-[11px] text-[#1c1917]/70 truncate max-w-[200px]" title={admin.hospitalUnit}>
                            {admin.hospitalUnit} ({admin.delegation})
                          </div>
                        </td>

                        {/* Switch: canManageUsers */}
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleTogglePermission(admin.id, 'canManageUsers', !!perms.canManageUsers)}
                            title={`Click para ${perms.canManageUsers ? 'revocar' : 'otorgar'} Gestión de Usuarios`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                              perms.canManageUsers
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                            }`}
                          >
                            {perms.canManageUsers ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* Switch: canEvaluateProtocols */}
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleTogglePermission(admin.id, 'canEvaluateProtocols', !!perms.canEvaluateProtocols)}
                            title={`Click para ${perms.canEvaluateProtocols ? 'revocar' : 'otorgar'} Evaluación de Protocolos`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                              perms.canEvaluateProtocols
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                            }`}
                          >
                            {perms.canEvaluateProtocols ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* Switch: canPublishAnnouncements */}
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleTogglePermission(admin.id, 'canPublishAnnouncements', !!perms.canPublishAnnouncements)}
                            title={`Click para ${perms.canPublishAnnouncements ? 'revocar' : 'otorgar'} Difusión`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                              perms.canPublishAnnouncements
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                            }`}
                          >
                            {perms.canPublishAnnouncements ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* Switch: canAssignTutors */}
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleTogglePermission(admin.id, 'canAssignTutors', !!perms.canAssignTutors)}
                            title={`Click para ${perms.canAssignTutors ? 'revocar' : 'otorgar'} Asignación de Tutores`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                              perms.canAssignTutors
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                            }`}
                          >
                            {perms.canAssignTutors ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* Switch: canExportData */}
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleTogglePermission(admin.id, 'canExportData', !!perms.canExportData)}
                            title={`Click para ${perms.canExportData ? 'revocar' : 'otorgar'} Exportación DDL`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                              perms.canExportData
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                            }`}
                          >
                            {perms.canExportData ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          {!isDirectivo ? (
                            <button
                              onClick={() => handleRevokeAdmin(admin)}
                              className="px-2.5 py-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                            >
                              Revocar Admin
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-[#6B1D2F]/60 uppercase tracking-wider">
                              Titular
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAdmins.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-xs text-[#1c1917]/60">
                        No se encontraron administradores con los criterios de búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Log / Bitácora de Permisos */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#6B1D2F]/15 pb-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#6B1D2F]" />
                <h3 className="font-extrabold text-sm text-[#6B1D2F]">
                  Bitácora de Auditoría de Permisos y Gobernanza Institucional
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#1c1917]/60">
                Últimos eventos registrados en tiempo real
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-white border border-[#6B1D2F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#6B1D2F]/10 text-[#6B1D2F] font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                        {log.action}
                      </span>
                      <span className="font-extrabold text-[#1c1917]">{log.targetUserName}</span>
                    </div>
                    <p className="text-[11px] text-[#1c1917]/70">{log.details}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-bold text-[#6B1D2F]">Por: {log.adminName}</div>
                    <div className="text-[10px] text-[#1c1917]/50 font-mono">{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OTORGAR PERMISOS DE ADMINISTRADOR */}
      {/* ========================================================================= */}
      {isGrantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full border border-[#6B1D2F]/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-[#6B1D2F] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5" />
                <div>
                  <h3 className="font-extrabold text-base">Otorgar Permisos de Administrador</h3>
                  <p className="text-[11px] text-white/80">
                    Eleva a un Docente o Directivo para gestionar usuarios y dictaminar protocolos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGrantModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleGrantAdminSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-[#6B1D2F] mb-1">
                  Selecciona al Usuario / Docente / Directivo *:
                </label>
                <select
                  required
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#6B1D2F]/30 bg-white font-medium outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                >
                  <option value="">-- Seleccionar candidato --</option>
                  {candidateUsers.map((cand) => (
                    <option key={cand.id} value={cand.id}>
                      {cand.fullName} ({cand.matricula}) - {cand.role} - {cand.delegation}
                    </option>
                  ))}
                </select>
              </div>

              {/* Permissions checkboxes */}
              <div className="bg-white p-4 rounded-2xl border border-[#6B1D2F]/15 space-y-3">
                <span className="font-extrabold text-[#6B1D2F] uppercase text-[10px] tracking-wider block">
                  Configuración de Permisos Asignados:
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customPermissions.canManageUsers}
                    onChange={(e) =>
                      setCustomPermissions((p) => ({ ...p, canManageUsers: e.target.checked }))
                    }
                    className="mt-0.5 rounded text-[#6B1D2F] focus:ring-[#6B1D2F]"
                  />
                  <div>
                    <span className="font-bold text-[#1c1917] block">Administración de Usuarios y Padrón</span>
                    <span className="text-[11px] text-[#1c1917]/70">
                      Permite ver y gestionar altas, bajas y cambios en el padrón de residentes y tutores.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customPermissions.canEvaluateProtocols}
                    onChange={(e) =>
                      setCustomPermissions((p) => ({ ...p, canEvaluateProtocols: e.target.checked }))
                    }
                    className="mt-0.5 rounded text-[#6B1D2F] focus:ring-[#6B1D2F]"
                  />
                  <div>
                    <span className="font-bold text-[#1c1917] block">Dictaminación y Evaluación Bioética</span>
                    <span className="text-[11px] text-[#1c1917]/70">
                      Permite calificar y emitir dictámenes aprobatorios o de cambio a protocolos R1-R3.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customPermissions.canPublishAnnouncements}
                    onChange={(e) =>
                      setCustomPermissions((p) => ({ ...p, canPublishAnnouncements: e.target.checked }))
                    }
                    className="mt-0.5 rounded text-[#6B1D2F] focus:ring-[#6B1D2F]"
                  />
                  <div>
                    <span className="font-bold text-[#1c1917] block">Difusión de Comunicados Institucionales</span>
                    <span className="text-[11px] text-[#1c1917]/70">
                      Habilita la publicación de avisos masivos a nivel nacional.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customPermissions.canAssignTutors}
                    onChange={(e) =>
                      setCustomPermissions((p) => ({ ...p, canAssignTutors: e.target.checked }))
                    }
                    className="mt-0.5 rounded text-[#6B1D2F] focus:ring-[#6B1D2F]"
                  />
                  <div>
                    <span className="font-bold text-[#1c1917] block">Asignación y Reasignación de Tutores</span>
                    <span className="text-[11px] text-[#1c1917]/70">
                      Permite vincular o cambiar el tutor asignado a cada médico residente.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customPermissions.canExportData}
                    onChange={(e) =>
                      setCustomPermissions((p) => ({ ...p, canExportData: e.target.checked }))
                    }
                    className="mt-0.5 rounded text-[#6B1D2F] focus:ring-[#6B1D2F]"
                  />
                  <div>
                    <span className="font-bold text-[#1c1917] block">Descarga de Respaldos y SQL DDL</span>
                    <span className="text-[11px] text-[#1c1917]/70">
                      Acceso para descargar volcados de base de datos y esquemas relacionales.
                    </span>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsGrantModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#1c1917]/70 hover:bg-black/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!selectedCandidateId}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#6B1D2F] text-white hover:bg-[#4A1320] disabled:opacity-50 transition-colors shadow-xs"
                >
                  Confirmar y Otorgar Permisos
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
