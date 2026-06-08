/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskList {
  id: string;
  title: string;
  description: string;
  category: string; // e.g. "Compras", "Produtos", "Provas", "Materiais"
  startDate: string; // YYYY-MM-DD or readable string
  endDate: string; // YYYY-MM-DD or readable string
  priority: 'Baixa' | 'Média' | 'Alta';
  subTasks: SubTask[];
}

export interface UserSession {
  username?: string;
  email?: string;
  isLoggedIn: boolean;
  avatarUrl?: string;
}

export interface PerformanceStats {
  completionRate: number; // e.g. 87
  completedTasksCount: number; // e.g. 124
  weeklyProductivity: { day: string; count: number }[]; // days of the week and completed count
}
