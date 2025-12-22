import React, { useState } from 'react'
import type { Task } from '../../type/task_type';
import { getStatusLabel } from '../../config/helper';
import { useTaskContext } from '../../context/TaskContext';
import './taskcard.css';
import Modal from '../../modal/Modal';

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const { deleteTask } = useTaskContext();
    const [open,setOpen]=useState(false);
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTask(task.id);
        }
    };

    return (
        <>
        <div className={`task-card task-card--${task.status}`}>
            <div className="task-card__header">
                <div className="task-card__content">
                    <h3 className="task-card__title">{task.title}</h3>
                    <p className="task-card__description">{task.description}</p>
                </div>
                <div className="task-card__actions">
                    <button
                        className="task-card__btn task-card__edit-btn"
                        onClick={() => setOpen(true)}
                        aria-label="Edit task"
                        title="Edit task"
                    >
                       <i className="fa fa-pencil"></i>
                    </button>
                    <button
                        className="task-card__btn task-card__delete-btn"
                        onClick={handleDelete}
                        aria-label="Delete task"
                        title="Delete task"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                </div>
            </div>
            <div className="task-card__footer">
                <span className="task-card__due-date">
                    <i className="fa fa-calendar"></i>  {formatDate(task.dueDate)}
                </span>
                <span className={`task-card__status task-card__status--${task.status}`}>
                    {getStatusLabel(task.status)}
                </span>
            </div>
        </div>
{open && <Modal isEdit={true} title={`Edit ${task?.title}`} onClose={()=>setOpen(false)} open={open} initialValues={task}/>}
        </>
    )
}
export default TaskCard