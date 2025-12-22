
import React, { createContext, useContext, useEffect, useReducer } from 'react';

import type {
  FilterType,
  SortByType,
  Task,
  TaskAction,
  TaskContextType,
  TaskInput,
  TaskState,
  TaskSummary,
  TaskUpdate
} from '../type/task_type';

import { TASK_STATUS } from '../type/task_type';

const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  sortBy: 'dueDate'
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {


    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload
      };

    default:
      return state;
  }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);


interface TaskProviderProps {
  children: React.ReactElement;
}


export const TaskContextProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState, (initial) => {
    const savedTasks = localStorage.getItem('tasks');
    return {
      ...initial,
      tasks: savedTasks ? JSON.parse(savedTasks) : []
    };
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);


  const addTask = (taskData: TaskInput): Task => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || TASK_STATUS.PENDING,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    return newTask;
  };


  const updateTask = (id: string, updates: TaskUpdate): Task | null => {
    const taskToUpdate = state.tasks.find((task: Task) => task.id === id);
    if (!taskToUpdate) return null;

    const updatedTask: Task = {
      ...taskToUpdate,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    return updatedTask;
  };


  const deleteTask = (id: string): void => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };


  const setFilter = (filter: FilterType): void => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };


  const setSortBy = (sortBy: SortByType): void => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };


  const getFilteredTasks = (): Task[] => {
    let filtered = state.tasks;

    if (state.filter !== 'all') {
      filtered = filtered.filter((task: Task) => task.status === state.filter);
    }


    filtered = [...filtered].sort((a, b) => {
      if (state.sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (state.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return filtered;
  };



  const getTaskSummary = (): TaskSummary => {
    return {
      total: state.tasks.length,
      pending: state.tasks.filter((t: Task) => t.status === TASK_STATUS.PENDING).length,
      inProgress: state.tasks.filter((t: Task) => t.status === TASK_STATUS.IN_PROGRESS).length,
      completed: state.tasks.filter((t: Task) => t.status === TASK_STATUS.COMPLETED).length
    };
  };


  const value: TaskContextType = {
    tasks: state.tasks,
    filter: state.filter,
    sortBy: state.sortBy,
    addTask,
    updateTask,
    deleteTask,
    getTaskSummary,
    getFilteredTasks,
    setFilter,
    setSortBy,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};