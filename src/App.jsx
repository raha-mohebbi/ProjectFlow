import Dashboard from "./components/layout/Dashboard";
import Navbar from "./components/layout/Navbar";
import SideBar from "./components/layout/SideBar";

function App() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1">
        <Navbar />

        <Dashboard />
      </div>
    </div>
  );
}

export default App;