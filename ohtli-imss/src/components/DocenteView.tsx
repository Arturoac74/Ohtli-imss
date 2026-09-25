import React, { useState } from 'react';
import {
  ResidentProtocolSubmission,
  UmbrellaProject,
  ResidencyYear,
} from '../types/ohtli';
import {
  CheckCircle2,
  XCircle,
  FileCheck2,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  Layers,
  Send,
  Building,
  Calendar,
  MessageSquare,
} from 'lucide-react';

interface DocenteViewProps {
  submissions: ResidentProtocolSubmission[];
  umbrellaProjects: UmbrellaProject[];
  onEvaluateSubmission: (id: string, status: 'Aprobado' | 'Requiere Cambios', score: number, comment: string) => void;
}

export const DocenteView: React.FC<DocenteViewProps> = ({
  submissions,
  umbrellaProjects,
  onEvaluateSubmission,
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<ResidentProtocolSubmission | null>(
    submissions[0] || null
  );
  const [evaluationScore, setEvaluationScore] = useState<number>(90);
  const [evaluationComment, setEvaluationComment] = useState<string>('');
  const [filterYear, setFilterYear] = useState<ResidencyYear | 'TODOS'>('TODOS');
  const [activeTab, setActiveTab] = useState<'evaluations' | 'talent' | 'training' | 'calls'>('evaluations');

  const filteredSubmissions = submissions.filter(
    (s) => filterYear === 'TODOS' || s.residentYear === filterYear
  );

  const handleApplyEvaluation = (status: 'Aprobado' | 'Requiere Cambios') => {
    if (!selectedSubmission) return;
    onEvaluateSubmission(selectedSubmission.id, status, evaluationScore, evaluationComment);
    setEvaluationComment('');
  };

  return (
    <div className="space-y-6">
      
      {/* Docente Header Banner */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 md:p-6 border border-[#6B1D2F]/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#6B1D2F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Panel Docente / Tutor e Investigador CINV
              </span>
              <span className="text-xs text-[#6B1D2F] font-bold">
                Red CIEFD-CINV IMSS
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#6B1D2F]">
              Gestión de Tesis, Dictaminación y Formación Docente
            </h1>
            <p className="text-xs text-[#1c1917]/80 mt-1">
              Herramientas estandarizadas de evaluación de protocolos, detección de talento residente y vinculación con proyectos paraguas.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F3EFE6] p-1.5 rounded-xl border border-[#6B1D2F]/20">
            <button
              onClick={() => setActiveTab('evaluations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'evaluations'
                  ? 'bg-[#6B1D2F] text-white'
                  : 'text-[#1c1917]/70 hover:text-[#6B1D2F]'
              }`}
            >
              Evaluaciones ({submissions.filter((s) => s.status === 'Pendiente' || s.status === 'En Revisión').length})
            </button>
            <button
              onClick={() => setActiveTab('talent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'talent'
                  ? 'bg-[#6B1D2F] text-white'
                  : 'text-[#1c1917]/70 hover:text-[#6B1D2F]'
              }`}
            >
              Talento Residente
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'training'
                  ? 'bg-[#6B1D2F] text-white'
                  : 'text-[#1c1917]/70 hover:text-[#6B1D2F]'
              }`}
            >
              Oferta Docente
            </button>
            <button
              onClick={() => setActiveTab('calls')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'calls'
                  ? 'bg-[#6B1D2F] text-white'
                  : 'text-[#1c1917]/70 hover:text-[#6B1D2F]'
              }`}
            >
              Convocatorias
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'evaluations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Submissions List */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#6B1D2F] text-sm flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" /> Entregables por Dictaminar
              </h2>
              
              <div className="flex items-center gap-1 text-xs">
                <Filter className="w-3.5 h-3.5 text-[#6B1D2F]" />
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value as any)}
                  className="bg-white border border-[#6B1D2F]/20 rounded-md p-1 text-xs font-bold text-[#6B1D2F]"
                >
                  <option value="TODOS">Todos los Años</option>
                  <option value="R1">Solo R1</option>
                  <option value="R2">Solo R2</option>
                  <option value="R3">Solo R3</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedSubmission?.id === sub.id
                      ? 'bg-[#6B1D2F] text-white border-[#6B1D2F] shadow-sm'
                      : 'bg-white border-[#6B1D2F]/15 hover:border-[#6B1D2F]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        selectedSubmission?.id === sub.id
                          ? 'bg-white/20 text-white'
                          : 'bg-[#6B1D2F]/10 text-[#6B1D2F]'
                      }`}
                    >
                      {sub.residentYear} • {sub.phase}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded ${
                        sub.status === 'Aprobado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub.status === 'Requiere Cambios'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <h3
                    className={`font-bold text-xs truncate ${
                      selectedSubmission?.id === sub.id ? 'text-white' : 'text-[#1c1917]'
                    }`}
                  >
                    {sub.residentName}
                  </h3>
                  <p
                    className={`text-[11px] truncate ${
                      selectedSubmission?.id === sub.id ? 'text-white/80' : 'text-[#1c1917]/70'
                    }`}
                  >
                    {sub.protocolTitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Form / Detail Panel */}
          {selectedSubmission ? (
            <div className="lg:col-span-2 bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
              <div className="border-b border-[#6B1D2F]/15 pb-3 flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-extrabold text-[#6B1D2F] bg-[#6B1D2F]/10 px-2.5 py-0.5 rounded">
                    {selectedSubmission.residentYear} - {selectedSubmission.hospitalUnit} ({selectedSubmission.delegation})
                  </span>
                  <h2 className="text-lg font-bold text-[#1c1917] mt-1">
                    {selectedSubmission.protocolTitle}
                  </h2>
                  <p className="text-xs text-[#1c1917]/70">
                    Residente: <strong>{selectedSubmission.residentName}</strong> • Recibido el {selectedSubmission.submittedDate}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#1c1917]/60 block">Estatus Actual</span>
                  <span className="text-sm font-extrabold text-[#6B1D2F]">
                    {selectedSubmission.status}
                  </span>
                </div>
              </div>

              {/* Rubric Evaluation Form */}
              <div className="space-y-4 bg-white p-4 rounded-xl border border-[#6B1D2F]/20">
                <h3 className="font-bold text-sm text-[#6B1D2F] flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Rúbrica de Evaluación Estandarizada IMSS
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-stone-50">
                    <span>1. Calidad del planteamiento del problema / hipótesis PICO</span>
                    <span className="font-bold text-emerald-700">Cumple Edictos</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-stone-50">
                    <span>2. Consistencia en el diccionario de datos REDCap / Excel</span>
                    <span className="font-bold text-emerald-700">Alineado IMSS</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-stone-50">
                    <span>3. Aspectos bioéticos y protección de datos del paciente</span>
                    <span className="font-bold text-emerald-700">Aprobado CLIES</span>
                  </div>
                </div>

                {/* Score Slider */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <label className="text-[#1c1917]">Calificación Numérica (0-100 pts):</label>
                    <span className="text-base text-[#6B1D2F] font-extrabold">{evaluationScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={evaluationScore}
                    onChange={(e) => setEvaluationScore(Number(e.target.value))}
                    className="w-full accent-[#6B1D2F]"
                  />
                </div>

                {/* Feedback Comment */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1c1917]">
                    Observaciones y Retroalimentación Pedagógica para el Residente:
                  </label>
                  <textarea
                    rows={3}
                    value={evaluationComment}
                    onChange={(e) => setEvaluationComment(e.target.value)}
                    placeholder="Escribe comentarios específicos para mejorar la metodología o redacción..."
                    className="w-full p-2.5 rounded-xl border border-[#6B1D2F]/30 text-xs outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleApplyEvaluation('Requiere Cambios')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Solicitar Cambios</span>
                  </button>

                  <button
                    onClick={() => handleApplyEvaluation('Aprobado')}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#6B1D2F] text-white rounded-xl text-xs font-bold hover:bg-[#4A1320] transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprobar Entregable (+XP)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-[#FAF8F5] rounded-2xl p-8 text-center text-[#1c1917]/60 border border-[#6B1D2F]/20">
              Selecciona una entrega de la lista para evaluar.
            </div>
          )}
        </div>
      )}

      {/* Talent Finder Tab */}
      {activeTab === 'talent' && (
        <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#6B1D2F]/20 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#6B1D2F] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" /> Identificación de Residentes de Alto Potencial
              </h2>
              <p className="text-xs text-[#1c1917]/80">
                Detecta residentes con alto rendimiento de entregables para integrarlos a Proyectos Paraguas o redes de investigación CINV.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar por especialidad o hospital..."
                className="p-2 rounded-xl border border-[#6B1D2F]/20 text-xs bg-white w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Dra. Sofía Ramírez',
                year: 'R2 Pediatría',
                unit: 'CMN Siglo XXI',
                score: '98 pts promedio',
                projects: 'Neuroblastoma',
                badge: 'Prometedor CINV',
              },
              {
                name: 'Dr. Carlos Mendoza',
                year: 'R3 Cardiología',
                unit: 'CMNO Guadalajara',
                score: '95 pts promedio',
                projects: 'Insuficiencia Cardíaca',
                badge: 'Publicante Aceptado',
              },
              {
                name: 'Dr. Alejandro Morales',
                year: 'R1 Urgencias',
                unit: 'HGZ Tlaltelolco',
                score: '92 pts promedio',
                projects: 'Sepsis / NEWS2',
                badge: 'Líder R1',
              },
            ].map((res, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-[#6B1D2F]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold bg-[#6B1D2F] text-white px-2 py-0.5 rounded">
                    {res.year}
                  </span>
                  <span className="text-[10px] font-bold bg-[#C5A059]/20 text-[#6B1D2F] px-2 py-0.5 rounded">
                    {res.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#1c1917]">{res.name}</h3>
                  <div className="text-xs text-[#1c1917]/70">{res.unit}</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">{res.score}</div>
                </div>

                <button className="w-full py-2 bg-[#6B1D2F]/10 hover:bg-[#6B1D2F] hover:text-white text-[#6B1D2F] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Send className="w-3.5 h-3.5" /> Vincular a Proyecto Paraguas
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faculty Training Tab */}
      {activeTab === 'training' && (
        <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#6B1D2F]/20 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#6B1D2F] flex items-center gap-2">
              <GraduationCap className="w-5 h-5" /> Capacitación Docente e Investigadora IMSS
            </h2>
            <p className="text-xs text-[#1c1917]/80">
              Oferta académica de posgrado para profesores, tutores clínicos e investigadores IMSS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Diplomado en Docencia e Investigación Médica en Salud (CIEFD)',
                mode: 'Semipresencial • 120 hrs',
                target: 'Tutores de Médicos Residentes',
                status: 'Convocatoria Abierta',
              },
              {
                title: 'Maestría en Ciencias de la Salud / Biometría (IMSS - UNAM)',
                mode: 'Escolarizado • 2 Años',
                target: 'Médicos adscritos investigadores',
                status: 'Cierre de Registro: 15 Sept',
              },
              {
                title: 'Doctorado en Investigación Médica Aplicada (CINV Siglo XXI)',
                mode: 'Tutorial • 3 Años',
                target: 'Investigadores titulares',
                status: 'Dictamen de Admisión',
              },
            ].map((prog, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-[#6B1D2F]/20 space-y-2">
                <div className="text-[10px] font-bold text-[#6B1D2F] uppercase bg-[#6B1D2F]/10 px-2 py-0.5 rounded inline-block">
                  {prog.status}
                </div>
                <h3 className="font-bold text-sm text-[#1c1917]">{prog.title}</h3>
                <div className="text-xs text-[#1c1917]/70 font-medium">{prog.mode}</div>
                <div className="text-xs text-[#1c1917]/60">Dirigido a: {prog.target}</div>
                <button className="mt-2 text-xs font-bold text-[#6B1D2F] underline">
                  Ver Requisitos y Plan de Estudio →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calls & Congresses Tab */}
      {activeTab === 'calls' && (
        <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#6B1D2F]/20 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#6B1D2F] flex items-center gap-2">
              <Building className="w-5 h-5" /> Convocatorias y Congresos de Investigación IMSS
            </h2>
            <p className="text-xs text-[#1c1917]/80">
              Foros nacionales para difusión de tesis destacadas de residentes y fondos de financiamiento FIS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#6B1D2F]/20 space-y-2">
              <span className="text-[10px] font-bold bg-[#C5A059] text-white px-2 py-0.5 rounded">
                Congreso Nacional
              </span>
              <h3 className="font-bold text-sm text-[#1c1917]">
                XXXIII Foro Nacional de Investigación en Salud IMSS 2026
              </h3>
              <p className="text-xs text-[#1c1917]/70">
                Sede: Cancún, Quintana Roo. Categoría de Trabajos de Tesis de Residentes.
              </p>
              <div className="text-xs font-bold text-[#6B1D2F]">Límite de envío de resúmenes: 30 de Octubre</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#6B1D2F]/20 space-y-2">
              <span className="text-[10px] font-bold bg-[#6B1D2F] text-white px-2 py-0.5 rounded">
                Fondo FIS IMSS
              </span>
              <h3 className="font-bold text-sm text-[#1c1917]">
                Fondo de Inversión en Salud para Proyectos Multicéntricos
              </h3>
              <p className="text-xs text-[#1c1917]/70">
                Financiamiento de hasta $500,000 MXN para investigación epidemiológica institucional.
              </p>
              <div className="text-xs font-bold text-[#6B1D2F]">Apertura de plataforma: Abierta</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
