import React from 'react';
import {
  ResidentProtocolSubmission,
  UmbrellaProject,
} from '../types/ohtli';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Link as LinkIcon,
  Users,
  Award,
  BookOpen,
} from 'lucide-react';

interface EvaluationsViewProps {
  submissions: ResidentProtocolSubmission[];
  umbrellaProjects: UmbrellaProject[];
}

export const EvaluationsView: React.FC<EvaluationsViewProps> = ({
  submissions,
  umbrellaProjects,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 md:p-6 border border-[#6B1D2F]/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#6B1D2F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Seguimiento Institucional
              </span>
              <span className="text-xs text-[#6B1D2F] font-bold">
                Estatus de Dictámenes y Proyectos Paraguas
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#6B1D2F]">
              Evaluaciones de Protocolos y Proyectos "Paraguas" IMSS
            </h1>
            <p className="text-xs text-[#1c1917]/80 mt-1 max-w-3xl">
              Registro transparente de dictámenes bioéticos, revisiones metodológicas y repositorio de investigaciones sombrilla.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Submissions & Umbrella Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Submissions Status List */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
          <h2 className="font-extrabold text-[#6B1D2F] text-base flex items-center gap-2">
            <FileCheck2 className="w-5 h-5" /> Entregables Recientes y Estatus
          </h2>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl bg-white border border-[#6B1D2F]/15 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="bg-[#6B1D2F]/10 text-[#6B1D2F] px-2.5 py-0.5 rounded">
                    {sub.residentYear} • {sub.hospitalUnit}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded ${
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

                <h3 className="font-bold text-sm text-[#1c1917]">
                  {sub.protocolTitle}
                </h3>

                <div className="text-xs text-[#1c1917]/70 flex items-center justify-between pt-1">
                  <span>Residente: <strong>{sub.residentName}</strong></span>
                  <span>{sub.submittedDate}</span>
                </div>

                {sub.comments && (
                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs text-amber-900 mt-2 font-medium">
                    <strong>Comentario Tutor ({sub.evaluatorName}):</strong> {sub.comments}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Umbrella Projects Catalog */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
          <h2 className="font-extrabold text-[#6B1D2F] text-base flex items-center gap-2">
            <LinkIcon className="w-5 h-5" /> Proyectos "Paraguas" Activos IMSS
          </h2>

          <div className="space-y-4">
            {umbrellaProjects.map((umb) => (
              <div
                key={umb.id}
                className="p-4 rounded-xl bg-white border border-[#6B1D2F]/20 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="bg-[#6B1D2F] text-white px-2.5 py-0.5 rounded">
                    {umb.category}
                  </span>
                  <span className="text-[#6B1D2F]">
                    {umb.availableSpots} Vacantes para Residentes
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-[#1c1917]">
                  {umb.title}
                </h3>

                <p className="text-xs text-[#1c1917]/80">
                  {umb.description}
                </p>

                <div className="text-xs text-[#1c1917]/70 pt-2 border-t border-stone-100 flex items-center justify-between font-medium">
                  <span>Líder: {umb.investigatorName} ({umb.investigatorUnit})</span>
                  <span className="font-bold text-[#6B1D2F]">{umb.activeResidentsCount} Residentes inscritos</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
