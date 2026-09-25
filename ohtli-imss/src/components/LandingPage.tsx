import React, { useState } from 'react';
import { UserRole } from '../types/ohtli';
import { OhtliSymbol } from './OhtliSymbol';
import {
  GraduationCap,
  Building2,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Award,
  Sparkles,
  WifiOff,
  MapPin,
  LogIn,
} from 'lucide-react';

interface LandingPageProps {
  onLogin: (role: UserRole, userIdentifier: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('RESIDENTE');
  const [matricula, setMatricula] = useState<string>('99482710');
  const [password, setPassword] = useState<string>('••••••••');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(selectedRole, matricula);
      setIsSubmitting(false);
    }, 600);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'RESIDENTE') setMatricula('99482710');
    if (role === 'DOCENTE') setMatricula('88321045');
    if (role === 'DIRECTIVO') setMatricula('10293847');
    
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(role, role === 'RESIDENTE' ? '99482710' : role === 'DOCENTE' ? '88321045' : '10293847');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#1c1917] flex flex-col justify-between selection:bg-[#6B1D2F] selection:text-white">
      {/* Top Banner Accent */}
      <div className="h-2 bg-[#6B1D2F] w-full" />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand & Educational Strategy Description */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-[#6B1D2F]/10 text-[#6B1D2F] border border-[#6B1D2F]/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#6B1D2F]" />
              <span>Plataforma Institucional IMSS</span>
            </div>

            {/* Main Logo & Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <OhtliSymbol size={64} variant="full" />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#6B1D2F] leading-tight tracking-tight">
                Estrategia de Capacitación en Investigación Médica
              </h1>

              <p className="text-base sm:text-lg text-[#1c1917]/80 leading-relaxed font-medium">
                Plataforma digital asíncrona diseñada para acompañar a los médicos residentes del IMSS en la estructuración, desarrollo y publicación de sus protocolos de investigación.
              </p>
            </div>

            {/* Strategic Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#6B1D2F]/15 space-y-1.5 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center font-bold">
                  <WifiOff className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-sm text-[#1c1917]">Offline-First & Guardia Ágil</h2>
                <p className="text-xs text-[#1c1917]/70">
                  Registra avances sin conexión durante guardias rotatorias; sincroniza automáticamente al reconectarse.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#6B1D2F]/15 space-y-1.5 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-sm text-[#1c1917]">Micro-Aprendizaje Asíncrono</h2>
                <p className="text-xs text-[#1c1917]/70">
                  Píldoras educativas en TikTok (60s), webinars YouTube, hilos en X y enlace a @SaberIMSS.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#6B1D2F]/15 space-y-1.5 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-sm text-[#1c1917]">Gamificación & Insignias Náhuatl</h2>
                <p className="text-xs text-[#1c1917]/70">
                  Reconocimiento al cumplimiento normativo mediante medallas institucionales y puntos XP.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#6B1D2F]/15 space-y-1.5 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-sm text-[#1c1917]">Red CIEF & Proyectos Paraguas</h2>
                <p className="text-xs text-[#1c1917]/70">
                  Vinculación directa con investigadores CINV e integración a protocolos sombrilla autorizados.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: User Login Portal Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border-2 border-[#6B1D2F]/20 shadow-xl space-y-6">
              
              <div className="border-b border-[#6B1D2F]/15 pb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#6B1D2F] uppercase tracking-wider">
                    Portal de Acceso
                  </span>
                  <span className="text-[10px] bg-[#6B1D2F] text-white px-2 py-0.5 rounded font-bold">
                    Ohtli 2.0
                  </span>
                </div>
                <h2 className="text-2xl font-black text-[#1c1917]">
                  Iniciar Sesión
                </h2>
                <p className="text-xs text-[#1c1917]/70">
                  Ingresa con tu Matrícula IMSS o selecciona un perfil de acceso rápido.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Role Selector Tabs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6B1D2F] block">
                    Tipo de Usuario / Rol
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#E6DFD3] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('RESIDENTE')}
                      className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                        selectedRole === 'RESIDENTE'
                          ? 'bg-[#6B1D2F] text-white shadow-xs'
                          : 'text-[#1c1917]/80 hover:bg-white/50'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Residente</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('DOCENTE')}
                      className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                        selectedRole === 'DOCENTE'
                          ? 'bg-[#6B1D2F] text-white shadow-xs'
                          : 'text-[#1c1917]/80 hover:bg-white/50'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Docente</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('DIRECTIVO')}
                      className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                        selectedRole === 'DIRECTIVO'
                          ? 'bg-[#6B1D2F] text-white shadow-xs'
                          : 'text-[#1c1917]/80 hover:bg-white/50'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Directivo</span>
                    </button>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-[#1c1917]/80 block mb-1">
                      Matrícula IMSS o Correo
                    </label>
                    <input
                      type="text"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      required
                      placeholder="Ej. 99482710"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#6B1D2F]/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#6B1D2F] text-[#1c1917]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1c1917]/80 block mb-1">
                      Contraseña Institucional
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#6B1D2F]/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#6B1D2F] text-[#1c1917]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#6B1D2F] hover:bg-[#4A1320] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Ingresando a Ohtli 2.0...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Ingresar al Sistema</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Login Preset Buttons */}
              <div className="pt-2 border-t border-[#6B1D2F]/15 space-y-2">
                <div className="text-[11px] font-bold text-[#6B1D2F] uppercase tracking-wider text-center">
                  Acceso Rápido de Prueba (Demo)
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('RESIDENTE')}
                    className="w-full py-2 px-3 bg-white border border-[#6B1D2F]/20 hover:border-[#6B1D2F] rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all hover:bg-stone-50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[#1c1917]">Médico Residente R1</div>
                        <div className="text-[10px] text-[#1c1917]/60 font-normal">HGZ No. 1 A Tlaltelolco</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6B1D2F]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('DOCENTE')}
                    className="w-full py-2 px-3 bg-white border border-[#6B1D2F]/20 hover:border-[#6B1D2F] rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all hover:bg-stone-50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[#1c1917]">Tutor / Investigador CINV</div>
                        <div className="text-[10px] text-[#1c1917]/60 font-normal">Centro de Investigación Biomédica</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6B1D2F]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('DIRECTIVO')}
                    className="w-full py-2 px-3 bg-white border border-[#6B1D2F]/20 hover:border-[#6B1D2F] rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all hover:bg-stone-50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#6B1D2F]/10 text-[#6B1D2F] flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[#1c1917]">Directivo IMSS Delegacional</div>
                        <div className="text-[10px] text-[#1c1917]/60 font-normal">Jefatura de Prestaciones Médicas</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6B1D2F]" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] border-t border-[#6B1D2F]/15 py-4 text-center text-xs text-[#1c1917]/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#6B1D2F]">Ohtli 2.0</span>
            <span>— Instituto Mexicano del Seguro Social</span>
          </div>
          <div className="text-[11px] font-semibold text-[#6B1D2F]">
            Coordinación de Educación e Investigación en Salud (CIS)
          </div>
        </div>
      </footer>
    </div>
  );
};
