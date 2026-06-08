import React, { useState, useEffect } from 'react';
import { TaskList, UserSession } from './types';
import { INITIAL_TASK_LISTS } from './initialData';
import TaskListScreen from './components/TaskListScreen';
import TaskDetailScreen from './components/TaskDetailScreen';
import CreateTaskScreen from './components/CreateTaskScreen';
import StatisticsScreen from './components/StatisticsScreen';
import ProfileScreen from './components/ProfileScreen';
import { 
  CheckCircle, 
  PlusCircle, 
  BarChart2, 
  User, 
  X,
  HelpCircle,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Tabs: 'tarefas' | 'criar' | 'desempenho' | 'perfil'
  const [currentTab, setCurrentTab] = useState<'tarefas' | 'criar' | 'desempenho' | 'perfil'>('tarefas');
  
  // App primary state
  const [tasks, setTasks] = useState<TaskList[]>([]);
  const [userSession, setUserSession] = useState<UserSession>({ isLoggedIn: false });
  const [selectedTask, setSelectedTask] = useState<TaskList | null>(null);

  // Layout Drawers/Overlays state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIntroDismissed, setIsIntroDismissed] = useState(() => {
    return localStorage.getItem('guru-intro-dismissed') === 'true';
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('guru-tasks-store');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (err) {
        setTasks(INITIAL_TASK_LISTS);
      }
    } else {
      setTasks(INITIAL_TASK_LISTS);
      localStorage.setItem('guru-tasks-store', JSON.stringify(INITIAL_TASK_LISTS));
    }

    const storedUser = localStorage.getItem('guru-user-session');
    if (storedUser) {
      try {
        setUserSession(JSON.parse(storedUser));
      } catch (err) {
        setUserSession({ isLoggedIn: false });
      }
    }
  }, []);

  // Save tasks and session to localStorage on updates
  const handleUpdateTasks = (newTasks: TaskList[]) => {
    setTasks(newTasks);
    localStorage.setItem('guru-tasks-store', JSON.stringify(newTasks));
    
    // Update active selectedTask if editing in detail view
    if (selectedTask) {
      const match = newTasks.find(t => t.id === selectedTask.id);
      if (match) setSelectedTask(match);
    }
  };

  const handleUpdateSession = (newSession: UserSession) => {
    setUserSession(newSession);
    localStorage.setItem('guru-user-session', JSON.stringify(newSession));
  };

  const handleLogout = () => {
    const emptySession = { isLoggedIn: false };
    setUserSession(emptySession);
    localStorage.setItem('guru-user-session', JSON.stringify(emptySession));
    setCurrentTab('perfil');
    setIsMenuOpen(false);
  };

  // Task creation
  const handleSaveNewTask = (newTask: TaskList) => {
    const updated = [newTask, ...tasks];
    handleUpdateTasks(updated);
    setCurrentTab('tarefas');
  };

  // Task update
  const handleUpdateSingleTask = (updatedTask: TaskList) => {
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    handleUpdateTasks(updated);
  };

  // Task deletion
  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    handleUpdateTasks(updated);
    setSelectedTask(null);
  };

  const dismissIntro = () => {
    setIsIntroDismissed(true);
    localStorage.setItem('guru-intro-dismissed', 'true');
  };

  // Navigation handlers
  const handleTabChange = (tab: 'tarefas' | 'criar' | 'desempenho' | 'perfil') => {
    setCurrentTab(tab);
    // Clear details screen selection when clicking away
    if (tab !== 'tarefas') {
      setSelectedTask(null);
    }
  };

  // Render correct dashboard screen according to current tab state
  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'tarefas':
        if (selectedTask) {
          return (
            <TaskDetailScreen
              task={selectedTask}
              onBack={() => setSelectedTask(null)}
              onUpdateTask={handleUpdateSingleTask}
              onDeleteTask={handleDeleteTask}
            />
          );
        }
        return (
          <TaskListScreen
            tasks={tasks}
            onSelectTask={(task) => setSelectedTask(task)}
            onAddTaskClick={() => setCurrentTab('criar')}
            onProfileClick={() => setCurrentTab('perfil')}
            onMenuClick={() => setIsMenuOpen(true)}
            userSession={userSession}
          />
        );
      case 'criar':
        return (
          <CreateTaskScreen
            onBack={() => setCurrentTab('tarefas')}
            onSaveTask={handleSaveNewTask}
          />
        );
      case 'desempenho':
        return (
          <StatisticsScreen
            tasks={tasks}
            onProfileClick={() => setCurrentTab('perfil')}
            onMenuClick={() => setIsMenuOpen(true)}
            userSession={userSession}
          />
        );
      case 'perfil':
        return (
          <ProfileScreen
            userSession={userSession}
            onUpdateSession={handleUpdateSession}
            onLogout={handleLogout}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9fc] flex flex-col justify-start items-center relative" id="app-applet-root">
      
      {/* Mobile viewport frame wrapper to match sketch screenshots correctly (max-w-md styling) */}
      <div className="w-full max-w-md min-h-screen bg-[#f9f9fc] flex flex-col shadow-xl border-x border-[#eeedf1] relative overflow-hidden" id="viewport-frame-mock">
        
        {/* Interactive Top Welcome Alert Card */}
        <AnimatePresence>
          {!isIntroDismissed && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-[#0c3d5e] to-[#2e90c9] text-white px-5 py-4 flex gap-3 items-start z-50 shadow-md relative"
              id="intro-alert-card"
            >
              <Info size={18} className="text-[#6fd1d7] shrink-0 mt-0.5" />
              <div className="flex-1 pr-6">
                <p className="text-xs font-bold font-sans tracking-wide">
                  Seja bem-vindo ao Guru Organização!
                </p>
                <p className="text-[11px] font-medium leading-relaxed opacity-90 mt-1">
                  Navegue nos botões inferiores para alternar entre as telas de Tarefas, Criação, Desempenho e Perfil. Clique nas listas para gerenciar suas sub-tarefas e prioridades.
                </p>
              </div>
              <button 
                onClick={dismissIntro}
                className="absolute right-3 top-3 p-1 rounded-full text-white/80 hover:text-white"
                id="btn-intro-dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Screen viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden" id="screen-viewport">
          {renderCurrentScreen()}
        </div>

        {/* =========================================================
           FLOATING NAVIGATION BAR: Bottom detachable white pill
           ========================================================= */}
        <nav 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[360px] bg-white rounded-[32px] py-2 px-3 shadow-2xl border border-neutral-100 flex justify-between items-center z-30"
          style={{ 
            boxShadow: '0 12px 35px rgba(12, 61, 94, 0.12)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          id="floating-navigation-bar"
        >
          {/* Item 1: Tarefas */}
          <button
            onClick={() => handleTabChange('tarefas')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative transition-all duration-200 outline-none select-none`}
            id="tab-btn-tarefas"
          >
            {currentTab === 'tarefas' ? (
              <motion.div 
                layoutId="active-tab-indicator"
                className="absolute inset-x-1 inset-y-0.5 bg-[#0c3d5e] rounded-full z-0 h-11"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            ) : null}
            <div className={`relative z-10 flex flex-col items-center ${currentTab === 'tarefas' ? 'text-white' : 'text-[#42474e] hover:text-[#0c3d5e]'}`}>
              <CheckCircle size={18} className="transition-transform duration-200" />
              <span className="text-[10px] font-bold mt-1 tracking-wide font-sans leading-none">Tarefas</span>
            </div>
          </button>

          {/* Item 2: Criar */}
          <button
            onClick={() => handleTabChange('criar')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative transition-all duration-200 outline-none select-none`}
            id="tab-btn-criar"
          >
            {currentTab === 'criar' ? (
              <motion.div 
                layoutId="active-tab-indicator"
                className="absolute inset-x-1 inset-y-0.5 bg-[#0c3d5e] rounded-full z-0 h-11"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            ) : null}
            <div className={`relative z-10 flex flex-col items-center ${currentTab === 'criar' ? 'text-white' : 'text-[#42474e] hover:text-[#0c3d5e]'}`}>
              <PlusCircle size={18} className="transition-transform duration-200" />
              <span className="text-[10px] font-bold mt-1 tracking-wide font-sans leading-none">Criar</span>
            </div>
          </button>

          {/* Item 3: Desempenho */}
          <button
            onClick={() => handleTabChange('desempenho')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative transition-all duration-200 outline-none select-none`}
            id="tab-btn-desempenho"
          >
            {currentTab === 'desempenho' ? (
              <motion.div 
                layoutId="active-tab-indicator"
                className="absolute inset-x-1 inset-y-0.5 bg-[#0c3d5e] rounded-full z-0 h-11"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            ) : null}
            <div className={`relative z-10 flex flex-col items-center ${currentTab === 'desempenho' ? 'text-white' : 'text-[#42474e] hover:text-[#0c3d5e]'}`}>
              <BarChart2 size={18} className="transition-transform duration-200" />
              <span className="text-[10px] font-bold mt-1 tracking-wide font-sans leading-none">Desempenho</span>
            </div>
          </button>

          {/* Item 4: Perfil */}
          <button
            onClick={() => handleTabChange('perfil')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative transition-all duration-200 outline-none select-none`}
            id="tab-btn-perfil"
          >
            {currentTab === 'perfil' ? (
              <motion.div 
                layoutId="active-tab-indicator"
                className="absolute inset-x-1 inset-y-0.5 bg-[#0c3d5e] rounded-full z-0 h-11"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            ) : null}
            <div className={`relative z-10 flex flex-col items-center ${currentTab === 'perfil' ? 'text-white' : 'text-[#42474e] hover:text-[#0c3d5e]'}`}>
              <User size={18} className="transition-transform duration-200" />
              <span className="text-[10px] font-bold mt-1 tracking-wide font-sans leading-none">Perfil</span>
            </div>
          </button>
        </nav>

        {/* =========================================================
           SIDEBAR DRAWER MENU: Premium instructions list
           ========================================================= */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Dark backdrop overlay close trigger */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="absolute inset-0 bg-[#0c3d5e] z-40 cursor-pointer"
                id="sidebar-backdrop"
              />

              {/* Real botanical sidebar panel with list info */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="absolute top-0 bottom-0 left-0 w-4/5 max-w-[290px] bg-white z-50 flex flex-col p-6 shadow-2xl rounded-r-[32px] border-r border-[#eeedf1]"
                id="sidebar-drawer-panel"
              >
                {/* Drawer close header button */}
                <div className="flex justify-between items-center mb-6" id="sidebar-header">
                  <div className="flex gap-2 items-center text-[#0c3d5e]">
                    <Sparkles size={18} className="text-[#6fd1d7]" />
                    <span className="font-bold text-sm tracking-wide font-sans">Menu Sereno</span>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 -mr-2 rounded-xl hover:bg-neutral-100 text-neutral-500 transition-colors"
                    id="btn-sidebar-close"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mindfulness guidelines */}
                <div className="flex-1 flex flex-col gap-6" id="sidebar-info-stack">
                  <div>
                    <h3 className="text-[#0c3d5e] text-xs font-bold uppercase tracking-wider mb-2">Filosofia</h3>
                    <p className="text-xs font-medium text-[#42474e] leading-relaxed">
                      Este sistema foi criado para afastar o ritmo acelerado e restaurar sua clareza cognitiva de forma gradual e leve, como um diário pessoal no papel.
                    </p>
                  </div>

                  <div className="h-px bg-neutral-100" />

                  {/* Manual guidelines */}
                  <div>
                    <h3 className="text-[#0c3d5e] text-xs font-bold uppercase tracking-wider mb-3">Guia Rápido</h3>
                    <ul className="flex flex-col gap-2.5 text-xs font-semibold text-[#42474e]">
                      <li className="flex gap-2 items-start">
                        <span className="w-1.5 h-1.5 bg-[#6fd1d7] rounded-full mt-1.5 shrink-0"></span>
                        <span>Os gráficos e taxas ajustam-se dinamicamente conforme você conclui sub-tarefas.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="w-1.5 h-1.5 bg-[#2e90c9] rounded-full mt-1.5 shrink-0"></span>
                        <span>Acesse a aba <strong>Perfil</strong> para fazer login e personalizar o foco zen ativo.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="w-1.5 h-1.5 bg-[#0c3d5e] rounded-full mt-1.5 shrink-0"></span>
                        <span>Use filtros rápidos e a busca por palavras-chave na barra superior.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="h-px bg-neutral-100" />

                  {/* App Status info badge */}
                  <div className="bg-[#f3f3f6] p-4 rounded-2xl flex flex-col gap-2" id="sidebar-status-box">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Status do Mecanismo</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span className="text-xs font-bold text-[#0c3d5e]">Local offline ativo</span>
                    </div>
                  </div>
                </div>

                {/* Footer items */}
                <div className="mt-auto pt-4 border-t border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase text-center tracking-wider">
                  © 2026 GURU ORGANIZAÇÃO
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
