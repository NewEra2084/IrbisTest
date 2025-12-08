import React, { useEffect, useState, useCallback } from 'react';
import { TaskListContext } from '@/contexts/TaskListContext';
import { DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import PreloadContent from '../preload/PreloadContent';
import { CSS } from '@dnd-kit/utilities';

const initialTasks = [
  { id: 'task-1', title: 'Task #1', assignee: 'Alice', status: 'Todo' },
  { id: 'task-2', title: 'Task #2', assignee: 'Bob', status: 'In Progress' },
  { id: 'task-3', title: 'Task #3', assignee: 'Carol', status: 'Done' },
  { id: 'task-4', title: 'Task #4', assignee: 'Alice', status: 'Blocked' },
  { id: 'task-5', title: 'Task #5', assignee: 'Bob', status: 'Todo' },
];

function TaskCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-sm"
    >
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
        {task.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Assignee: {task.assignee}
      </p>
      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
        {task.status}
      </span>
    </div>
  );
}


/*function TaskCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl shadow text-sm"
    >
      <h2 className="font-semibold text-gray-800 mb-1">{task.title}</h2>
      <p className="text-gray-600 mb-2">Assignee: {task.assignee}</p>
      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
        {task.status}
      </span>
    </div>
  );
}*/

export default function TaskListContent({data}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/sub-tasks/list');
        //const result = await res.json();
        const result = initialTasks;
        //result = initialTasks;

        setTasks(result);
      } catch (err) {
        console.error('Ошибка при загрузке задач:', err);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
      fetchTasks();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
    }
  };

  if (loading) {
      return <PreloadContent/>;
  }

  return (
    <TaskListContext.Provider value={{ reloadTasks: fetchTasks }}>
          <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={tasks} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </SortableContext>
          </DndContext>
    </TaskListContext.Provider>
  );

  /*return (<div>Тут контент</div>);*/
}
