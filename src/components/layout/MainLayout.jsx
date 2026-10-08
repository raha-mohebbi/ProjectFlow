import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import CreateTaskModal from "../CreateTaskModal";
import { useState } from "react";

const MainLayout = () => {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar />

      <div className="ml-60">
        <Navbar onNewTask={() => setIsCreateTaskOpen(true)} />
        <CreateTaskModal
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
        />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
