import React, { useState } from 'react';
import { EducationalCapsule, ResidencyYear } from '../types/ohtli';
import {
  Video,
  Play,
  Heart,
  Eye,
  ExternalLink,
  BookOpen,
  Filter,
  Sparkles,
  Search,
  Share2,
} from 'lucide-react';

interface EducationalHubProps {
  capsules: EducationalCapsule[];
}

export const EducationalHub: React.FC<EducationalHubProps> = ({ capsules }) => {
  const [selectedYearFilter, setSelectedYearFilter] = useState<ResidencyYear | 'TODOS'>('TODOS');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('TODOS');
  const [activeCapsule, setActiveCapsule] = useState<EducationalCapsule>(capsules[0]);

  const filteredCapsules = capsules.filter((cap) => {
    const matchesYear =
      selectedYearFilter === 'TODOS' || cap.yearTarget === selectedYearFilter || cap.yearTarget === 'TODOS';
    const matchesType = selectedTypeFilter === 'TODOS' || cap.type === selectedTypeFilter;
    return matchesYear && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Educational Hub Header */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 md:p-6 border border-[#6B1D2F]/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#6B1D2F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Hub Asíncrono de Capacitación
              </span>
              <span className="text-xs text-[#6B1D2F] font-bold">
                Cápsulas TikTok, Webinars YouTube, @SaberIMSS & Hilos X
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#6B1D2F]">
              Contenido Educativo Multiplataforma Ohtli
            </h1>
            <p className="text-xs text-[#1c1917]/80 mt-1 max-w-3xl">
              Píldoras de aprendizaje ágil diseñadas específicamente para médicos residentes durante guardias y rotaciones.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value as any)}
              className="p-2 rounded-xl border border-[#6B1D2F]/20 text-xs font-bold bg-white text-[#6B1D2F]"
            >
              <option value="TODOS">Todos los Años (R1-R3)</option>
              <option value="R1">Para R1 (Protocolo)</option>
              <option value="R2">Para R2 (Bases de Datos)</option>
              <option value="R3">Para R3 (Tesis / Artículo)</option>
            </select>

            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="p-2 rounded-xl border border-[#6B1D2F]/20 text-xs font-bold bg-white text-[#6B1D2F]"
            >
              <option value="TODOS">Todos los Formatos</option>
              <option value="tiktok">TikTok Micro-Tip (60s)</option>
              <option value="saberimss">Curso @SaberIMSS</option>
              <option value="youtube">YouTube Webinar</option>
              <option value="x_thread">Hilo X / Twitter</option>
              <option value="podcast">Podcast Ohtli</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Player & Video Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Capsule Player View */}
        <div className="lg:col-span-2 bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-[#6B1D2F]/30 group">
            <img
              src={activeCapsule.thumbnailUrl}
              alt={activeCapsule.title}
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="bg-[#6B1D2F] text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  {activeCapsule.type.toUpperCase()} • {activeCapsule.duration}
                </span>
                <span className="bg-white/20 backdrop-blur-xs text-xs font-bold px-2.5 py-1 rounded-full">
                  Año {activeCapsule.yearTarget}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-white leading-tight">
                  {activeCapsule.title}
                </h2>
                <p className="text-xs text-stone-200 line-clamp-2">
                  {activeCapsule.description}
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-stone-300 pt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> {activeCapsule.likesCount.toLocaleString()} me gusta
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-blue-400" /> {activeCapsule.viewsCount.toLocaleString()} vistas
                  </span>
                  <span>Autor: {activeCapsule.author}</span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-[#6B1D2F]/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#6B1D2F]/15">
            <div className="flex items-center gap-2 flex-wrap">
              {activeCapsule.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-bold bg-[#6B1D2F]/10 text-[#6B1D2F] px-2.5 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#6B1D2F] text-white text-xs font-bold rounded-xl hover:bg-[#4A1320] transition-colors shadow-xs">
              <Share2 className="w-4 h-4" />
              <span>Compartir con Colegas</span>
            </button>
          </div>
        </div>

        {/* Capsule Catalog Sidebar */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-3">
          <h2 className="font-extrabold text-[#6B1D2F] text-sm flex items-center gap-1.5">
            <Video className="w-4 h-4" /> Catálogo de Cápsulas Asíncronas
          </h2>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredCapsules.map((cap) => (
              <div
                key={cap.id}
                onClick={() => setActiveCapsule(cap)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeCapsule.id === cap.id
                    ? 'bg-[#6B1D2F] text-white border-[#6B1D2F] shadow-sm'
                    : 'bg-white border-[#6B1D2F]/15 hover:border-[#6B1D2F]'
                }`}
              >
                <img
                  src={cap.thumbnailUrl}
                  alt={cap.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span
                      className={`px-1.5 py-0.2 rounded uppercase ${
                        activeCapsule.id === cap.id
                          ? 'bg-white/20 text-white'
                          : 'bg-[#6B1D2F]/10 text-[#6B1D2F]'
                      }`}
                    >
                      {cap.type}
                    </span>
                    <span
                      className={activeCapsule.id === cap.id ? 'text-white/80' : 'text-[#1c1917]/60'}
                    >
                      {cap.duration}
                    </span>
                  </div>

                  <h3
                    className={`font-bold text-xs truncate ${
                      activeCapsule.id === cap.id ? 'text-white' : 'text-[#1c1917]'
                    }`}
                  >
                    {cap.title}
                  </h3>

                  <div
                    className={`text-[10px] truncate ${
                      activeCapsule.id === cap.id ? 'text-white/70' : 'text-[#1c1917]/60'
                    }`}
                  >
                    {cap.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
