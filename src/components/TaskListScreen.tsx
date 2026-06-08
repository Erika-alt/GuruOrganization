import React, { useState, useMemo } from 'react';
import { TaskList, UserSession } from '../types';
import { 
  Menu, 
  CircleUser, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Search,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  TrendingUp,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskListScreenProps {
  tasks: TaskList[];
  onSelectTask: (task: TaskList) => void;
  onAddTaskClick: () => void;
  onProfileClick: () => void;
  onMenuClick: () => void;
  userSession: UserSession;
}

export default function TaskListScreen({
  tasks,
  onSelectTask,
  onAddTaskClick,
  onProfileClick,
  onMenuClick,
  userSession
}: TaskListScreenProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Compras': true,
    'Produtos': false,
    'Provas': false,
    'Materiais': false,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('Todas');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Group tasks by category
  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    tasks.forEach(t => cats.add(t.category));
    // Core categories first
    const ordered = ['Compras', 'Produtos', 'Provas', 'Materiais'];
    cats.forEach(c => {
      if (!ordered.includes(c)) ordered.push(c);
    });
    return ordered;
  }, [tasks]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = selectedPriority === 'Todas' || task.priority === selectedPriority;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchTerm, selectedPriority]);

  // Overall counts
  const totalSubTasksCount = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.subTasks.length, 0);
  }, [tasks]);

  const completedSubTasksCount = useMemo(() => {
    return tasks.reduce((sum, task) => {
      return sum + task.subTasks.filter(st => st.completed).length;
    }, 0);
  }, [tasks]);

  // Task list progress calculation
  const getTaskProgress = (task: TaskList) => {
    if (task.subTasks.length === 0) return 0;
    const completed = task.subTasks.filter(st => st.completed).length;
    return Math.round((completed / task.subTasks.length) * 100);
  };

  // Determine status label visually
  const getStatusLabel = (progress: number) => {
    if (progress === 100) return { text: 'Concluído', color: '#6fd1d7', textClass: 'text-[#0c3d5e]', bgClass: 'bg-[#6fd1d7]/20 border border-[#6fd1d7]/30' };
    if (progress === 0) return { text: 'Pendente', color: '#dadadd', textClass: 'text-[#42474e]', bgClass: 'bg-[#dadadd]/30 border border-[#dadadd]/40' };
    return { text: 'Processo', color: '#2e90c9', textClass: 'text-[#0c3d5e]', bgClass: 'bg-[#2e90c9]/15 border border-[#2e90c9]/30' };
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#f9f9fc] flex flex-col relative pb-32 pt-2" id="task-list-screen-root">
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 py-4" id="task-list-header">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl hover:bg-neutral-200/50 transition-colors pointer-events-auto"
          aria-label="Menu"
          id="btn-menu"
        >
          <Menu size={24} className="text-[#0c3d5e]" />
        </button>
        <span className="font-sans font-bold text-lg tracking-tight text-[#0c3d5e]" id="brand-title">
          {userSession.isLoggedIn ? `Guru de ${userSession.username}` : 'Guru Organização'}
        </span>
        <button 
          onClick={onProfileClick}
          className="p-2 -mr-2 rounded-xl hover:bg-neutral-200/50 transition-colors relative"
          aria-label="Perfil"
          id="btn-profile"
        >
          {userSession.isLoggedIn && userSession.avatarUrl ? (
            <img 
              src={userSession.avatarUrl} 
              alt="Avatar" 
              className="w-7 h-7 rounded-full object-cover border border-[#0c3d5e]/20"
              referrerPolicy="no-referrer"
            />
          ) : (
            <CircleUser size={24} className="text-[#0c3d5e]" />
          )}
          {userSession.isLoggedIn && (
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-[#6fd1d7] border-2 border-white rounded-full"></span>
          )}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-6 flex flex-col" id="task-list-main-content">
        {/* Title and summary header */}
        <div className="mt-4 mb-6 flex justify-between items-end" id="task-list-summary-header">
          <div>
            <h1 className="font-sans text-[30px] font-extrabold leading-[38px] tracking-[-0.02em] text-[#0c3d5e]" id="title-main-tasks">
              MINHAS TAREFAS
            </h1>
          </div>
          <p className="text-sm font-medium text-[#42474e] mb-1" id="text-completion-summary">
            {completedSubTasksCount} de {totalSubTasksCount} concluídas
          </p>
        </div>

        {/* Filters and search section */}
        <div className="mb-6 flex gap-2 items-center flex-wrap" id="filters-container">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-sm font-semibold transition-all shadow-md active:scale-95 ${
              selectedPriority !== 'Todas' || searchTerm 
                ? 'bg-[#2e90c9] text-white' 
                : 'bg-white text-[#0c3d5e] border border-[#0c3d5e]/10'
            }`}
            style={{ boxShadow: '0 4px 20px rgba(12, 61, 94, 0.05)' }}
            id="btn-filter-trigger"
          >
            <SlidersHorizontal size={16} />
            <span>Filtrar</span>
            {(selectedPriority !== 'Todas' || searchTerm) && (
              <span className="bg-[#6fd1d7] text-[#0c3d5e] text-xs px-1.5 py-0.5 rounded-full font-bold ml-1">
                !
              </span>
            )}
          </button>

          {/* Quick Search Pill */}
          <div className="flex-1 relative">
            <input 
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#0c3d5e]/10 pl-9 pr-4 py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#2e90c9] shadow-inner font-sans"
              id="input-quick-search"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-neutral-100"
                id="btn-clear-search"
              >
                <X size={12} className="text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Overlay panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-5 bg-white p-4 rounded-2xl shadow-lg border border-[#0c3d5e]/10 overflow-hidden"
              id="filter-panel"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-[#0c3d5e] uppercase tracking-wider">Prioridades</span>
                <button 
                  onClick={() => { setSelectedPriority('Todas'); setSearchTerm(''); }}
                  className="text-xs text-[#2e90c9] font-semibold hover:underline"
                >
                  Limpar Filtros
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['Todas', 'Alta', 'Média', 'Baixa'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setSelectedPriority(priority)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedPriority === priority
                        ? 'bg-[#0c3d5e] text-white'
                        : 'bg-[#f3f3f6] text-[#42474e] hover:bg-neutral-200'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grouped lists and categories */}
        <div className="flex flex-col gap-4" id="categories-accordion-group">
          {categoriesList.map((category) => {
            const categoryTasks = filteredTasks.filter(t => t.category === category);
            const isExpanded = expandedCategories[category] || false;
            
            // Skip empty categories if filtering of search matches is active
            if (categoryTasks.length === 0 && (searchTerm || selectedPriority !== 'Todas')) {
              return null;
            }

            return (
              <div key={category} className="mb-2" id={`category-container-${category.toLowerCase()}`}>
                {/* Category Header */}
                <button 
                  onClick={() => toggleCategory(category)}
                  className="w-full flex justify-between items-center py-2.5 group hover:opacity-80 transition-opacity"
                  id={`btn-toggle-category-${category.toLowerCase()}`}
                >
                  <span className="font-sans font-bold italic text-lg tracking-wide text-[#2e90c9] group-hover:translate-x-1 transition-transform">
                    {category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-[#eeedf1] px-2 py-0.5 rounded-full text-[#42474e]">
                      {categoryTasks.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={20} className="text-neutral-500" />
                    ) : (
                      <ChevronRight size={20} className="text-neutral-500" />
                    )}
                  </div>
                </button>

                {/* Task Cards Under Category */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="flex flex-col gap-3.5 mt-2 pl-1 overflow-hidden"
                      id={`cards-group-${category.toLowerCase()}`}
                    >
                      {categoryTasks.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic py-2 pl-2">
                          Nenhuma tarefa nesta categoria.
                        </p>
                      ) : (
                        categoryTasks.map((task) => {
                          const progress = getTaskProgress(task);
                          const status = getStatusLabel(progress);

                          return (
                            <motion.div
                              onClick={() => onSelectTask(task)}
                              key={task.id}
                              whileHover={{ y: -3, scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100/55 cursor-pointer flex flex-col justify-between transition-all select-none"
                              style={{ 
                                boxShadow: '0 10px 25px rgba(12, 61, 94, 0.04)',
                              }}
                              id={`task-card-${task.id}`}
                            >
                              {/* Top row */}
                              <div className="flex justify-between items-start gap-4 mb-4">
                                <h3 className="font-sans font-bold text-base text-[#0c3d5e] leading-tight flex-1">
                                  {task.title}
                                </h3>
                                
                                {/* Dynamic Badge status */}
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${status.bgClass} ${status.textClass}`}>
                                  {progress === 100 ? (
                                    <span className="w-1.5 h-1.5 bg-[#6fd1d7] rounded-full"></span>
                                  ) : progress === 0 ? (
                                    <span className="w-1.5 h-1.5 bg-[#dadadd] border border-neutral-400 rounded-full"></span>
                                  ) : (
                                    <span className="w-1.5 h-1.5 bg-[#2e90c9] rounded-full animate-pulse"></span>
                                  )}
                                  {status.text}
                                </span>
                              </div>

                              {/* Progress bar */}
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full rounded-full"
                                    style={{ 
                                      backgroundColor: progress === 100 ? '#6fd1d7' : progress === 0 ? '#dadadd' : '#2e90c9'
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.4 }}
                                  />
                                </div>
                                <span className="text-xs font-bold font-mono text-[#0c3d5e] min-w-[32px] text-right">
                                  {progress}%
                                </span>
                              </div>

                              {/* Footer Meta items (Sub-task ratio + priority) */}
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-dotted border-neutral-100 text-[11px] font-medium text-[#42474e]">
                                <span>
                                  {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length} sub-tarefas
                                </span>
                                <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                                  task.priority === 'Alta' 
                                    ? 'text-red-600 bg-red-50' 
                                    : task.priority === 'Média' 
                                      ? 'text-amber-600 bg-amber-50' 
                                      : 'text-emerald-600 bg-emerald-50'
                                }`}>
                                  Prioridade {task.priority}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Action Button for creation */}
      <motion.button
        onClick={onAddTaskClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#0c3d5e] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#002740] transition-all z-20"
        style={{ boxShadow: '0 8px 30px rgba(12, 61, 94, 0.3)' }}
        aria-label="Nova Tarefa"
        id="btn-fab-add"
      >
        <Plus size={28} />
      </motion.button>
    </div>
  );
}
