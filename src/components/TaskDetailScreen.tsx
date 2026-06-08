import React, { useState } from 'react';
import { TaskList, SubTask } from '../types';
import { 
  ChevronLeft, 
  MoreVertical, 
  Calendar, 
  Trash2, 
  Plus, 
  Check, 
  Tag, 
  PenTool, 
  X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskDetailScreenProps {
  task: TaskList;
  onBack: () => void;
  onUpdateTask: (task: TaskList) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskDetailScreen({
  task,
  onBack,
  onUpdateTask,
  onDeleteTask
}: TaskDetailScreenProps) {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState(task.description);

  // Toggle single subtask check status
  const handleToggleSubTask = (subTaskId: string) => {
    const updatedSubTasks = task.subTasks.map(st => {
      if (st.id === subTaskId) {
        return { ...st, completed: !st.completed };
      }
      return st;
    });

    onUpdateTask({
      ...task,
      subTasks: updatedSubTasks
    });
  };

  // Add new subtask
  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTaskTitle.trim()) return;

    const newSub: SubTask = {
      id: `sub-task-${Date.now()}`,
      title: newSubTaskTitle.trim(),
      completed: false
    };

    onUpdateTask({
      ...task,
      subTasks: [...task.subTasks, newSub]
    });
    setNewSubTaskTitle('');
  };

  // Delete subtask
  const handleDeleteSubTask = (subTaskId: string) => {
    onUpdateTask({
      ...task,
      subTasks: task.subTasks.filter(st => st.id !== subTaskId)
    });
  };

  // Update priority
  const handleUpdatePriority = (priority: 'Baixa' | 'Média' | 'Alta') => {
    onUpdateTask({
      ...task,
      priority
    });
  };

  // Save description
  const handleSaveDescription = () => {
    onUpdateTask({
      ...task,
      description: editedDesc
    });
    setIsEditingDesc(false);
  };

  const completedCount = task.subTasks.filter(st => st.completed).length;
  const totalCount = task.subTasks.length;

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#f9f9fc] flex flex-col relative pb-32 pt-2" id="task-detail-screen">
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 py-4" id="detail-header">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-[#eeedf1] transition-colors"
          aria-label="Voltar"
          id="btn-detail-back"
        >
          <ChevronLeft size={24} className="text-[#0c3d5e]" />
        </button>
        <h1 className="font-sans font-bold text-lg text-[#0c3d5e] max-w-[200px] truncate" id="task-detail-title">
          {task.title}
        </h1>
        <div className="relative">
          <button 
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className="p-2 -mr-2 rounded-xl hover:bg-[#eeedf1] transition-colors"
            aria-label="Opções"
            id="btn-detail-options"
          >
            <MoreVertical size={24} className="text-[#0c3d5e]" />
          </button>

          {/* Context Options Dropdown Menu */}
          <AnimatePresence>
            {isOptionsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsOptionsOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-40"
                  id="options-menu"
                >
                  <button 
                    onClick={() => {
                      setIsEditingDesc(true);
                      setIsOptionsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#0c3d5e] font-semibold hover:bg-[#f3f3f6] flex items-center gap-2"
                  >
                    <PenTool size={16} />
                    Editar Descrição
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Excluir esta tarefa permanentemente?')) {
                        onDeleteTask(task.id);
                        onBack();
                      }
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#ba1a1a] font-semibold hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Excluir Tarefa
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Form Fields */}
      <main className="flex-1 px-6 flex flex-col gap-6" id="detail-main-content">
        
        {/* DESCRIÇÃO SECTION */}
        <section id="section-detail-desc">
          <h2 className="text-[#0c3d5e] uppercase tracking-wider text-xs font-bold mb-2.5 flex items-center gap-1.5" id="label-detail-desc">
            <FileText size={14} className="text-[#2e90c9]" />
            Descrição
          </h2>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100" style={{ boxShadow: '0 10px 25px rgba(12, 61, 94, 0.03)' }}>
            {isEditingDesc ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  className="w-full text-sm leading-relaxed text-[#1a1c1e] bg-[#f3f3f6] border-none rounded-xl p-3 focus:ring-2 focus:ring-[#2e90c9] min-h-[100px]"
                  placeholder="Escreva detalhes da tarefa..."
                />
                <div className="flex justify-end gap-2 text-xs font-bold">
                  <button 
                    onClick={() => setIsEditingDesc(false)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 text-[#42474e] hover:bg-neutral-100"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveDescription}
                    className="px-3 py-1.5 rounded-lg bg-[#2e90c9] text-white hover:bg-[#207cb1]"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm font-medium leading-relaxed text-[#42474e]" id="text-detail-desc">
                {task.description || 'Nenhuma descrição adicionada. Adicione detalhes no menu superior.'}
              </p>
            )}
          </div>
        </section>

        {/* PRAZO SECTION */}
        <section id="section-detail-prazo">
          <h2 className="text-[#0c3d5e] uppercase tracking-wider text-xs font-bold mb-2.5 flex items-center gap-1.5" id="label-detail-prazo">
            <Calendar size={14} className="text-[#2e90c9]" />
            Prazo
          </h2>
          <div className="grid grid-cols-2 gap-4" id="prazos-grid">
            {/* Start Date card */}
            <div 
              className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-3.5" 
              style={{ boxShadow: '0 10px 25px rgba(12, 61, 94, 0.03)' }}
              id="start-date-card"
            >
              <div className="p-2.5 bg-[#f3f3f6] text-[#2e90c9] rounded-xl">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[#42474e]">Início</span>
                <span className="text-sm font-bold text-[#0c3d5e] mt-0.5">{task.startDate || '--/--/----'}</span>
              </div>
            </div>

            {/* End Date card */}
            <div 
              className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-3.5" 
              style={{ boxShadow: '0 10px 25px rgba(12, 61, 94, 0.03)' }}
              id="end-date-card"
            >
              <div className="p-2.5 bg-[#f3f3f6] text-[#2e90c9] rounded-xl">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[#42474e]">Fim</span>
                <span className="text-sm font-bold text-[#0c3d5e] mt-0.5">{task.endDate || '--/--/----'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRIORIZAÇÃO SECTION */}
        <section id="section-detail-priority">
          <h2 className="text-[#0c3d5e] uppercase tracking-wider text-xs font-bold mb-2.5 flex items-center gap-1.5" id="label-detail-priority">
            <Tag size={14} className="text-[#2e90c9]" />
            Priorização
          </h2>
          <div className="flex flex-col gap-3" id="priority-options-stack">
            {/* Baixa option */}
            <button
              onClick={() => handleUpdatePriority('Baixa')}
              className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all ${
                task.priority === 'Baixa'
                  ? 'bg-emerald-50 border-[1.5px] border-emerald-500 text-emerald-800'
                  : 'bg-white border border-neutral-100 text-[#1a1c1e] hover:bg-neutral-50/70'
              }`}
              style={{ boxShadow: '0 8px 20px rgba(12, 61, 94, 0.02)' }}
              id="priority-option-low"
            >
              <span className="font-bold text-sm tracking-wide">Baixa</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                task.priority === 'Baixa' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-neutral-300'
              }`}>
                {task.priority === 'Baixa' && <Check size={12} strokeWidth={3} />}
              </div>
            </button>

            {/* Média option - Highlighted state matches screen 3 mockup perfectly with blue border/fill */}
            <button
              onClick={() => handleUpdatePriority('Média')}
              className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all ${
                task.priority === 'Média'
                  ? 'bg-[#2e90c9]/10 border-2 border-[#2e90c9] text-[#0c3d5e]'
                  : 'bg-white border border-neutral-100 text-[#1a1c1e] hover:bg-neutral-50/70'
              }`}
              style={{ boxShadow: '0 8px 20px rgba(12, 61, 94, 0.02)' }}
              id="priority-option-medium"
            >
              <span className="font-bold text-sm tracking-wide">Média</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                task.priority === 'Média' ? 'border-[#2e90c9] bg-[#2e90c9] text-white' : 'border-neutral-300'
              }`}>
                {task.priority === 'Média' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
              </div>
            </button>

            {/* Alta option */}
            <button
              onClick={() => handleUpdatePriority('Alta')}
              className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all ${
                task.priority === 'Alta'
                  ? 'bg-red-50 border-[1.5px] border-red-500 text-red-800'
                  : 'bg-white border border-neutral-100 text-[#1a1c1e] hover:bg-neutral-50/70'
              }`}
              style={{ boxShadow: '0 8px 20px rgba(12, 61, 94, 0.02)' }}
              id="priority-option-high"
            >
              <span className="font-bold text-sm tracking-wide">Alta</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                task.priority === 'Alta' ? 'border-red-500 bg-red-500 text-white' : 'border-neutral-300'
              }`}>
                {task.priority === 'Alta' && <Check size={12} strokeWidth={3} />}
              </div>
            </button>
          </div>
        </section>

        {/* TAREFAS (SUB-TASKS) SECTION */}
        <section id="section-detail-subtasks" className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[#0c3d5e] uppercase tracking-wider text-xs font-bold flex items-center gap-1.5" id="label-detail-subtasks">
              <Check className="text-[#2e90c9]" size={14} />
              Tarefas
            </h2>
            <span className="bg-[#0c3d5e] text-white font-bold text-xs px-2.5 py-1 rounded-full" id="detail-subtasks-count-pill">
              {completedCount}/{totalCount}
            </span>
          </div>

          <div className="flex flex-col gap-3" id="subtasks-container">
            {/* List all items */}
            {task.subTasks.length === 0 ? (
              <p className="text-sm italic text-neutral-400 py-3 pl-1">
                Nenhuma sub-tarefa criada. Adicione uma no campo abaixo!
              </p>
            ) : (
              task.subTasks.map((subTask) => (
                <div
                  key={subTask.id}
                  className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-neutral-100/60 group hover:bg-neutral-50/40 transition-colors"
                  style={{ boxShadow: '0 8px 20px rgba(12, 61, 94, 0.02)' }}
                  id={`subtask-row-${subTask.id}`}
                >
                  {/* Left part: Custom Checkbox & Strikethrough Text */}
                  <div 
                    onClick={() => handleToggleSubTask(subTask.id)}
                    className="flex-1 flex items-center gap-4 cursor-pointer select-none"
                  >
                    {/* Checkbox circle: empty representing todo, filled Cyan with check representing completed */}
                    <div 
                      className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                        subTask.completed 
                          ? 'bg-[#6fd1d7] border-[#6fd1d7] text-white shadow-md shadow-[#6fd1d7]/20 scale-105' 
                          : 'border-[#2e90c9] border-[1.5px] hover:border-[#0c3d5e]'
                      }`}
                    >
                      {subTask.completed && <Check size={12} strokeWidth={3.5} />}
                    </div>
                    <span className={`text-sm font-semibold tracking-wide transition-all ${
                      subTask.completed ? 'line-through text-neutral-400 font-normal' : 'text-[#1a1c1e]'
                    }`}>
                      {subTask.title}
                    </span>
                  </div>

                  {/* Right part: Delete trash icon */}
                  <button
                    onClick={() => handleDeleteSubTask(subTask.id)}
                    className="p-2 ml-2 text-neutral-400 hover:text-red-500 rounded-xl hover:bg-neutral-100 active:scale-90 transition-all opacity-80 group-hover:opacity-100"
                    aria-label="Deletar sub-tarefa"
                    id={`btn-delete-subtask-${subTask.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}

            {/* Input to add sub-task */}
            <form onSubmit={handleAddSubTask} className="flex gap-2.5 mt-2" id="add-subtask-form">
              <div className="flex-1 bg-[#f3f3f6] rounded-2xl flex items-center px-4 py-3 shadow-inner">
                <PenTool size={16} className="text-neutral-400 mr-2.5" />
                <input
                  type="text"
                  placeholder="Nome da sub-tarefa..."
                  value={newSubTaskTitle}
                  onChange={(e) => setNewSubTaskTitle(e.target.value)}
                  className="flex-1 bg-transparent border-none text-sm font-medium text-[#1a1c1e] placeholder-neutral-400 focus:outline-none"
                  id="input-new-subtask-name"
                />
              </div>
              <button
                type="submit"
                disabled={!newSubTaskTitle.trim()}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-md ${
                  newSubTaskTitle.trim() 
                    ? 'bg-[#0c3d5e] hover:bg-[#002740] active:scale-95 hover:shadow-lg' 
                    : 'bg-neutral-300 cursor-not-allowed shadow-none'
                }`}
                style={{ boxShadow: newSubTaskTitle.trim() ? '0 5px 15px rgba(12, 61, 94, 0.15)' : 'none' }}
                id="btn-add-subtask-submit"
              >
                <Plus size={20} />
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}
