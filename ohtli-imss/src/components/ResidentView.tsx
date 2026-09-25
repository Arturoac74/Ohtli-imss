import React, { useState } from 'react';
import {
  GamificationProfile,
  ProtocolPhase,
  TaskItem,
  EducationalCapsule,
  UmbrellaProject,
  ResidencyYear,
} from '../types/ohtli';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  ChevronRight,
  Upload,
  FileText,
  Video,
  Award,
  Link as LinkIcon,
  Bell,
  Sparkles,
  ExternalLink,
  BookOpen,
  Calendar,
  AlertCircle,
  Database,
  Search,
} from 'lucide-react';

interface ResidentViewProps {
  gamification: GamificationProfile;
  phases: ProtocolPhase[];
  educationalCapsules: EducationalCapsule[];
  umbrellaProjects: UmbrellaProject[];
  onTaskToggle: (phaseId: string, taskId: string) => void;
  onTaskSubmit: (phaseId: string, task: TaskItem, fileNotes: string) => void;
  onNavigateView: (view: any) => void;
  isOnline: boolean;
}

export const ResidentView: React.FC<ResidentViewProps> = ({
  gamification,
  phases,
  educationalCapsules,
  umbrellaProjects,
  onTaskToggle,
  onTaskSubmit,
  onNavigateView,
  isOnline,
}) => {
  const [selectedYear, setSelectedYear] = useState<ResidencyYear>('R1');
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<{
    phaseId: string;
    task: TaskItem;
  } | null>(null);
  const [fileNoteInput, setFileNoteInput] = useState('');
  const [submittedSuccessMessage, setSubmittedSuccessMessage] = useState<string | null>(null);

  const activePhase = phases.find((p) => p.year === selectedYear) || phases[0];

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForModal) return;

    onTaskSubmit(selectedTaskForModal.phaseId, selectedTaskForModal.task, fileNoteInput);
    
    const xp = selectedTaskForModal.task.xpReward;
    setSubmittedSuccessMessage(
      `¡Entregable cargado con éxito! +${xp} XP otorgados${!isOnline ? ' (En cola para sync asíncrono)' : ''}.`
    );

    setTimeout(() => {
      setSubmittedSuccessMessage(null);
      setSelectedTaskForModal(null);
      setFileNoteInput('');
    }, 2200);
  };

  return (
    <div className="space-[#6B1D2F] space-y-6">
      
      {/* Top Banner: Residente Welcome & Gamification Summary */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 md:p-6 border border-[#6B1D2F]/20 shadow-xs relative overflow-hidden">
        {/* Background Accent Lines */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#6B1D2F]/5 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#6B1D2F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Médico Residente IMSS
              </span>
              <span className="text-xs font-semibold text-[#6B1D2F] flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" /> 2 Recordatorios de entrega
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#6B1D2F] tracking-tight">
              Ruta Académica Ohtli 2.0
            </h1>
            <p className="text-sm text-[#1c1917]/80 max-w-2xl mt-1">
              Capacitación e investigación clínica guiada asíncrona. Avance estructurado desde R1 (Protocolo) hasta R3 (Tesis y Publicación).
            </p>
          </div>

          {/* Gamification Bar */}
          <div className="bg-[#F3EFE6] rounded-xl p-4 border border-[#6B1D2F]/20 flex flex-col sm:flex-row items-center gap-4 min-w-[320px]">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#6B1D2F] text-[#C5A059] font-black text-lg shadow-sm border-2 border-[#C5A059]">
                {gamification.level}
                <Sparkles className="w-3 h-3 text-[#C5A059] absolute -top-1 -right-1" />
              </div>
              <div>
                <div className="text-xs text-[#1c1917]/70 font-bold uppercase tracking-wider">
                  Nivel {gamification.level}
                </div>
                <div className="text-sm font-extrabold text-[#6B1D2F]">
                  {gamification.currentTitle}
                </div>
              </div>
            </div>

            <div className="w-full flex-1">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#6B1D2F]">{gamification.xp} XP</span>
                <span className="text-[#1c1917]/60">{gamification.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2.5 bg-[#E6DFD3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6B1D2F] to-[#C5A059] transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (gamification.xp / gamification.nextLevelXp) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#1c1917]/70 font-semibold mt-1.5">
                <span className="flex items-center gap-1 text-amber-700">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  {gamification.streakDays} días racha
                </span>
                <span className="flex items-center gap-1 text-[#6B1D2F]">
                  <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
                  #{gamification.rankDelegational} en Delegación
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Residency Year Selector & Roadmap Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Years & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Year Tabs */}
          <div className="bg-[#FAF8F5] rounded-xl p-2 border border-[#6B1D2F]/20 flex items-center justify-between gap-2 shadow-xs overflow-x-auto">
            <button
              onClick={() => setSelectedYear('R1')}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                selectedYear === 'R1'
                  ? 'bg-[#6B1D2F] text-white shadow-xs'
                  : 'text-[#1c1917]/70 hover:bg-[#6B1D2F]/10 hover:text-[#6B1D2F]'
              }`}
            >
              <span className="uppercase tracking-wider font-extrabold text-sm">Año 1 (R1)</span>
              <span className="text-[10px] font-normal opacity-90">Protocolo (5 meses)</span>
            </button>

            <button
              onClick={() => setSelectedYear('R2')}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                selectedYear === 'R2'
                  ? 'bg-[#6B1D2F] text-white shadow-xs'
                  : 'text-[#1c1917]/70 hover:bg-[#6B1D2F]/10 hover:text-[#6B1D2F]'
              }`}
            >
              <span className="uppercase tracking-wider font-extrabold text-sm">Año 2 (R2)</span>
              <span className="text-[10px] font-normal opacity-90">Bases Datos (3 meses)</span>
            </button>

            <button
              onClick={() => setSelectedYear('R3')}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                selectedYear === 'R3'
                  ? 'bg-[#6B1D2F] text-white shadow-xs'
                  : 'text-[#1c1917]/70 hover:bg-[#6B1D2F]/10 hover:text-[#6B1D2F]'
              }`}
            >
              <span className="uppercase tracking-wider font-extrabold text-sm">Año 3 (R3)</span>
              <span className="text-[10px] font-normal opacity-90">Tesis & Artículo (5m)</span>
            </button>
          </div>

          {/* Active Phase Card */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#6B1D2F]/15 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#6B1D2F] bg-[#6B1D2F]/10 px-2.5 py-0.5 rounded-md">
                    {activePhase.phaseName}
                  </span>
                  <span className="text-xs text-[#1c1917]/60 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Duración estimada: {activePhase.durationMonths} meses
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#1c1917] mt-1">
                  {activePhase.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-[#1c1917]/70 font-semibold block">Avance de Etapa</span>
                  <span className="text-lg font-extrabold text-[#6B1D2F]">
                    {activePhase.progressPercent}%
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#E6DFD3] border-t-[#6B1D2F] flex items-center justify-center font-bold text-xs text-[#6B1D2F]">
                  {activePhase.tasks.filter((t) => t.completed).length}/{activePhase.tasks.length}
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-[#6B1D2F] uppercase tracking-wider">
                Entregables & Hitos Requeridos:
              </h3>

              {activePhase.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-[#6B1D2F]/20 hover:border-[#6B1D2F]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onTaskToggle(activePhase.id, task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-[#6B1D2F]/40 hover:border-[#6B1D2F]'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#1c1917]">
                            {index + 1}. {task.title}
                          </span>
                          
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#6B1D2F]">
                            +{task.xpReward} XP
                          </span>

                          {task.deliverableType === 'dataset' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
                              <Database className="w-3 h-3" /> REDCap/Excel
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#1c1917]/75">
                          {task.description}
                        </p>

                        {task.feedback && (
                          <div className="mt-2 text-xs bg-amber-50 border-l-2 border-amber-500 p-2 rounded text-amber-900 font-medium">
                            <strong className="text-amber-800">Dictamen Tutor ({task.score}/100 pts):</strong> {task.feedback}
                          </div>
                        )}

                        {task.dueDate && !task.completed && (
                          <div className="text-[11px] font-semibold text-rose-700 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" /> Sugerido antes de: {task.dueDate} (Evita sobrecarga de guardia)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {task.completed ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                          Completado
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setSelectedTaskForModal({
                              phaseId: activePhase.id,
                              task,
                            })
                          }
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#6B1D2F] text-white text-xs font-bold rounded-lg hover:bg-[#4A1320] transition-colors shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Subir Avance</span>
                        </button>
                      )}

                      {task.resourceUrl && (
                        <a
                          href={task.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#6B1D2F] underline font-semibold flex items-center gap-0.5 hover:text-[#4A1320]"
                        >
                          <span>Portal SIRELCIS</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linkage with Umbrella Projects Widget */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#6B1D2F] text-base flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> Vinculación con "Proyectos Paraguas" IMSS
                </h3>
                <p className="text-xs text-[#1c1917]/70">
                  SÚMATE a protocolos sombrilla ya autorizados para acelerar tu tesis y garantizar datos de alta calidad.
                </p>
              </div>
              <button
                onClick={() => onNavigateView('evaluations')}
                className="text-xs font-bold text-[#6B1D2F] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Ver Todos</span> <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {umbrellaProjects.slice(0, 2).map((umb) => (
                <div key={umb.id} className="p-3 rounded-xl bg-white border border-[#6B1D2F]/15 hover:border-[#6B1D2F]/40 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-[#6B1D2F]">
                    <span className="bg-[#6B1D2F]/10 px-2 py-0.5 rounded">{umb.category}</span>
                    <span>{umb.availableSpots} lugares vacantes</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#1c1917] line-clamp-2">
                    {umb.title}
                  </h4>
                  <div className="text-[11px] text-[#1c1917]/70 font-medium">
                    Líder: {umb.investigatorName} ({umb.delegation})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fast Educational Capsules & Network Shortcuts */}
        <div className="space-y-6">
          
          {/* Quick Educational Capsules Widget */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#6B1D2F] text-sm flex items-center gap-1.5">
                <Video className="w-4 h-4 text-[#6B1D2F]" /> Cápsulas Educativas Asíncronas
              </h3>
              <button
                onClick={() => onNavigateView('education')}
                className="text-xs font-bold text-[#6B1D2F] hover:underline flex items-center gap-0.5"
              >
                <span>Ver Hub</span> <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-[#1c1917]/70">
              Micro-contenidos TikTok de 60s, webinars en YouTube e integración directa con @saberimss.
            </p>

            <div className="space-y-3">
              {educationalCapsules.slice(0, 3).map((cap) => (
                <div
                  key={cap.id}
                  onClick={() => onNavigateView('education')}
                  className="p-2.5 rounded-xl bg-white border border-[#6B1D2F]/15 hover:border-[#6B1D2F] cursor-pointer transition-all flex items-center gap-3"
                >
                  <img
                    src={cap.thumbnailUrl}
                    alt={cap.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B1D2F] bg-[#6B1D2F]/10 px-1.5 py-0.5 rounded">
                      {cap.type.toUpperCase()} • {cap.duration}
                    </span>
                    <h4 className="text-xs font-bold text-[#1c1917] truncate mt-1">
                      {cap.title}
                    </h4>
                    <span className="text-[10px] text-[#1c1917]/60 block truncate">
                      {cap.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geolocation & Research Nodes Shortcut */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-3">
            <h3 className="font-bold text-[#6B1D2F] text-sm flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Redes CIEFD y CINV Cercanas
            </h3>
            <p className="text-xs text-[#1c1917]/75">
              Encuentra centros de formación en educación e investigación del IMSS y tutores disponibles en tu delegación.
            </p>
            <button
              onClick={() => onNavigateView('geomap')}
              className="w-full py-2.5 bg-[#6B1D2F] text-white font-bold text-xs rounded-xl hover:bg-[#4A1320] transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explorar Mapa Interactivo CIEFD/CINV</span>
            </button>
          </div>

          {/* Gamification Badges Preview */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-3">
            <h3 className="font-bold text-[#6B1D2F] text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#C5A059]" /> Logros & Medallas Obtenidas
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {gamification.badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-2.5 rounded-xl border text-center space-y-1 ${
                    b.unlockedAt
                      ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                      : 'bg-stone-100 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto rounded-full bg-[#6B1D2F] text-[#C5A059] flex items-center justify-center font-bold text-xs">
                    {b.name.charAt(0)}
                  </div>
                  <div className="font-extrabold text-[11px] leading-tight truncate">{b.name}</div>
                  <div className="text-[9px] text-[#1c1917]/70 line-clamp-1">{b.description}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modal for Uploading Task Deliverables */}
      {selectedTaskForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] rounded-2xl max-w-md w-full p-6 border-2 border-[#6B1D2F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#6B1D2F]/20 pb-3">
              <h3 className="font-extrabold text-[#6B1D2F] text-base flex items-center gap-2">
                <FileText className="w-5 h-5" /> Entregar Actividad
              </h3>
              <button
                onClick={() => setSelectedTaskForModal(null)}
                className="text-[#1c1917]/50 hover:text-[#1c1917] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="text-xs font-bold text-[#6B1D2F] uppercase bg-[#6B1D2F]/10 px-2 py-0.5 rounded">
                Recompensa: +{selectedTaskForModal.task.xpReward} XP
              </span>
              <h4 className="font-bold text-sm text-[#1c1917] mt-1">
                {selectedTaskForModal.task.title}
              </h4>
              <p className="text-xs text-[#1c1917]/70 mt-1">
                {selectedTaskForModal.task.description}
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1c1917] mb-1">
                  Notas de entrega o folio SIRELCIS / REDCap:
                </label>
                <textarea
                  required
                  rows={3}
                  value={fileNoteInput}
                  onChange={(e) => setFileNoteInput(e.target.value)}
                  placeholder="Ej: Adjunto avance en PDF revisado por tutor. Folio CAMIS-2026-089."
                  className="w-full p-3 rounded-xl border border-[#6B1D2F]/30 bg-white text-xs focus:ring-2 focus:ring-[#6B1D2F] outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-[#6B1D2F]/30 rounded-xl p-4 text-center bg-white">
                <Upload className="w-8 h-8 mx-auto text-[#6B1D2F] mb-1" />
                <span className="text-xs font-bold text-[#6B1D2F]">
                  Seleccionar archivo PDF, Excel o Matriz de datos
                </span>
                <span className="block text-[10px] text-[#1c1917]/60 mt-0.5">
                  Archivos de hasta 50MB. Cifrado institucional.
                </span>
              </div>

              {!isOnline && (
                <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Estás en <strong>modo offline</strong>. El entregable se guardará localmente en el dispositivo y se sincronizará al conectar.
                  </span>
                </div>
              )}

              {submittedSuccessMessage && (
                <div className="bg-emerald-100 border border-emerald-300 p-2.5 rounded-xl text-xs font-bold text-emerald-900">
                  {submittedSuccessMessage}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForModal(null)}
                  className="px-4 py-2 text-xs font-bold text-[#1c1917]/70 hover:bg-stone-200 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6B1D2F] text-white text-xs font-bold rounded-xl hover:bg-[#4A1320] shadow-xs"
                >
                  Confirmar Envíos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
