import { CiFolderOn } from "react-icons/ci";

const Tasks = ({ tasks }) => {
  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <CiFolderOn className="text-blue-600" size={20} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">12</h3>
          </div>

          <p className="mt-3 text-sm text-gray-500">Total Projects</p>
        </div>

        {/* Total Tasks */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <CiFolderOn className="text-purple-600" size={20} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">148</h3>
          </div>

          <p className="mt-3 text-sm text-gray-500">Total Tasks</p>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CiFolderOn className="text-green-600" size={20} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">92</h3>
          </div>

          <p className="mt-3 text-sm text-gray-500">Completed</p>
        </div>

        {/* Overdue */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <CiFolderOn className="text-red-600" size={20} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">7</h3>
          </div>

          <p className="mt-3 text-sm text-gray-500">Overdue</p>
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>

          <p className="mt-1 text-sm text-gray-500">Your recent tasks</p>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              {/* Task Info */}
              <div className="min-w-0">
                <p className="mb-2 text-xs font-medium text-blue-600">
                  {task.project?.name || "No project"}
                </p>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {task.description || "No description"}
                </p>
              </div>

              {/* Status & Priority */}
              <div className="ml-4 flex shrink-0 items-center gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {task.status}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
