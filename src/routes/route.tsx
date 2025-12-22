import { createHashRouter, Navigate } from "react-router";
import App from "../App";
import { ROUTES } from "./contant";
import TaskList from "../components/tasks/TaskList";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to={`/${ROUTES.ALL_TASK}`} replace />
      },
      {
        path: ROUTES.ALL_TASK,
        element:  <TaskList />
      },
      {
        path: ROUTES.COMPLETE_TASK,
        element:  <TaskList />
      }
    ]
  }
]);
