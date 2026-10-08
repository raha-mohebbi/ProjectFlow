import { Formik, Form, Field } from "formik";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

const CreateTaskModal = ({ isOpen, onClose }) => {
  const initialValues = {
    title: "",
    description: "",
    project_id: "",
    status: "todo",
    priority: "medium",
  };
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .eq("created_by", user.id);

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      setProjects(data);
    };

    getProjects();
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            console.log(values);
            const {
              data: { user },
            } = await supabase.auth.getUser();

            console.log("Current User:", user);
            if (!user) {
              console.error("User is not authenticated");
              return;
            }

            const { data, error } = await supabase
              .from("tasks")
              .insert({
                title: values.title,
                description: values.description,
                project_id: values.project_id,
                status: values.status,
                priority: values.priority,
                created_by: user.id,
              })
              .select()
              .single();

            if (error) {
              console.error("Error creating task:", error);
              return;
            }

            console.log("Task created successfully:", data);

            onClose();
          }}
        >
          <Form className="space-y-4 p-6">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>

              <Field
                name="title"
                type="text"
                placeholder="Enter task title"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>

              <Field
                as="textarea"
                name="description"
                placeholder="Enter task description"
                rows="4"
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Project */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Project
              </label>

              <Field
                as="select"
                name="project_id"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Field>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>

              <Field
                as="select"
                name="status"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </Field>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>

              <Field
                as="select"
                name="priority"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Create Task
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CreateTaskModal;
