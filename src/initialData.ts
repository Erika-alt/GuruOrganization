import { TaskList, PerformanceStats } from './types';

export const INITIAL_TASK_LISTS: TaskList[] = [
  {
    id: 'lista-1',
    title: 'Lista 1',
    description: 'Comprar frutas frescas, sementes e grãos integrais para o cardápio saudável do mês.',
    category: 'Compras',
    startDate: '10/10/2023',
    endDate: '14/10/2023',
    priority: 'Baixa',
    subTasks: [
      { id: 'sub-1-1', title: 'Comprar aveia em flocos', completed: true },
      { id: 'sub-1-2', title: 'Escolher abacate e bananas', completed: true },
      { id: 'sub-1-3', title: 'Adquirir pacotes de chia', completed: true }
    ]
  },
  {
    id: 'lista-2',
    title: 'Lista 2',
    description: 'Adquirir equipamentos de informática necessários para reestruturar o escritório remoto de trabalho.',
    category: 'Compras',
    startDate: '12/10/2023',
    endDate: '18/10/2023',
    priority: 'Média',
    subTasks: [
      { id: 'sub-2-1', title: 'Pesquisar mouses ergonômicos', completed: false },
      { id: 'sub-2-2', title: 'Encontrar suporte metálico para laptop', completed: false }
    ]
  },
  {
    id: 'lista-3',
    title: 'Compra de Materiais', // Shown as Lista 3 in screen 1 but is "Compra de Materiais" in screen 3 detail
    description: 'Comprar todos os materiais para o projeto de reforma da sala, incluindo tintas, pincéis e rolos. Verificar preços em pelo menos três lojas diferentes para garantir o melhor custo-benefício.',
    category: 'Compras',
    startDate: '15/10/2023',
    endDate: '22/10/2023',
    priority: 'Média',
    subTasks: [
      { id: 'sub-3-1', title: 'Lista de materiais finalizada', completed: true },
      { id: 'sub-3-2', title: 'Pesquisa de preços concluída', completed: true },
      { id: 'sub-3-3', title: 'Visitar Loja de Tintas Central', completed: false },
      { id: 'sub-3-4', title: 'Comprar solvente ecológico', completed: true },
      { id: 'sub-3-5', title: 'Adquirir lixas finas', completed: true }
      // 4 out of 5 are completed = exactly 80%! Incredible match!
    ]
  },
  {
    id: 'lista-prod-1',
    title: 'Catalogo de Produtos out/23',
    description: 'Levantamento e cadastro de novos produtos ecológicos para a loja online.',
    category: 'Produtos',
    startDate: '01/10/2023',
    endDate: '10/10/2023',
    priority: 'Alta',
    subTasks: [
      { id: 'sub-prod-1', title: 'Fotografar novas sandálias de cortiça', completed: true },
      { id: 'sub-prod-2', title: 'Redigir descrições ecológicas', completed: true },
      { id: 'sub-prod-3', title: 'Configurar planilha de frete integrado', completed: false }
    ]
  },
  {
    id: 'lista-provas-1',
    title: 'Prova de Anatomia Humana',
    description: 'Estudo focado para o exame abrangente de biomecânica aplicativa.',
    category: 'Provas',
    startDate: '18/10/2023',
    endDate: '24/10/2023',
    priority: 'Alta',
    subTasks: [
      { id: 'sub-prov-1', title: 'Revisar sistemas musculares do braço', completed: true },
      { id: 'sub-prov-2', title: 'Resolver questionários antigos', completed: true },
      { id: 'sub-prov-3', title: 'Simulado prático no laboratório', completed: false }
    ]
  },
  {
    id: 'lista-mat-1',
    title: 'Materiais Didáticos Ciclo II',
    description: 'Organização e validação das apresentações de slides dinâmicas para a equipe docente.',
    category: 'Materiais',
    startDate: '05/10/2023',
    endDate: '12/10/2023',
    priority: 'Média',
    subTasks: [
      { id: 'sub-mat-1', title: 'Apostilas de geografia revisadas', completed: true },
      { id: 'sub-mat-2', title: 'Gravar mídias de suporte de áudio', completed: false }
    ]
  }
];

export const INITIAL_STATS: PerformanceStats = {
  completionRate: 87,
  completedTasksCount: 124,
  weeklyProductivity: [
    { day: 'Seg', count: 12 },
    { day: 'Ter', count: 18 },
    { day: 'Qua', count: 32 },
    { day: 'Qui', count: 45 },
    { day: 'Sex', count: 28 },
    { day: 'Sab', count: 68 },
    { day: 'Dom', count: 54 }
  ]
};
