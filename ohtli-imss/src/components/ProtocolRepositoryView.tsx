import React, { useState, useMemo } from 'react';
import {
  FolderGit2,
  FileText,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  Download,
  Eye,
  Plus,
  Trash2,
  UserCheck,
  Building2,
  MapPin,
  Tag,
  Sparkles,
  FileSpreadsheet,
  FileCode2,
  X,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { ProtocolDocument, UserRole, ResidencyYear, UserAccount } from '../types/ohtli';
import { DatabaseService } from '../services/databaseService';

interface ProtocolRepositoryViewProps {
  currentUserRole: UserRole;
  currentUserId?: string;
}

export const ProtocolRepositoryView: React.FC<ProtocolRepositoryViewProps> = ({
  currentUserRole,
}) => {
  const [protocols, setProtocols] = useState<ProtocolDocument[]>(() => DatabaseService.getProtocols());
  const [users] = useState<UserAccount[]>(() => DatabaseService.getUsers());
  
  // Filter States
  const [selectedPhase, setSelectedPhase] = useState<'ALL' | 'R1_PROTOCOLO' | 'R2_DATABASE' | 'R3_TESIS_ARTICULO'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProtocolDetail, setSelectedProtocolDetail] = useState<ProtocolDocument | null>(null);
  const [isEvaluationMode, setIsEvaluationMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Upload
  const residentsList = useMemo(() => users.filter((u) => u.role === 'RESIDENTE'), [users]);
  const tutorsList = useMemo(() => users.filter((u) => u.role === 'DOCENTE'), [users]);

  const [formResidentId, setFormResidentId] = useState(residentsList[0]?.id || '');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ProtocolDocument['category']>('Protocolo de Investigación');
  const [formPhase, setFormPhase] = useState<ProtocolDocument['phase']>('R1_PROTOCOLO');
  const [formResearchLine, setFormResearchLine] = useState('');
  const [formAbstract, setFormAbstract] = useState('');
  const [formSirelcisFolio, setFormSirelcisFolio] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formFileType, setFormFileType] = useState<ProtocolDocument['fileType']>('pdf');
  const [formFileSizeKb, setFormFileSizeKb] = useState<number>(2450);
  const [formVersion, setFormVersion] = useState('1.0');
  const [formTags, setFormTags] = useState('');

  // Evaluation Form State
  const [evalStatus, setEvalStatus] = useState<ProtocolDocument['status']>('Aprobado');
  const [evalScore, setEvalScore] = useState<number>(95);
  const [evalComments, setEvalComments] = useState('');
  const [evaluatorName, setEvaluatorName] = useState('Dra. Carmen Valdés Ochoa (CINV)');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = protocols.length;
    const approved = protocols.filter((p) => p.status.startsWith('Aprobado')).length;
    const inReview = protocols.filter((p) => p.status === 'Enviado a Revisión' || p.status === 'En Dictamen').length;
    const changesRequired = protocols.filter((p) => p.status === 'Requiere Cambios').length;

    const r1Protocols = protocols.filter((p) => p.phase === 'R1_PROTOCOLO').length;
    const r2Databases = protocols.filter((p) => p.phase === 'R2_DATABASE').length;
    const r3Thesis = protocols.filter((p) => p.phase === 'R3_TESIS_ARTICULO').length;

    return {
      total,
      approved,
      inReview,
      changesRequired,
      r1Protocols,
      r2Databases,
      r3Thesis,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    };
  }, [protocols]);

  // Filtered Protocols
  const filteredProtocols = useMemo(() => {
    return protocols.filter((p) => {
      if (selectedPhase !== 'ALL' && p.phase !== selectedPhase) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchResident = p.residentName.toLowerCase().includes(q);
        const matchMatricula = p.residentMatricula.toLowerCase().includes(q);
        const matchFolio = p.sirelcisFolio?.toLowerCase().includes(q) || false;
        const matchSpecialty = p.specialty.toLowerCase().includes(q);
        const matchHospital = p.hospitalUnit.toLowerCase().includes(q);
        const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchResident || matchMatricula || matchFolio || matchSpecialty || matchHospital || matchTags;
      }

      return true;
    });
  }, [protocols, selectedPhase, selectedStatus, searchQuery]);

  const handleOpenUploadModal = () => {
    const firstResident = residentsList[0];
    setFormResidentId(firstResident?.id || '');
    setFormTitle('');
    setFormCategory('Protocolo de Investigación');
    setFormPhase('R1_PROTOCOLO');
    setFormResearchLine('Enfermedades Cardiometabólicas y Epidemiología Clínica');
    setFormAbstract('');
    setFormSirelcisFolio(`R-2026-3501-${Math.floor(100 + Math.random() * 900)}`);
    setFormFileName('Protocolo_Investigacion_IMSS_2026.pdf');
    setFormFileType('pdf');
    setFormFileSizeKb(2540);
    setFormVersion('1.0');
    setFormTags('IMSS, Residencia Médica, Protocolo');
    setIsUploadModalOpen(true);
  };

  const handleFileSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormFileName(file.name);
      setFormFileSizeKb(Math.round(file.size / 1024));
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') setFormFileType('pdf');
      else if (ext === 'docx' || ext === 'doc') setFormFileType('docx');
      else if (ext === 'xlsx' || ext === 'csv') setFormFileType('xlsx');
      else setFormFileType('zip');
    }
  };

  const handleSaveProtocol = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formAbstract.trim()) {
      showToast('Por favor completa el título y resumen estructurado del protocolo.');
      return;
    }

    const resident = residentsList.find((r) => r.id === formResidentId) || residentsList[0];
    const tutor = tutorsList.find((t) => t.id === resident?.assignedTutorId) || tutorsList[0];

    const newProtocol = DatabaseService.addProtocol({
      title: formTitle.trim(),
      residentId: resident?.id || 'usr_res_temp',
      residentName: resident?.fullName || 'Dr. Residente IMSS',
      residentMatricula: resident?.matricula || '99000000',
      residentYear: resident?.residencyYear || 'R1',
      hospitalUnit: resident?.hospitalUnit || 'HGZ No. 1 A Tlaltelolco',
      delegation: resident?.delegation || 'CDMX Norte',
      specialty: resident?.specialty || 'Medicina Interna',
      tutorId: tutor?.id,
      tutorName: tutor?.fullName || 'Dra. Carmen Valdés Ochoa',
      category: formCategory,
      phase: formPhase,
      researchLine: formResearchLine.trim(),
      abstract: formAbstract.trim(),
      sirelcisFolio: formSirelcisFolio.trim(),
      status: 'Enviado a Revisión',
      fileName: formFileName.trim() || 'Documento_Protocolo.pdf',
      fileSizeKb: formFileSizeKb,
      fileType: formFileType,
      version: formVersion.trim() || '1.0',
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setProtocols(DatabaseService.getProtocols());
    setIsUploadModalOpen(false);
    showToast(`Protocolo "${newProtocol.title.slice(0, 40)}..." subido exitosamente.`);
  };

  const handleOpenDetail = (protocol: ProtocolDocument) => {
    setSelectedProtocolDetail(protocol);
    setIsEvaluationMode(false);
    setEvalStatus(protocol.status);
    setEvalScore(protocol.score || 90);
    setEvalComments(protocol.evaluatorComments || '');
    setEvaluatorName(protocol.evaluatorName || 'Dra. Carmen Valdés Ochoa (CINV)');
  };

  const handleSaveEvaluation = () => {
    if (!selectedProtocolDetail) return;

    const updated = DatabaseService.evaluateProtocol(
      selectedProtocolDetail.id,
      evalStatus,
      evalScore,
      evalComments,
      evaluatorName
    );

    if (updated) {
      setProtocols(DatabaseService.getProtocols());
      setSelectedProtocolDetail(updated);
      setIsEvaluationMode(false);
      showToast('Dictamen y evaluación bioética guardados con éxito.');
    }
  };

  const handleDeleteProtocol = (protocol: ProtocolDocument) => {
    if (window.confirm(`¿Deseas eliminar el protocolo "${protocol.title}" del repositorio?`)) {
      DatabaseService.deleteProtocol(protocol.id);
      setProtocols(DatabaseService.getProtocols());
      setSelectedProtocolDetail(null);
      showToast('Protocolo eliminado del repositorio.');
    }
  };

  const handleDownloadFile = (protocol: ProtocolDocument) => {
    // Simulated institutional protocol download
    const sampleContent = `
INSTITUTO MEXICANO DEL SEGURO SOCIAL
COORDINACIÓN DE EDUCACIÓN E INVESTIGACIÓN EN SALUD (CIS)
REPOSITORIO INSTITUCIONAL OHTLI 2.0

Título: ${protocol.title}
Folio SIRELCIS: ${protocol.sirelcisFolio || 'N/A'}
Autor: ${protocol.residentName} (Matrícula: ${protocol.residentMatricula}, Año: ${protocol.residentYear})
Especialidad: ${protocol.specialty}
Unidad Médica: ${protocol.hospitalUnit} (${protocol.delegation})
Tutor de Tesis: ${protocol.tutorName || 'Sin asignar'}
Fase: ${protocol.phase}
Categoría: ${protocol.category}
Versión: ${protocol.version}
Estatus: ${protocol.status} (Calificación: ${protocol.score || 'Pendiente'}/100)

RESUMEN / ABSTRACT ESTRUCTURADO:
${protocol.abstract}

DICTAMEN Y OBSERVACIONES DEL EVALUADOR:
${protocol.evaluatorComments || 'Sin comentarios registrados aún.'}

Dictaminado por: ${protocol.evaluatorName || 'N/A'}
Fecha de emisión: ${protocol.evaluatedAt || protocol.uploadDate}
============================================================
Documento emitido mediante el Repositorio Digital Ohtli 2.0 (2026).
    `.trim();

    const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${protocol.fileName.replace(/\.[^/.]+$/, '')}_Dictamen.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Descargando archivo: ${protocol.fileName}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border bg-[#6B1D2F] text-white border-[#C5A059] flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#6B1D2F]/20 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#6B1D2F] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Repositorio Digital IMSS
              </span>
              <span className="text-xs font-bold text-[#6B1D2F] flex items-center gap-1">
                <FolderGit2 className="w-3.5 h-3.5" /> Protocolos, REDCap & Tesis R1-R3
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#6B1D2F] tracking-tight mt-1">
              Repositorio Institucional de Protocolos de Investigación
            </h1>
            <p className="text-xs text-[#1c1917]/80 mt-1 max-w-3xl">
              Carga, consulta, revisión metodológica y dictámenes de los protocolos de los médicos residentes (R1 Protocolo, R2 Bases de Datos, R3 Tesis/Artículos).
            </p>
          </div>

          {/* Upload Button */}
          <div>
            <button
              onClick={handleOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#6B1D2F] text-white hover:bg-[#831843] transition-all shadow-xs cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Nuevo Protocolo</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-[#6B1D2F]">Total en Repositorio</span>
            <FileText className="w-4 h-4 text-[#6B1D2F]" />
          </div>
          <div className="text-2xl font-black text-[#1c1917] mt-1">{metrics.total}</div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1c1917]/70 mt-1">
            <span className="bg-[#6B1D2F]/10 text-[#6B1D2F] px-1.5 py-0.5 rounded">R1: {metrics.r1Protocols}</span>
            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">R2: {metrics.r2Databases}</span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">R3: {metrics.r3Thesis}</span>
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-emerald-800">Aprobados / Dictaminados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{metrics.approved}</div>
          <div className="text-[10px] font-bold text-emerald-700 mt-1">
            {metrics.approvalRate}% Tasa de Aprobación
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-amber-800">En Dictamen / Revisión</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800 mt-1">{metrics.inReview}</div>
          <div className="text-[10px] font-medium text-stone-600 mt-1">
            Comités de Ética e Investigación
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-rose-800">Requieren Cambios</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-800 mt-1">{metrics.changesRequired}</div>
          <div className="text-[10px] font-medium text-stone-600 mt-1">
            Con observaciones de tutor
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#6B1D2F]/20 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, autor, folio SIRELCIS, hospital..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#6B1D2F]/20 bg-white text-[#1c1917] placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
          />
        </div>

        {/* Phase Buttons */}
        <div className="flex flex-wrap items-center gap-1 w-full md:w-auto">
          <button
            onClick={() => setSelectedPhase('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedPhase === 'ALL'
                ? 'bg-[#6B1D2F] text-white'
                : 'bg-white text-[#1c1917] border border-[#6B1D2F]/20 hover:bg-[#6B1D2F]/10'
            }`}
          >
            Todas las Fases ({protocols.length})
          </button>
          <button
            onClick={() => setSelectedPhase('R1_PROTOCOLO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedPhase === 'R1_PROTOCOLO'
                ? 'bg-[#6B1D2F] text-white'
                : 'bg-white text-[#6B1D2F] border border-[#6B1D2F]/20 hover:bg-[#6B1D2F]/10'
            }`}
          >
            R1: Protocolos
          </button>
          <button
            onClick={() => setSelectedPhase('R2_DATABASE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedPhase === 'R2_DATABASE'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            R2: Bases REDCap
          </button>
          <button
            onClick={() => setSelectedPhase('R3_TESIS_ARTICULO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedPhase === 'R3_TESIS_ARTICULO'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            R3: Tesis / Artículos
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#6B1D2F]" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs py-1.5 px-2 rounded-lg border border-[#6B1D2F]/20 bg-white text-[#1c1917] font-medium"
          >
            <option value="ALL">Todos los Estatus</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Aprobado con Mención">Aprobado con Mención</option>
            <option value="Enviado a Revisión">Enviado a Revisión</option>
            <option value="En Dictamen">En Dictamen</option>
            <option value="Requiere Cambios">Requiere Cambios</option>
          </select>
        </div>
      </div>

      {/* Protocols List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProtocols.length === 0 ? (
          <div className="col-span-2 bg-[#FAF8F5] p-10 rounded-2xl border border-[#6B1D2F]/20 text-center text-stone-500 font-medium">
            No se encontraron protocolos con los criterios de búsqueda.
          </div>
        ) : (
          filteredProtocols.map((proto) => {
            const isApproved = proto.status.startsWith('Aprobado');
            const isReview = proto.status === 'Enviado a Revisión' || proto.status === 'En Dictamen';
            const isChanges = proto.status === 'Requiere Cambios';

            return (
              <div
                key={proto.id}
                className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs hover:border-[#6B1D2F]/50 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          proto.phase === 'R1_PROTOCOLO'
                            ? 'bg-[#6B1D2F]/10 text-[#6B1D2F]'
                            : proto.phase === 'R2_DATABASE'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {proto.phase === 'R1_PROTOCOLO' ? 'R1 Protocolo' : proto.phase === 'R2_DATABASE' ? 'R2 Base de Datos' : 'R3 Tesis'}
                      </span>

                      {proto.sirelcisFolio && (
                        <span className="text-[10px] font-mono bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-bold">
                          Folio: {proto.sirelcisFolio}
                        </span>
                      )}

                      <span className="text-[10px] font-bold text-stone-500">v{proto.version}</span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isReview
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}
                    >
                      {proto.status} {proto.score ? `(${proto.score} pts)` : ''}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-[#1c1917] text-sm line-clamp-2 hover:text-[#6B1D2F] cursor-pointer" onClick={() => handleOpenDetail(proto)}>
                    {proto.title}
                  </h3>

                  {/* Abstract Preview */}
                  <p className="text-xs text-[#1c1917]/75 line-clamp-2">
                    {proto.abstract}
                  </p>
                </div>

                {/* Author, Hospital & Tutor Metadata */}
                <div className="pt-3 border-t border-[#6B1D2F]/10 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#1c1917] flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#6B1D2F] text-white flex items-center justify-center text-[10px] font-bold">
                        {proto.residentYear}
                      </div>
                      <span>{proto.residentName}</span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">Matr: {proto.residentMatricula}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{proto.hospitalUnit} • {proto.specialty}</span>
                  </div>

                  {proto.tutorName && (
                    <div className="flex items-center gap-1 text-[11px] text-blue-900 font-medium">
                      <UserCheck className="w-3 h-3 text-blue-700 shrink-0" />
                      <span>Tutor: {proto.tutorName}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {proto.tags && proto.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proto.tags.map((t, idx) => (
                        <span key={idx} className="bg-stone-100 text-stone-600 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-[#6B1D2F]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                    {proto.fileType === 'pdf' ? (
                      <FileText className="w-3.5 h-3.5 text-red-700" />
                    ) : proto.fileType === 'xlsx' ? (
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <FileCode2 className="w-3.5 h-3.5 text-blue-700" />
                    )}
                    <span>{proto.fileName}</span>
                    <span className="text-[10px] text-stone-400">({proto.fileSizeKb} KB)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownloadFile(proto)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-[#6B1D2F] hover:bg-[#6B1D2F]/10 transition-colors"
                      title="Descargar documento / Dictamen"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDetail(proto)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#6B1D2F]/10 text-[#6B1D2F] hover:bg-[#6B1D2F] hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detalles & Dictamen</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: SUBIR NUEVO PROTOCOLO */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#6B1D2F]/30 shadow-2xl max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#6B1D2F]/20 pb-3">
              <div>
                <span className="bg-[#6B1D2F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Carga de Entregables
                </span>
                <h3 className="text-lg font-black text-[#6B1D2F] mt-1">
                  Subir Protocolo de Investigación o Base de Datos
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProtocol} className="space-y-4 text-xs">
              {/* Resident Selector */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Médico Residente (Autor) *</label>
                <select
                  value={formResidentId}
                  onChange={(e) => setFormResidentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-medium focus:ring-1 focus:ring-[#6B1D2F]"
                >
                  {residentsList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fullName} ({r.residencyYear} - {r.specialty} • {r.hospitalUnit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Título Completo del Protocolo o Tesis *</label>
                <textarea
                  rows={2}
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej. Eficacia de la Terapia Dual en Pacientes con Falla Cardíaca en el HGZ..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-[#6B1D2F]"
                />
              </div>

              {/* Category, Phase & Folio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Fase del Residente *</label>
                  <select
                    value={formPhase}
                    onChange={(e) => setFormPhase(e.target.value as ProtocolDocument['phase'])}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-bold text-[#6B1D2F]"
                  >
                    <option value="R1_PROTOCOLO">R1: Protocolo de Investigación</option>
                    <option value="R2_DATABASE">R2: Base de Datos REDCap / Excel</option>
                    <option value="R3_TESIS_ARTICULO">R3: Tesis / Artículo Científico</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Categoría del Entregable</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProtocolDocument['category'])}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-medium"
                  >
                    <option value="Protocolo de Investigación">Protocolo de Investigación</option>
                    <option value="Base de Datos REDCap/Excel">Base de Datos REDCap/Excel</option>
                    <option value="Tesis de Residencia">Tesis de Residencia</option>
                    <option value="Artículo Científico">Artículo Científico</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Folio SIRELCIS / CAMIS</label>
                  <input
                    type="text"
                    value={formSirelcisFolio}
                    onChange={(e) => setFormSirelcisFolio(e.target.value)}
                    placeholder="R-2026-3501-..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Research Line */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Línea de Investigación IMSS *</label>
                <input
                  type="text"
                  required
                  value={formResearchLine}
                  onChange={(e) => setFormResearchLine(e.target.value)}
                  placeholder="Ej. Enfermedades Cardiometabólicas, Trasplantes, Salud Materno Infantil..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>

              {/* Abstract */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Resumen Estructurado (Hipótesis, Objetivo, Metodología) *</label>
                <textarea
                  rows={3}
                  required
                  value={formAbstract}
                  onChange={(e) => setFormAbstract(e.target.value)}
                  placeholder="Describe brevemente el planteamiento del problema, criterios de inclusión y análisis bioestadístico planeado..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-[#6B1D2F]"
                />
              </div>

              {/* File Attachment Dropzone */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Archivo del Protocolo / Documento *</label>
                <div className="border-2 border-dashed border-[#6B1D2F]/30 rounded-xl p-4 bg-white text-center space-y-2">
                  <Upload className="w-6 h-6 text-[#6B1D2F] mx-auto" />
                  <div className="text-xs text-stone-600">
                    Arrastra tu archivo aquí o haz clic para seleccionarlo
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.xlsx,.csv,.zip"
                    onChange={handleFileSelectionChange}
                    className="block w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#6B1D2F] file:text-white hover:file:bg-[#831843] cursor-pointer"
                  />
                  {formFileName && (
                    <div className="text-[11px] font-mono text-[#6B1D2F] font-bold">
                      Archivo cargado: {formFileName} ({formFileSizeKb} KB)
                    </div>
                  )}
                </div>
              </div>

              {/* Tags & Version */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Palabras Clave (Separadas por comas)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Cardiología, Ensayo Clínico, Cohorte"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Versión</label>
                  <input
                    type="text"
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    placeholder="1.0"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-700 font-bold hover:bg-stone-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6B1D2F] text-white font-bold hover:bg-[#831843] transition-all shadow-xs"
                >
                  Guardar en Repositorio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETALLES & DICTAMEN */}
      {selectedProtocolDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#6B1D2F]/30 shadow-2xl max-w-3xl w-full p-6 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-[#6B1D2F]/20 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#6B1D2F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    {selectedProtocolDetail.phase}
                  </span>
                  {selectedProtocolDetail.sirelcisFolio && (
                    <span className="bg-stone-200 text-stone-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      SIRELCIS: {selectedProtocolDetail.sirelcisFolio}
                    </span>
                  )}
                  <span className="text-[10px] text-stone-500 font-bold">v{selectedProtocolDetail.version}</span>
                </div>
                <h3 className="text-base md:text-lg font-black text-[#6B1D2F] mt-1.5">
                  {selectedProtocolDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProtocolDetail(null)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Protocol Meta Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 font-bold text-[10px] uppercase">Médico Residente</span>
                <div className="font-extrabold text-[#1c1917] mt-0.5">{selectedProtocolDetail.residentName}</div>
                <div className="text-[10px] text-stone-500 font-mono">Matr: {selectedProtocolDetail.residentMatricula} ({selectedProtocolDetail.residentYear})</div>
              </div>

              <div>
                <span className="text-stone-400 font-bold text-[10px] uppercase">Especialidad & Sede</span>
                <div className="font-semibold text-[#1c1917] mt-0.5">{selectedProtocolDetail.specialty}</div>
                <div className="text-[10px] text-stone-500">{selectedProtocolDetail.hospitalUnit}</div>
              </div>

              <div>
                <span className="text-stone-400 font-bold text-[10px] uppercase">Tutor Asignado</span>
                <div className="font-semibold text-blue-900 mt-0.5">{selectedProtocolDetail.tutorName || 'Sin asignar'}</div>
                <div className="text-[10px] text-stone-500">{selectedProtocolDetail.delegation}</div>
              </div>

              <div>
                <span className="text-stone-400 font-bold text-[10px] uppercase">Estatus Dictamen</span>
                <div className="font-black text-[#6B1D2F] mt-0.5">{selectedProtocolDetail.status}</div>
                <div className="text-[10px] text-emerald-700 font-bold">
                  {selectedProtocolDetail.score ? `${selectedProtocolDetail.score} / 100 pts` : 'Pendiente calificación'}
                </div>
              </div>
            </div>

            {/* Abstract Section */}
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-xs text-[#6B1D2F] uppercase">Resumen Metodológico & Planteamiento</h4>
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed max-h-40 overflow-y-auto">
                {selectedProtocolDetail.abstract}
              </div>
            </div>

            {/* Document details & Download */}
            <div className="flex items-center justify-between p-3 bg-stone-100 rounded-xl border border-stone-300 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6B1D2F]" />
                <div>
                  <span className="font-bold text-[#1c1917]">{selectedProtocolDetail.fileName}</span>
                  <span className="text-stone-500 ml-2">({selectedProtocolDetail.fileSizeKb} KB • Subido: {selectedProtocolDetail.uploadDate})</span>
                </div>
              </div>

              <button
                onClick={() => handleDownloadFile(selectedProtocolDetail)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6B1D2F] text-white font-bold text-xs hover:bg-[#831843] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Archivo</span>
              </button>
            </div>

            {/* Dictamen & Evaluation Section */}
            <div className="border-t border-[#6B1D2F]/20 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-[#6B1D2F] uppercase flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" /> Dictamen del Comité y Retroalimentación del Tutor
                </h4>
                <button
                  onClick={() => setIsEvaluationMode(!isEvaluationMode)}
                  className="text-xs font-bold text-[#6B1D2F] hover:underline"
                >
                  {isEvaluationMode ? 'Cancelar Edición' : 'Editar Dictamen / Calificar'}
                </button>
              </div>

              {!isEvaluationMode ? (
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-600">
                    <div>
                      <strong>Evaluador:</strong> {selectedProtocolDetail.evaluatorName || 'Comité de Investigación'}
                    </div>
                    {selectedProtocolDetail.evaluatedAt && (
                      <div>
                        <strong>Fecha de Dictamen:</strong> {selectedProtocolDetail.evaluatedAt}
                      </div>
                    )}
                  </div>
                  <div className="text-stone-700 italic">
                    "{selectedProtocolDetail.evaluatorComments || 'No hay comentarios u observaciones registradas para este protocolo.'}"
                  </div>
                </div>
              ) : (
                /* Evaluation Form */
                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Estatus del Dictamen</label>
                      <select
                        value={evalStatus}
                        onChange={(e) => setEvalStatus(e.target.value as ProtocolDocument['status'])}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-bold text-[#6B1D2F]"
                      >
                        <option value="Aprobado con Mención">Aprobado con Mención</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="En Dictamen">En Dictamen</option>
                        <option value="Enviado a Revisión">Enviado a Revisión</option>
                        <option value="Requiere Cambios">Requiere Cambios</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Puntaje / Calificación (0 - 100)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={evalScore}
                        onChange={(e) => setEvalScore(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-bold text-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Nombre del Evaluador / Comité</label>
                      <input
                        type="text"
                        value={evaluatorName}
                        onChange={(e) => setEvaluatorName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Observaciones Metodológicas y Dictamen Bioético</label>
                    <textarea
                      rows={3}
                      value={evalComments}
                      onChange={(e) => setEvalComments(e.target.value)}
                      placeholder="Escribe las recomendaciones de corrección, aprobación del Comité Local o puntos a solventar..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEvaluationMode(false)}
                      className="px-3 py-1.5 rounded-lg text-stone-600 font-bold hover:bg-stone-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEvaluation}
                      className="px-4 py-1.5 rounded-lg bg-[#6B1D2F] text-white font-bold hover:bg-[#831843]"
                    >
                      Guardar Dictamen
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                onClick={() => handleDeleteProtocol(selectedProtocolDetail)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 font-bold text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Protocolo</span>
              </button>

              <button
                onClick={() => setSelectedProtocolDetail(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs hover:bg-stone-300"
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
