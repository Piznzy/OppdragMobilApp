export type Priority = 'Low' | 'Medium' | 'High';

export type FilterType = 'All' | 'Active' | 'Completed';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  deadline: string;
  createdAt: string;
  updatedAt: string;
};
