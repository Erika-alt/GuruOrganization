import React, { useState } from 'react';
import { TaskList, SubTask } from '../types';
import { 
  Calendar, 
  Trash2, 
  Plus, 
  Check, 
  Tag, 
  PenTool, 
  ChevronDown, 
  ArrowLeft,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';

interface CreateTaskScreenProps {
  onBack: () => void;
  onSaveTask: (task: TaskList) => void;
}

export default function CreateTaskScreen({
  onBack,
  onSaveTask
}: CreateTaskScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Compras');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Média');
  
  // Sub-task states
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [currentSubTask, setCurrentSubTask] = useState('');

  const [isCategoryCustom, setIsCategoryCustom] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Handle adding internal subtask
  const handleAddSubTaskLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubTask.trim()) return;

    const newSub: SubTask = {
      id: `local-sub-${Date.now()}`,
      title: currentSubTask.trim(),
      completed: false
    };

    setSubTasks([...subTasks, newSub]);
    setCurrentSubTask('');
  };

  const handleDeleteSubTaskLocal = (id: string) => {
    setSubTasks(subTasks.filter(st => st.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor, defina um título para a sua tarefa.');
      return;
    }

    const finalCategory = isCategoryCustom ? (customCategory.trim() || 'Geral') : category;

    // format dates nicely if missing
    const finalStartDate = startDate ? formatDateToBR(startDate) : '15/10/2023';
    const finalEndDate = endDate ? formatDateToBR(endDate) : '22/10/2023';

    const newTask: TaskList = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Nenhuma descrição detalhada',
      category: finalCategory,
      startDate: finalStartDate,
      endDate: finalEndDate,
      priority,
      subTasks
    };

    onSaveTask(newTask);
  };

  // Convert YYYY-MM-DD input date to DD/MM/YYYY text
  const formatDateToBR = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#f9f9fc] flex flex-col relative pb-32 pt-2" id="create-task-screen">
      {/* Top Header */}
      <header className="flex items-center px-6 py-4 gap-4" id="create-header">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-[#eeedf1] transition-colors"
          aria-label="Voltar"
          id="btn-create-back"
        >
          <ArrowLeft size={24} className="text-[#0c3d5e]" />
        </button>
        <h1 className="font-sans font-bold text-lg text-[#0c3d5e]" id="create-task-heading">
          Voltar
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 flex flex-col gap-5 mt-2" id="create-main-content">
        {/* Title and subtitle */}
        <div>
          <h2 className="font-sans text-[30px] font-extrabold leading-[38px] tracking-[-0.02em] text-[#0c3d5e]" id="lbl-nova-tarefa">
            Nova Tarefa
          </h2>
          <p className="text-sm font-medium text-[#42474e] mt-2 block opacity-85" id="desc-nova-tarefa">
            Configure os detalhes do seu novo projeto ou objetivo.
          </p>
        </div>

        {/* Input Título */}
        <div className="flex flex-col gap-2" id="group-title">
          <label className="text-[#0c3d5e] font-bold text-xs uppercase tracking-wider" htmlFor="input-task-title">
            Nome da Tarefa / Projeto
          </label>
          <input
            id="input-task-title"
            type="text"
            placeholder="Ex: Compra de Materiais"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#eeedf1]/80 border-none rounded-2xl px-5 py-4 text-sm font-semibold text-[#1a1c1e] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2e90c9] transition-all"
          />
        </div>

        {/* Input Descrição */}
        <div className="flex flex-col gap-2" id="group-desc">
          <label className="text-[#0c3d5e] font-bold text-xs uppercase tracking-wider" htmlFor="input-task-desc">
            Descrição detalhada
          </label>
          <textarea
            id="input-task-desc"
            placeholder="Ex: Definir materiais essenciais para a pintura da parede da sala e pesquisar fornecedores..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#eeedf1]/80 border-none rounded-2xl px-5 py-4 text-sm font-medium text-[#1a1c1e] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2e90c9] min-h-[90px] transition-all"
          />
        </div>

        {/* Categoria Selector */}
        <div className="flex flex-col gap-2" id="group-category">
          <label className="text-[#0c3d5e] font-bold text-xs uppercase tracking-wider">
            Categoria
          </label>
          <div className="flex gap-2 flex-wrap mb-1" id="category-chips">
            {['Compras', 'Produtos', 'Provas', 'Materiais'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setIsCategoryCustom(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  category === cat && !isCategoryCustom
                    ? 'bg-[#0c3d5e] text-white shadow-sm'
                    : 'bg-white text-[#42474e] border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCategoryCustom(true)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isCategoryCustom
                  ? 'bg-[#0c3d5e] text-white shadow-sm'
                  : 'bg-white text-[#42474e] border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              Outro...
            </button>
          </div>

          {isCategoryCustom && (
            <motion.input
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              type="text"
              placeholder="Digite a categoria customizada..."
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full bg-[#eeedf1]/80 border-none rounded-2xl px-5 py-3 text-sm font-semibold text-[#1a1c1e] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2e90c9]"
              id="input-custom-category"
            />
          )}
        </div>

        {/* INÍCIO & FIM SECTION */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100/70" style={{ boxShadow: '0 10px 25px rgba(12, 61, 94, 0.02)' }} id="prazos-form-card">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Calendar size={12} className="text-[#2e90c9]" /> Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#f3f3f6] border-none rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-700 focus:outline-none"
                id="input-start-date"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Calendar size={12} className="text-[#2e90c9]" /> Fim
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#f3f3f6] border-none rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-700 focus:outline-none"
                id="input-end-date"
              />
            </div>
          </div>
        </div>

        {/* PRIORIZAÇÃO SECTION matching Screen 5 */}
        <section id="section-create-priority">
          <h3 className="text-[#0c3d5e] uppercase tracking-wider text-xs font-bold mb-3 flex items-center gap-1.5">
            <Tag size={14} className="text-[#2e90c9]" />
            Priorização
          </h3>

          <div className="flex flex-col gap-2.5" id="priority-create-options">
            {/* Low option */}
            <div
              onClick={() => setPriority('Baixa')}
              className={`p-3.5 rounded-2xl flex justify-between items-center cursor-pointer transition-all ${
                priority === 'Baixa'
                  ? 'bg-emerald-50 border-[1.5px] border-emerald-500 text-emerald-800'
                  : 'bg-[#f3f3f6] text-neutral-600 hover:bg-neutral-100'
              }`}
              id="create-priority-low"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  priority === 'Baixa' ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300'
                }`}>
                  {priority === 'Baixa' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <span className="font-bold text-sm">Baixa</span>
              </div>
              <div className="w-5 h-5 rounded-full border border-neutral-300"></div>
            </div>

            {/* Medium option - Selected visual state matches exactly screen 5 card layout */}
            <div
              onClick={() => setPriority('Média')}
              className={`p-3.5 rounded-2xl flex justify-between items-center cursor-pointer transition-all ${
                priority === 'Média'
                  ? 'bg-[#2e90c9]/10 border-2 border-[#2e90c9] text-[#0c3d5e]'
                  : 'bg-[#f3f3f6] text-neutral-600 hover:bg-neutral-100'
              }`}
              id="create-priority-medium"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  priority === 'Média' ? 'border-[#2e90c9] bg-[#2e90c9]' : 'border-neutral-300'
                }`}>
                  {priority === 'Média' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <span className="font-bold text-sm">Média</span>
              </div>
              {/* Checkcircle circle on right matching screen 5 mockup exactly */}
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                priority === 'Média' ? 'bg-[#2e90c9] text-white' : 'border border-neutral-300'
              }`}>
                {priority === 'Média' && <Check size={12} strokeWidth={3} />}
              </div>
            </div>

            {/* High option */}
            <div
              onClick={() => setPriority('Alta')}
              className={`p-3.5 rounded-2xl flex justify-between items-center cursor-pointer transition-all ${
                priority === 'Alta'
                  ? 'bg-red-50 border-[1.5px] border-red-500 text-red-800'
                  : 'bg-[#f3f3f6] text-neutral-600 hover:bg-neutral-100'
              }`}
              id="create-priority-high"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  priority === 'Alta' ? 'border-red-500 bg-red-500' : 'border-neutral-300'
                }`}>
                  {priority === 'Alta' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <span className="font-bold text-sm">Alta</span>
              </div>
              <div className="w-5 h-5 rounded-full border border-neutral-300"></div>
            </div>
          </div>
        </section>

        {/* SUB-TAREFAS LIST ADDITION */}
        <section id="section-create-subtasks" className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#0c3d5e] uppercase tracking-wider text-xs font-bold flex items-center gap-1.5">
              <Check className="text-[#2e90c9]" size={14} />
              Sub-Tarefas
            </h3>
            <span className="bg-neutral-200 text-neutral-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {subTasks.length} adicionadas
            </span>
          </div>

          <div className="flex flex-col gap-3" id="create-subtasks-group">
            {/* Display local subtasks list with delete icon */}
            {subTasks.map((st) => (
              <div 
                key={st.id} 
                className="bg-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm border border-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-neutral-300"></div>
                  <span className="text-sm font-semibold text-[#1a1c1e]">{st.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteSubTaskLocal(st.id)}
                  className="p-1 px-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            {/* Sub-tarefa input row mimicking Screen 3/5 detail style */}
            <div className="flex gap-2" id="local-subtask-form">
              <div className="flex-1 bg-[#f3f3f6] rounded-2xl flex items-center px-4 py-3 shadow-inner">
                <PenTool size={16} className="text-neutral-400 mr-2.5" />
                <input
                  type="text"
                  placeholder="Adicionar nova sub-tarefa..."
                  value={currentSubTask}
                  onChange={(e) => setCurrentSubTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (currentSubTask.trim()) {
                        setSubTasks([...subTasks, { id: `local-sub-${Date.now()}`, title: currentSubTask.trim(), completed: false }]);
                        setCurrentSubTask('');
                      }
                    }
                  }}
                  className="flex-1 bg-transparent border-none text-sm font-medium text-[#1a1c1e] placeholder-neutral-400 focus:outline-none"
                  id="input-create-subtask"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentSubTask.trim()) {
                    setSubTasks([...subTasks, { id: `local-sub-${Date.now()}`, title: currentSubTask.trim(), completed: false }]);
                    setCurrentSubTask('');
                  }
                }}
                className="w-12 h-12 bg-[#0c3d5e] text-white rounded-2xl flex items-center justify-center hover:bg-[#002740] shadow-md transition-all active:scale-95"
                id="btn-create-subtask-add"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* BOTTOM OPTION BUTTONS: CANCELAR & SALVAR pill buttons */}
        <div className="grid grid-cols-2 gap-4 mt-2 pb-6" id="create-triggers">
          <button
            type="button"
            onClick={onBack}
            className="py-4 rounded-full text-sm font-bold tracking-wide uppercase bg-[#eeedf1] text-[#42474e] hover:bg-[#e2e2e5] transition-all active:scale-95 text-center"
            id="btn-create-cancelar"
          >
            CANCELAR
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="py-4 rounded-full text-sm font-bold tracking-wide uppercase bg-[#0c3d5e] text-white hover:bg-[#002740] transition-all active:scale-95 shadow-md shadow-[#0c3d5e]/25 text-center"
            id="btn-create-salvar"
          >
            SALVAR
          </button>
        </div>

      </main>
    </div>
  );
}
