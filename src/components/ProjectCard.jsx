const ProjectCard = ({ project }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />

            <h3 className="text-lg font-semibold text-gray-900">
              {project.name}
            </h3>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {project.description}
          </p>
        </div>

        <button className="text-gray-400 hover:text-gray-700">
          ⋮
        </button>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Progress
          </span>

          <span className="text-sm font-medium text-gray-500">
            0%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-0 rounded-full bg-blue-600" />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3 border-y border-gray-100 py-4">

        <div>
          <p className="text-xs text-gray-400">
            Tasks
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            0
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Members
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            0
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Status
          </p>

          <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            {project.status}
          </span>
        </div>

      </div>

      {/* Recently Activity */}
      <div className="mt-5">
        <h4 className="text-sm font-semibold text-gray-900">
          Recently Activity
        </h4>

        <div className="mt-3 space-y-3">

          <div className="flex gap-3">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />

            <div>
              <p className="text-sm text-gray-600">
                No recent activity
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Nothing has happened yet
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProjectCard;