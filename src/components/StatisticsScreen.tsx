import React, { useState, useMemo } from 'react';
import { TaskList } from '../types';
import { 
  Menu, 
  CircleUser, 
  Calendar, 
  TrendingUp, 
  Award, 
  CheckCircle,
  HelpCircle,
  ArrowUpRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

interface StatisticsScreenProps {
  tasks: TaskList[];
  onProfileClick: () => void;
  onMenuClick: () => void;
  userSession: { username?: string; email?: string; isLoggedIn: boolean; avatarUrl?: string };
}

export default function StatisticsScreen({
  tasks,
  onProfileClick,
  onMenuClick,
  userSession
}: StatisticsScreenProps) {
  const [period, setPeriod] = useState('Últimos 7 dias');
  const [activeHoveredNode, setActiveHoveredNode] = useState<number | null>(null);

  // Dynamic calculations based on tasks
  const stats = useMemo(() => {
    const totalSubTasks = tasks.reduce((sum, t) => sum + t.subTasks.length, 0);
    const completedSubTasks = tasks.reduce((sum, t) => sum + t.subTasks.filter(st => st.completed).length, 0);
    
    // Recalculate rate based on actual checkboxes, defaulting to seed of 87% if empty
    const completionRate = totalSubTasks > 0 
      ? Math.round((completedSubTasks / totalSubTasks) * 100) 
      : 87;

    // Completed tasks tally, scaling up from seed
    const completedTasksCount = 120 + tasks.filter(t => {
      if (t.subTasks.length === 0) return false;
      return t.subTasks.every(st => st.completed);
    }).length;

    // Daily distribution mapping (Seg to Dom)
    // We adjust values representing completed counts per day of week to make it look responsive
    const distribution = [
      { day: 'Seg', count: 15 + tasks.filter(t => t.category === 'Compras').length * 2 },
      { day: 'Ter', count: 28 + tasks.filter(t => t.priority === 'Alta').length * 3 },
      { day: 'Qua', count: 42 + completedSubTasks },
      { day: 'Qui', count: tasks.length > 5 ? 58 : 34 },
      { day: 'Sex', count: 22 + tasks.filter(t => t.category === 'Provas').length * 4 },
      { day: 'Sab', count: 65 + completedSubTasks * 2 },
      { day: 'Dom', count: 48 + tasks.filter(t => t.priority === 'Média').length * 2 }
    ];

    return {
      completionRate,
      completedTasksCount,
      distribution
    };
  }, [tasks]);

  // SVG coordinates calculations for line chart (width: 320, height: 160)
  const chartHeight = 160;
  const chartWidth = 320;
  const paddingX = 25;
  const paddingY = 20;

  // Find max value in dataset to scale properly
  const maxCount = useMemo(() => {
    const vals = stats.distribution.map(d => d.count);
    return Math.max(...vals, 40); // default minimum ceiling
  }, [stats.distribution]);

  const chartPoints = useMemo(() => {
    const stepX = (chartWidth - paddingX * 2) / (stats.distribution.length - 1);
    return stats.distribution.map((d, index) => {
      const x = paddingX + index * stepX;
      // Scale coordinates invertedly (SVG has 0,0 at top)
      const ratio = d.count / maxCount;
      const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
      return { x, y, day: d.day, count: d.count };
    });
  }, [stats.distribution, maxCount, chartWidth]);

  // Generate cubic bezier curve commands for the points
  const bezierPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    let d = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const p0 = chartPoints[i];
      const p1 = chartPoints[i + 1];
      // Control points for smooth bezier interpolation
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [chartPoints]);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#f9f9fc] flex flex-col relative pb-32 pt-2" id="statistics-screen">
      
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 py-4" id="stats-header">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl hover:bg-neutral-200/50 transition-colors"
          aria-label="Menu"
          id="btn-stats-menu"
        >
          <Menu size={24} className="text-[#0c3d5e]" />
        </button>
        <span className="font-sans font-bold text-lg tracking-tight text-[#0c3d5e]" id="stats-brand-title">
          {userSession.isLoggedIn ? `Guru de ${userSession.username}` : 'Guru Organização'}
        </span>
        <button 
          onClick={onProfileClick}
          className="p-2 -mr-2 rounded-xl hover:bg-neutral-200/50 transition-colors relative"
          aria-label="Perfil"
          id="btn-stats-profile"
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

      {/* Main Stats body */}
      <main className="flex-1 px-6 flex flex-col" id="stats-main-content">
        
        {/* Title & Description section */}
        <div className="mt-4 mb-6" id="stats-headings">
          <h1 className="font-sans text-[30px] font-extrabold leading-[38px] tracking-[-0.02em] text-[#0c3d5e]" id="title-stats-headline">
            Desempenho
          </h1>
          <p className="text-sm font-medium text-[#42474e] mt-2 block opacity-85" id="desc-stats-subtitle">
            Sua jornada de produtividade visualizada.
          </p>
        </div>

        {/* Dynamic Stat cards side-by-side */}
        <div className="grid grid-cols-2 gap-4 mb-6" id="stats-grid">
          {/* Card 1: Completion Rate */}
          <div 
            className="bg-white p-5 rounded-2xl border border-neutral-100 flex flex-col justify-between" 
            style={{ boxShadow: '0 10px 25px rgba(12, 61, 94, 0.03)' }}
            id="card-completion-rate"
          >
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide block mb-1">
                Taxa de Conclusão
              </span>
              <span className="text-[28px] font-extrabold text-[#0c3d5e] tracking-tight block">
                {stats.completionRate}%
              </span>
            </div>
            {/* Soft upward indication mimicking original sketch line graph */}
            <div className="flex items-center gap-1.5 mt-4 text-[#2e90c9]" id="trend-indicator">
              <TrendingUp size={14} className="text-[#2e90c9]" />
              <span className="text-[11px] font-bold leading-tight select-none">
                +12% em relação ao mês anterior
              </span>
            </div>
          </div>

          {/* Card 2: Completed Tasks count */}
          <div 
            className="bg-white p-5 rounded-2xl border border-neutral-100 flex flex-col justify-between" 
            style={{ boxShadow: '0 10px 25px rgba(12, 61, 94, 0.03)' }}
            id="card-completed-count"
          >
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide block mb-1">
                Tarefas Finais
              </span>
              <span className="text-[28px] font-extrabold text-[#0c3d5e] tracking-tight block">
                {stats.completedTasksCount}
              </span>
            </div>
            {/* Week footer block */}
            <p className="text-[11px] font-semibold text-[#42474e] mt-4" id="week-indicator">
              Nesta semana
            </p>
          </div>
        </div>

        {/* Interactive SVG Chart Section */}
        <section 
          className="bg-white p-5 rounded-2xl border border-neutral-100 flex flex-col" 
          style={{ boxShadow: '0 12px 30px rgba(12, 61, 94, 0.04)' }}
          id="section-productivity-panel"
        >
          {/* Section Header with dynamic period selector */}
          <div className="flex justify-between items-center mb-6" id="prod-panel-header">
            <h2 className="font-sans font-bold text-[#0c3d5e] text-base" id="lbl-prod-title">
              Produtividade
            </h2>
            
            {/* Period select dropdown */}
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="appearance-none bg-[#f3f3f6] text-[#42474e] text-xs font-bold py-2 pl-4 pr-8 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-[#2e90c9] cursor-pointer"
                id="select-period-filter"
              >
                <option>Últimos 7 dias</option>
                <option>Último mês</option>
                <option>Este ano</option>
              </select>
              <Calendar size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#42474e] pointer-events-none" />
            </div>
          </div>

          {/* Majestic Custom Hand-coded SVG Line Chart */}
          <div className="w-full flex justify-center items-center relative py-1" id="custom-svg-chart-container">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="overflow-visible"
              style={{ width: '100%', height: 'auto', maxHeight: '180px' }}
            >
              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#f3f3f6" strokeWidth={1} />
              <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#f3f3f6" strokeWidth={1} />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#eeedf1" strokeWidth={1.5} />

              {/* Dotted helper line for hovered node */}
              {activeHoveredNode !== null && (
                <line 
                  x1={chartPoints[activeHoveredNode].x} 
                  y1={paddingY} 
                  x2={chartPoints[activeHoveredNode].x} 
                  y2={chartHeight - paddingY} 
                  stroke="#2e90c9" 
                  strokeWidth={1} 
                  strokeDasharray="4 4" 
                />
              )}

              {/* Bezier Wave Line */}
              <motion.path
                d={bezierPath}
                fill="none"
                stroke="#2e90c9"
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />

              {/* Wave Gradient Shadow Fill */}
              <path
                d={`${bezierPath} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - paddingY} L ${chartPoints[0].x} ${chartHeight - paddingY} Z`}
                fill="url(#wave-gradient)"
                opacity={0.12}
              />

              {/* Gradients declarations */}
              <defs>
                <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2e90c9" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>

              {/* Dynamic Coordinate Node circles */}
              {chartPoints.map((pt, i) => {
                const isHovered = activeHoveredNode === i;
                return (
                  <g key={pt.day} className="cursor-pointer">
                    {/* Hover hotspot */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={16} 
                      fill="transparent" 
                      onMouseEnter={() => setActiveHoveredNode(i)}
                      onMouseLeave={() => setActiveHoveredNode(null)}
                      onClick={() => setActiveHoveredNode(isHovered ? null : i)}
                    />
                    
                    {/* Visual node */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isHovered ? 6 : 4} 
                      fill={isHovered ? '#6fd1d7' : '#2e90c9'} 
                      stroke="#ffffff" 
                      strokeWidth={isHovered ? 2.5 : 1.5} 
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Dynamic HTML Tooltip Overlay triggered by click/hover */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6" id="tooltip-overlay">
              <span className="text-xs font-bold text-[#0c3d5e] bg-[#f3f3f6] px-3 py-1 rounded-full shadow-sm">
                {activeHoveredNode !== null 
                  ? `${chartPoints[activeHoveredNode].day}: ${chartPoints[activeHoveredNode].count} tarefas` 
                  : 'Passe o mouse nos pontos para detalhes'}
              </span>
            </div>
          </div>

          {/* Grid X labels row (Days list Seg to Dom matching Screen 4 curve perfectly) */}
          <div className="flex justify-between px-[18px] mt-4 text-xs font-bold text-neutral-400 select-none" id="prod-panel-weekdays">
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sab</span>
            <span>Dom</span>
          </div>
        </section>

        {/* Motivational Tip Block */}
        <section 
          className="mt-6 bg-gradient-to-br from-[#0c3d5e]/10 to-[#2e90c9]/5 p-5 rounded-3xl border border-[#0c3d5e]/10 flex gap-4 items-start"
          id="motivational-card"
        >
          <div className="p-3 bg-[#0c3d5e] text-white rounded-2xl shadow-sm">
            <Sparkles size={18} className="text-[#6fd1d7]" />
          </div>
          <div className="flex-1">
            <h3 className="font-sans font-bold text-sm text-[#0c3d5e] mb-1">
              Ritmo Produtivo
            </h3>
            <p className="text-xs font-semibold leading-relaxed text-[#42474e]">
              Excelente, {userSession.username || 'Erika'}! Seu maior pico de rendimento ocorre aos sábados. Continue reservando micromomentos de descanso durante a semana para manter o foco e evitar a estafa digital.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
