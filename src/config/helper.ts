import { TASK_STATUS, type TaskStatus } from "../type/task_type";

export const getTitleHelper: Record<string, string> = {
    total: "Total Tasks",
    pending: "Pending Tasks",
    inProgress: "In Progress Tasks",
    completed: "Complete Tasks"
}
export const getClassNameHelper: Record<string, string> = {
    total: "",
    pending: "pending",
    inProgress: "in-progress",
    completed: "completed"
}

export const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
        case TASK_STATUS.PENDING:
            return 'Pending';
        case TASK_STATUS.IN_PROGRESS:
            return 'In Progress';
        case TASK_STATUS.COMPLETED:
            return 'Completed';
        default:
            return status;
    }
};