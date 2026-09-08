import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SideBar from "./SideBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar />

      <div className="ml-60">
        <Navbar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;