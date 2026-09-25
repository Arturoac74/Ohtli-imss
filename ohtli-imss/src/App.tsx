import React, { useState } from 'react';
import { UserRole, AppViewMode, TaskItem, ResidentProtocolSubmission } from './types/ohtli';
import {
  INITIAL_GAMIFICATION,
  INITIAL_PHASES,
  EDUCATIONAL_CAPSULES,
  UMBRELLA_PROJECTS,
  RESIDENT_SUBMISSIONS,
  DELEGATION_HEATMAP,
} from './data/mockData';

import { LandingPage } from './components/LandingPage';
import { OhtliHeader } from './components/OhtliHeader';
import { ResidentView } from './components/ResidentView';
import { DocenteView } from './components/DocenteView';
import { DirectivoView } from './components/DirectivoView';
import { GeoMapModule } from './components/GeoMapModule';
import { EducationalHub } from './components/EducationalHub';
import { GamificationView } from './components/GamificationView';
import { EvaluationsView } from './components/EvaluationsView';
import { UserManagementView } from './components/UserManagementView';
import { ProtocolRepositoryView } from './components/ProtocolRepositoryView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserIdentifier, setCurrentUserIdentifier] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<UserRole>('RESIDENTE');
  const [currentView, setCurrentView] = useState<AppViewMode>('dashboard');
  const [gamification, setGamification] = useState(INITIAL_GAMIFICATION);
  const [phases, setPhases] = useState(INITIAL_PHASES);
  const [submissions, setSubmissions] = useState<ResidentProtocolSubmission[]>(RESIDENT_SUBMISSIONS);
  const [educationalCapsules] = useState(EDUCATIONAL_CAPSULES);
  const [umbrellaProjects] = useState(UMBRELLA_PROJECTS);
  const [heatmapData] = useState(DELEGATION_HEATMAP);

  // Asynchronous Offline-First Sync Simulation
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const handleLogin = (role: UserRole, userIdentifier: string) => {
    setCurrentRole(role);
    setCurrentUserIdentifier(userIdentifier);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);

    // If coming back online, clear pending sync queue automatically
    if (nextState && pendingSyncCount > 0) {
      setTimeout(() => {
        setPendingSyncCount(0);
      }, 1200);
    }
  };

  const handleTaskToggle = (phaseId: string, taskId: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;

        const updatedTasks = phase.tasks.map((task) => {
          if (task.id !== taskId) return task;
          return { ...task, completed: !task.completed };
        });

        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const newProgress = Math.round((completedCount / updatedTasks.length) * 100);

        return {
          ...phase,
          progressPercent: newProgress,
          tasks: updatedTasks,
        };
      })
    );
  };

  const handleTaskSubmit = (phaseId: string, task: TaskItem, fileNotes: string) => {
    // Mark task as completed
    handleTaskToggle(phaseId, task.id);

    // Award XP and handle level up
    setGamification((prev) => {
      const newXp = prev.xp + task.xpReward;
      let newLevel = prev.level;
      let nextLevelXp = prev.nextLevelXp;

      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        nextLevelXp += 1000;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp,
        totalSubmissions: prev.totalSubmissions + 1,
      };
    });

    // Create a new submission record
    const newSubmission: ResidentProtocolSubmission = {
      id: `sub_${Date.now()}`,
      residentName: 'Dr. Alejandro Morales (Tú)',
      residentYear: 'R1',
      hospitalUnit: 'HGZ No. 1 A Tlaltelolco',
      delegation: 'CDMX Norte',
      protocolTitle: task.title,
      submittedDate: new Date().toISOString().split('T')[0],
      phase: `R1: ${task.title}`,
      status: 'Pendiente',
      comments: fileNotes,
    };

    setSubmissions((prev) => [newSubmission, ...prev]);

    // If offline, increment pending sync queue
    if (!isOnline) {
      setPendingSyncCount((prev) => prev + 1);
    }
  };

  const handleEvaluateSubmission = (
    id: string,
    status: 'Aprobado' | 'Requiere Cambios',
    score: number,
    comment: string
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id !== id) return sub;
        return {
          ...sub,
          status,
          score,
          comments: comment,
          evaluatorName: 'Dra. Carmen Valdés (Tutor)',
        };
      })
    );
  };

  const handlePublishAnnouncement = (title: string, message: string) => {
    console.log('Comunicado enviado:', title, message);
  };

  const isAdmin = currentRole === 'DIRECTIVO';

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#1c1917] flex flex-col font-sans selection:bg-[#6B1D2F] selection:text-white">
      {/* Top Header & Branding */}
      <OhtliHeader
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentView={currentView}
        onViewChange={setCurrentView}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        pendingSyncCount={pendingSyncCount}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentView === 'dashboard' && (
          <>
            {currentRole === 'RESIDENTE' && (
              <ResidentView
                gamification={gamification}
                phases={phases}
                educationalCapsules={educationalCapsules}
                umbrellaProjects={umbrellaProjects}
                onTaskToggle={handleTaskToggle}
                onTaskSubmit={handleTaskSubmit}
                onNavigateView={setCurrentView}
                isOnline={isOnline}
              />
            )}

            {currentRole === 'DOCENTE' && (
              <DocenteView
                submissions={submissions}
                umbrellaProjects={umbrellaProjects}
                onEvaluateSubmission={handleEvaluateSubmission}
              />
            )}

            {currentRole === 'DIRECTIVO' && (
              <DirectivoView
                heatmapData={heatmapData}
                onPublishAnnouncement={handlePublishAnnouncement}
                onNavigateView={setCurrentView}
              />
            )}
          </>
        )}

        {currentView === 'geomap' && <GeoMapModule />}

        {currentView === 'admin_users' && (
          <UserManagementView
            currentUserRole={currentRole}
            isAdmin={isAdmin}
            onNavigateView={setCurrentView}
          />
        )}

        {currentView === 'protocols_repo' && (
          <ProtocolRepositoryView
            currentUserRole={currentRole}
          />
        )}

        {currentView === 'education' && (
          <EducationalHub capsules={educationalCapsules} />
        )}

        {currentView === 'gamification' && (
          <GamificationView gamification={gamification} />
        )}

        {currentView === 'evaluations' && (
          <EvaluationsView
            submissions={submissions}
            umbrellaProjects={umbrellaProjects}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] border-t border-[#6B1D2F]/15 py-6 mt-12 text-center text-xs text-[#1c1917]/70 space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#6B1D2F]">Ohtli 2.0</span>
            <span>— Estrategia de Capacitación en Investigación del IMSS</span>
          </div>
          <div className="text-[11px] font-semibold text-[#6B1D2F]">
            Instituto Mexicano del Seguro Social • Todos los derechos reservados (2026)
          </div>
        </div>
      </footer>
    </div>
  );
}
