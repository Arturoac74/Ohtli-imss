import React from 'react';
import { GamificationProfile } from '../types/ohtli';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Star,
} from 'lucide-react';

interface GamificationViewProps {
  gamification: GamificationProfile;
}

export const GamificationView: React.FC<GamificationViewProps> = ({ gamification }) => {
  return (
    <div className="space-y-6">
      
      {/* Gamification Header */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 md:p-6 border border-[#6B1D2F]/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#6B1D2F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Gamificación & Escalafón
              </span>
              <span className="text-xs text-[#6B1D2F] font-bold">
                Reconocimiento Académico por Entregables
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#6B1D2F]">
              Progreso, Medallas y Puntos de Experiencia (XP)
            </h1>
            <p className="text-xs text-[#1c1917]/80 mt-1 max-w-3xl">
              Incentivamos el cumplimiento puntual de protocolos, bases de datos y tesis mediante reconocimientos institucionales y medallas náhuatl.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#C5A059]/20 text-[#6B1D2F] px-3 py-2 rounded-xl border border-[#C5A059] font-bold text-xs">
              <Trophy className="w-4 h-4 text-[#C5A059]" />
              <span>#{gamification.rankDelegational} Posición Delegacional</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-2">
          <div className="text-xs text-[#1c1917]/70 font-bold uppercase tracking-wider">
            Nivel Actual
          </div>
          <div className="text-3xl font-black text-[#6B1D2F] flex items-center gap-2">
            <span>Nivel {gamification.level}</span>
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div className="text-xs font-extrabold text-[#6B1D2F]">
            {gamification.currentTitle}
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-2">
          <div className="text-xs text-[#1c1917]/70 font-bold uppercase tracking-wider">
            Puntos de Experiencia (XP)
          </div>
          <div className="text-3xl font-black text-[#6B1D2F]">
            {gamification.xp} / {gamification.nextLevelXp}
          </div>
          <div className="w-full h-2 bg-[#E6DFD3] rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-[#6B1D2F] rounded-full"
              style={{ width: `${(gamification.xp / gamification.nextLevelXp) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-2">
          <div className="text-xs text-[#1c1917]/70 font-bold uppercase tracking-wider">
            Racha Consecutiva
          </div>
          <div className="text-3xl font-black text-amber-600 flex items-center gap-2">
            <Flame className="w-7 h-7 text-amber-500 fill-amber-500" />
            <span>{gamification.streakDays} Días</span>
          </div>
          <div className="text-xs text-amber-900 font-semibold">
            ¡Modo Asíncrono Continuo Activo!
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#6B1D2F]/20 shadow-xs space-y-2">
          <div className="text-xs text-[#1c1917]/70 font-bold uppercase tracking-wider">
            Entregables Validados
          </div>
          <div className="text-3xl font-black text-[#6B1D2F]">
            {gamification.totalSubmissions}
          </div>
          <div className="text-xs text-emerald-700 font-bold">
            100% Sin correcciones graves
          </div>
        </div>
      </div>

      {/* Badges Catalog */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
        <h2 className="font-extrabold text-[#6B1D2F] text-base flex items-center gap-2">
          <Award className="w-5 h-5 text-[#C5A059]" /> Catálogo de Medallas e Insignias Desbloqueadas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gamification.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border space-y-2 relative overflow-hidden transition-all ${
                badge.unlockedAt
                  ? 'bg-white border-[#6B1D2F]/30 shadow-xs'
                  : 'bg-stone-100/80 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#6B1D2F] text-[#C5A059] flex items-center justify-center font-bold text-sm shadow-sm">
                  {badge.name.charAt(0)}
                </div>
                {badge.unlockedAt ? (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Desbloqueado
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-stone-200 text-stone-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Bloqueado
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-[#1c1917]">{badge.name}</h3>
                <p className="text-xs text-[#1c1917]/70 mt-0.5">{badge.description}</p>
              </div>

              {badge.unlockedAt && (
                <div className="text-[10px] text-[#6B1D2F] font-bold pt-1">
                  Obtenido el {badge.unlockedAt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
