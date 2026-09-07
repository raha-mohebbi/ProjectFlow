import { CiFolderOn } from "react-icons/ci";

const Tasks = () => {
  return (
    <div className="grid grid-cols-3 gap-5">

      {/* Website Redesign */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <CiFolderOn className="text-blue-600" size={20} />
          </div>

          <h3 className="text-lg font-semibold">
         12
          </h3>
        </div>

        <p className="mt-3 text-sm text-gray-500">
         total projects
        </p>
      </div>

      {/* Mobile App */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2">
            <CiFolderOn className="text-purple-600" size={20} />
          </div>

          <h3 className="text-lg font-semibold">
         148
          </h3>
        </div>

        <p className="mt-3 text-sm text-gray-500">
         total tasks
        </p>
      </div>

      {/* Dashboard */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-2">
            <CiFolderOn className="text-green-600" size={20} />
          </div>

          <h3 className="text-lg font-semibold">
        92 
          </h3>
        </div>

        <p className="mt-3 text-sm text-gray-500">
       completed
        </p>
      </div>
{/* Dashboard */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-2">
            <CiFolderOn className="text-green-600" size={20} />
          </div>

          <h3 className="text-lg font-semibold">
     7
          </h3>
        </div>

        <p className="mt-3 text-sm text-gray-500">
      overdue
        </p>
      </div>

    </div>
  );
};

export default Tasks;