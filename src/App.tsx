import { Outlet } from "react-router"
import NavBar from "./common/nav bar/NavBar"

import Info from "./components/info/Info"
import { TaskContextProvider } from "./context/TaskContext"


function App() {
  return (
    <TaskContextProvider>
      <div>
        <NavBar />
        <main className="main">
          <Info />
          <Outlet />
        </main>
      </div>
    </TaskContextProvider>
  )
}

export default App
