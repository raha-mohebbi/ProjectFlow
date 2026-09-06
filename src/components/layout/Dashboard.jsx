import { CiFilter } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { IoListOutline } from "react-icons/io5";

const Dashboard = () => {
  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            12 projects across your workspace.
          </p>
        </div>

        <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm text-white">
          + New Project
        </button>
      </div>

      {/* Search & Filter + Grid/List */}
      <div className="mt-6 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search Projects..."
            className="w-72 rounded-lg border border-gray-200 px-4 py-2 outline-none"
          />

          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2">
            <CiFilter size={20} />
            Filter
          </button>
        </div>

      <div className="flex items-center gap-1 rounded-lg border border-gray-200/70 bg-white/60 px-2 py-1 backdrop-blur-md">
  <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-600">
    <CiGrid41 size={16} />
    Grid
  </button>

  <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-600">
    <IoListOutline size={16} />
    List
  </button>
</div>

      </div>

      {/* States - temporary */}
      <div className="mt-6 flex gap-2">
        <span className="cursor-pointer rounded-full border border-gray-200 px-4 py-1 text-sm text-gray-600 hover:bg-gray-100">
          Loaded
        </span>

        <span className="cursor-pointer rounded-full border border-gray-200 px-4 py-1 text-sm text-gray-600 hover:bg-gray-100">
          Loading
        </span>

        <span className="cursor-pointer rounded-full border border-gray-200 px-4 py-1 text-sm text-gray-600 hover:bg-gray-100">
          Empty
        </span>

        <span className="cursor-pointer rounded-full border border-gray-200 px-4 py-1 text-sm text-gray-600 hover:bg-gray-100">
          Error
        </span>
      </div>
      
    </main>
  );
};

export default Dashboard;