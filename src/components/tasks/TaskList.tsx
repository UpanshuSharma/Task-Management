import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import TaskCard from '../../common/task-card/TaskCard';
import { useTaskContext } from '../../context/TaskContext';

const TaskList: React.FC = () => {
    const { getFilteredTasks ,setFilter} = useTaskContext()
    const pathname=useLocation()?.pathname;
    const taskList = getFilteredTasks();

  useEffect(()=>{
    if(pathname){
      if(pathname.includes("complete-task")){
        setFilter("COMPLETED");
      }else{
        setFilter("all");
      }
    }
  },[pathname])
    return (
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {taskList.map(task => (
                <TaskCard key={task.id} task={task}  />
            ))}
        </div>
    )
}

export default TaskList