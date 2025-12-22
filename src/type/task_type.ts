
export const TASK_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED'
} as const;


export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
    createdAt: string;
    updatedAt?: string;
}

export interface TaskInput {
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate: string;
}

export interface TaskUpdate {
    title?: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
}

export interface TaskSummary {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
}

export type FilterType = 'all' | TaskStatus;
export type SortByType = 'dueDate' | 'title';

export interface TaskState {
    tasks: Task[];
    filter: FilterType;
    sortBy: SortByType;
}


export type TaskAction =
    | { type: 'SET_TASKS'; payload: Task[] }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: string }
    | { type: 'SET_FILTER'; payload: FilterType }
    | { type: 'SET_SORT'; payload: SortByType };

export interface TaskContextType {
    tasks: Task[];
    filter: FilterType;
    sortBy: SortByType;
    addTask: (taskData: TaskInput) => Task;
    updateTask: (id: string, updates: TaskUpdate) => Task | null;
    deleteTask: (id: string) => void;
    setFilter: (filter: FilterType) => void;
    setSortBy: (sortBy: SortByType) => void;
    getFilteredTasks: () => Task[];
    getTaskSummary: () => TaskSummary;
}
