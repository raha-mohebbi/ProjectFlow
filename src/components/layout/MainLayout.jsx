import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import CreateTaskModal from "../CreateTaskModal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../../store/taskSlice";
import { supabase } from "../../lib/supabase";

const MainLayout = () => {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const dispatch = useDispatch();
const reduxTasks = useSelector((state) => state.tasks.tasks);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsCreateTaskOpen(true);
  };


const handleDeleteTask = async (task) => {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", task.id);

  if (error) {
    console.error("Error deleting task:", error);
    return;
  }

  const updatedTasks = reduxTasks.filter(
    (item) => item.id !== task.id
  );

  dispatch(setTasks(updatedTasks));
};


  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar />

      <div className="ml-60">
        <Navbar onNewTask={() => setIsCreateTaskOpen(true)} />
        <CreateTaskModal
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          selectedTask={selectedTask}
        />

        <main>
          <Outlet context={{ handleEditTask, handleDeleteTask }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
