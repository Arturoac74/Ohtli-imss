import React, { useState } from 'react';
import { UserRole, AppViewMode } from '../types/ohtli';
import { OhtliSymbol } from './OhtliSymbol';
import {
  User,
  GraduationCap,
  Building2,
  LayoutDashboard,
  MapPin,
  Video,
  Award,
  FileCheck2,
  Wifi,
  WifiOff,
  LogOut,
  FolderGit2,
  ShieldCheck,
  Download,
  ExternalLink,
  Copy,
  Check,
  X,
  Code2,
} from 'lucide-react';

interface OhtliHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  onLogout: () => void;
  isAdmin?: boolean;
}

export const OhtliHeader: React.FC<OhtliHeaderProps> = ({
  currentRole,
  onRoleChange,
  currentView,
  onViewChange,
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  onLogout,
  isAdmin = false,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedStep, setCopiedStep] = useState(false);

  const gitCommands = `# 1. En la carpeta de tu proyecto descargado:
git init
git branch -M main
git remote add origin https://github.com/Arturoac74/ohtli-imss.git
git add .
git commit -m "feat: Ohtli 2.0 - Plataforma de Investigacion Medica IMSS"
git push -u origin main`;

  const copyCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedStep(true);
    setTimeout(() => setCopiedStep(false), 2500);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F3EFE6] border-b border-[#6B1D2F]/20 shadow-xs backdrop-blur-md bg-opacity-95">
      {/* Top Banner with Brand Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Ohtli 2.0 Imagotipo */}
          <div className="flex items-center justify-between">
            <div 
              className="cursor-pointer transition-transform active:scale-95"
              onClick={() => onViewChange('dashboard')}
            >
              <OhtliSymbol size={42} variant="full" />
            </div>

            {/* Offline/Online Asynchronous Status pill on Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsExportModalOpen(true)}
                title="Exportar código para GitHub"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#1c1917] text-white"
              >
                <Download className="w-3 h-3 text-[#C5A059]" />
                <span>GitHub</span>
              </button>

              <button
                onClick={onToggleOnline}
                title="Sincronización asíncrona PWA"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
                <span>{isOnline ? 'En línea' : 'Modo Offline'}</span>
                {pendingSyncCount > 0 && (
                  <span className="ml-1 bg-[#6B1D2F] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {pendingSyncCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Role Switcher (RBAC) */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#6B1D2F]/20 shadow-xs">
              <span className="text-[11px] font-bold text-[#6B1D2F] uppercase tracking-wider px-2 hidden lg:inline">
                Perfil RBAC:
              </span>
              
              <button
                onClick={() => onRoleChange('RESIDENTE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'RESIDENTE'
                    ? 'bg-[#6B1D2F] text-white shadow-xs'
                    : 'text-[#1c1917]/70 hover:text-[#6B1D2F] hover:bg-black/5'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Residente</span>
              </button>

              <button
                onClick={() => onRoleChange('DOCENTE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'DOCENTE'
                    ? 'bg-[#6B1D2F] text-white shadow-xs'
                    : 'text-[#1c1917]/70 hover:text-[#6B1D2F] hover:bg-black/5'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Docente / Tutor</span>
              </button>

              <button
                onClick={() => onRoleChange('DIRECTIVO')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'DIRECTIVO'
                    ? 'bg-[#6B1D2F] text-white shadow-xs'
                    : 'text-[#1c1917]/70 hover:text-[#6B1D2F] hover:bg-black/5'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Directivo</span>
              </button>
            </div>

            {/* Offline/Online Asynchronous Status pill & Logout Button */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={onToggleOnline}
                title="Haz clic para simular pérdida/recuperación de conexión a internet para sincronización asíncrona"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isOnline
                    ? 'bg-emerald-50/90 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50/90 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
                <span className="font-medium">
                  {isOnline ? 'Sync Asíncrono: Activo' : 'PWA Offline (Pendiente Sync)'}
                </span>
                {pendingSyncCount > 0 && (
                  <span className="bg-[#6B1D2F] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {pendingSyncCount} cola
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                title="Exportar código del proyecto para subir a GitHub"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1c1917] text-white hover:bg-black transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Exportar a GitHub</span>
              </button>

              <button
                onClick={onLogout}
                title="Cerrar sesión e ir a la página principal"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#6B1D2F]/10 text-[#6B1D2F] border border-[#6B1D2F]/20 hover:bg-[#6B1D2F] hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-[#6B1D2F]/15 bg-[#FAF8F5]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-1.5 no-scrollbar text-xs font-medium">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-[#6B1D2F] text-white font-bold'
                  : 'text-[#1c1917]/80 hover:text-[#6B1D2F] hover:bg-[#6B1D2F]/10'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard {currentRole === 'RESIDENTE' ? 'R1-R3' : currentRole === 'DOCENTE' ? 'Tutor' : 'Directivo'}</span>
            </button>

            {/* User Management View - RESTRICTED ONLY TO ADMINS */}
            {isAdmin && (
              <button
                onClick={() => onViewChange('admin_users')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  currentView === 'admin_users'
                    ? 'bg-[#6B1D2F] text-white font-bold'
                    : 'text-[#1c1917]/80 hover:text-[#6B1D2F] hover:bg-[#6B1D2F]/10'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Administración de Usuarios</span>
              </button>
            )}

            <button
              onClick={() => onViewChange('protocols_repo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentView === 'protocols_repo'
                  ? 'bg-[#6B1D2F] text-white font-bold'
                  : 'text-[#1c1917]/80 hover:text-[#6B1D2F] hover:bg-[#6B1D2F]/10'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Repositorio de Protocolos</span>
            </button>

            <button
              onClick={() => onViewChange('geomap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentView === 'geomap'
                  ? 'bg-[#6B1D2F] text-white font-bold'
                  : 'text-[#1c1917]/80 hover:text-[#6B1D2F] hover:bg-[#6B1D2F]/10'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Geolocalización CIEFD/CINV</span>
            </button>

            <button
              onClick={() => onViewChange('education')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentView === 'education'
                  ? 'bg-[#6B1D2F] text-white font-bold'
                  : 'text-[#1c1917]/80 hover:text-[#6B1D2F] hover:bg-[#6B1D2F]/10'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Cápsulas & @saberimss</span>
            </button>

            <button
              onClick={() => onViewChange('gamification')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentView === 'gamification'
                  ? 'bg-[#6B1D2F] text-white font-bold'
                  : 'text-[#1c1917]/80 hover:text-[#6B1D2F] hover:bg-[#6B1D2F]/10'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Gamificación & Nivel</span>
            </button>

            <button
              onClick={() => onViewChange('evaluations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentView === 'evaluations'
                  ? 'bg-[#6B1D2F] text-white font-bold'
                  : 'text-[#1c1917]/80 hover:text-[#6B1D2F] hover:bg-[#6B1D2F]/10'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Evaluación & Proyectos</span>
            </button>
          </nav>
        </div>
      </div>
      {/* GitHub Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#6B1D2F]/20 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#6B1D2F] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Download className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Exportar Código a GitHub</h3>
                  <p className="text-xs text-white/80">Repositorio: github.com/Arturoac74/ohtli-imss</p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#1c1917]">
              {/* Note about why files aren't in GitHub yet */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
                <p className="font-bold mb-1">ℹ️ ¿Por qué no aparecen aún en tu GitHub?</p>
                <p>
                  Todos los archivos del proyecto (código React, TypeScript, Tailwind, README y workflows) están completamente creados en este entorno. Por seguridad, la plataforma en la nube no puede escribir directamente en tu cuenta personal de GitHub sin tus credenciales personales. Tienes dos formas muy sencillas de subirlos:
                </p>
              </div>

              {/* Method 1: Download ZIP and upload via GitHub Web */}
              <div className="border border-stone-200 rounded-xl p-4 bg-[#FAF8F5]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#6B1D2F] text-white text-xs flex items-center justify-center font-bold">1</span>
                    Método Recomendado (Web sin terminal — 1 minuto)
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Más rápido
                  </span>
                </div>
                
                <ol className="list-decimal list-inside space-y-2 text-xs text-stone-700 mt-3">
                  <li>
                    Descarga el paquete completo comprimido listo para usar:
                    <div className="mt-2 mb-1">
                      <a
                        href="/ohtli-imss.zip"
                        download="ohtli-imss.zip"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#6B1D2F] text-white font-bold rounded-lg text-xs hover:bg-[#521624] transition-colors shadow-xs"
                      >
                        <Download className="w-4 h-4 text-[#C5A059]" />
                        <span>Descargar ohtli-imss.zip (Proyecto Completo)</span>
                      </a>
                    </div>
                  </li>
                  <li>Descomprime el archivo <strong>.zip</strong> en tu computadora.</li>
                  <li>
                    Abre tu repositorio en GitHub:{' '}
                    <a
                      href="https://github.com/Arturoac74/ohtli-imss"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6B1D2F] underline font-bold inline-flex items-center gap-1"
                    >
                      github.com/Arturoac74/ohtli-imss
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    Haz clic en el enlace azul que dice <strong>"uploading an existing file"</strong> (o botón <em>Add file &gt; Upload files</em>).
                  </li>
                  <li>Arrastra todos los archivos y carpetas de la descarga y haz clic en <strong>"Commit changes"</strong>.</li>
                </ol>
              </div>

              {/* Method 2: Git CLI */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-700 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Método Vía Terminal / Git CLI
                  </h4>
                  <button
                    onClick={copyCommands}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#6B1D2F] bg-[#6B1D2F]/10 hover:bg-[#6B1D2F]/20 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedStep ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar comandos</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-stone-600 mb-2">
                  Si prefieres la consola, en tu máquina dentro de la carpeta del proyecto ejecuta:
                </p>
                <pre className="bg-stone-900 text-stone-100 p-3 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {gitCommands}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between">
              <a
                href="https://github.com/Arturoac74/ohtli-imss"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#6B1D2F] font-bold hover:underline flex items-center gap-1"
              >
                Ir a mi repositorio en GitHub
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
