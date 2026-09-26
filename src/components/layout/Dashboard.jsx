import { supabase } from "../../lib/supabase";

import { CiFilter } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { IoListOutline } from "react-icons/io5";

import { useState, useEffect } from "react";

import Tasks from "./Tasks";
import CreateProjectModal from "../CreateProjectModal";
import ProjectCard from "../ProjectCard";

const Dashboard = () => {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  useEffect(() => {
    const getProjects = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Current User:", user);

      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("created_by", user.id);

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      setProjects(data);
      console.log("Projects:", data);
    };

    getProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || project.status === filter),
  );

  const handlefilterChange = (e) => {
    setFilter(e.target.value);
    setIsFilterOpen(false);
  };
  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            {projects.length} {projects.length === 1 ? "project" : "projects"}{" "}
            across your workspace
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm text-white"
        >
          + New Project
        </button>
      </div>
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
      {/* Search & Filter + Grid/List */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search Projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-lg border border-gray-200 px-4 py-2 outline-none"
          />
          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <CiFilter size={20} />
              Filter
            </button>
            {isFilterOpen && (
              <div className="absolute left-0 top-full z-10 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-3 shadow-md">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="filter"
                    value="all"
                    checked={filter === "all"}
                    onChange={handlefilterChange}
                  />
                  All
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="filter"
                    value="active"
                    checked={filter === "active"}
                    onChange={handlefilterChange}
                  />
                  Active
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="filter"
                    value="inactive"
                    checked={filter === "inactive"}
                    onChange={handlefilterChange}
                  />
                  Inactive
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="filter"
                    value="completed"
                    checked={filter === "completed"}
                    onChange={handlefilterChange}
                  />
                  Completed
                </label>
              </div>
            )}
          </div>
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
      <div className="mt-5">
        <Tasks />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
};

export default Dashboard;