import { createContext, useContext } from 'react';

export const TaskListContext = createContext({
  reloadTasks: () => {},
});

export const useTaskListContext = () => useContext(TaskListContext);
