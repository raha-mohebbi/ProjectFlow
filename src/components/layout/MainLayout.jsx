import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SideBar from "./SideBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <SideBar />

      <main className="ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;