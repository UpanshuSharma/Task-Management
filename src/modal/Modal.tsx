import React from 'react';
import formConfigJson from "../config/FormConfig.json";
import { useTaskContext } from '../context/TaskContext';
import { DynamicForm } from '../form/DynamicForm';
import type { FormConfig, FormData } from '../type/form_type';
import type { TaskInput } from '../type/task_type';
import "./modal.css";
const formConfig = formConfigJson
interface ModalProps {
    open: boolean
    onClose: () => void
    title: string,
    initialValues?: any
    isEdit?: boolean
}
const Modal: React.FC<ModalProps> = ({ open, onClose, title, initialValues = {}, isEdit = false }) => {
    if (!open) return null;
    const taskContext = useTaskContext()
    const handleSubmit = (data: FormData) => {
        const payload: TaskInput = {
            title: String(data?.title) ?? "",
            description: String(data?.description),
            status: data?.status as any,
            dueDate: String(data?.dueDate),
        }
        if (!isEdit) {
            taskContext.addTask(payload)
        }
        else {
            taskContext.updateTask(initialValues?.id, payload)
        }
        onClose();
    }
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <DynamicForm
                        config={formConfig as FormConfig}
                        initialValues={initialValues}
                        // onSubmit={(data: FormData) => console.log(data)}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );

}

export default Modal