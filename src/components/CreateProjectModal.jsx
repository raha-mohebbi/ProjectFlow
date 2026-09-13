import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { supabase } from "../lib/supabase";

const CreateProjectModal = ({ isOpen, onClose }) => {
  const initialValues = {
    project_name: "",
    project_description: "",
    project_status: "active",
    project_color: "red",
  };

  const validationSchema = Yup.object({
    project_name: Yup.string().required("Project name is required"),
  });

  if (!isOpen) return null;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        // Get current logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        console.log("Current User:", user);

        if (!user) {
          console.error("User is not authenticated");
          return;
        }

        // Insert project into Supabase
        const { data, error } = await supabase
          .from("projects")
          .insert({
            name: values.project_name,
            description: values.project_description,
            status: values.project_status,
            color: values.project_color,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating project:", error);
          return;
        }

        console.log("Project created successfully:", data);

        // Close modal after successful creation
        onClose();
      }}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <Form className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Create New Project
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add a new project to your workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-5 px-6 py-6">
            {/* Project Name */}
            <div>
              <label
                htmlFor="project_name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Project Name
              </label>

              <Field
                id="project_name"
                name="project_name"
                type="text"
                placeholder="Enter project name"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <ErrorMessage
                name="project_name"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Project Description */}
            <div>
              <label
                htmlFor="project_description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <Field
                as="textarea"
                id="project_description"
                name="project_description"
                rows="4"
                placeholder="Describe your project..."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Status & Color */}
            <div className="grid grid-cols-1 gap-4">
              {/* Status */}
              <div>
                <label
                  htmlFor="project_status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>

                <Field
                  as="select"
                  id="project_status"
                  name="project_status"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </Field>
              </div>

              {/* Color */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Color
                </label>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <Field
                      type="radio"
                      name="project_color"
                      value="red"
                      className="peer sr-only"
                    />

                    <span className="block h-7 w-7 rounded-full bg-red-600 ring-2 ring-transparent transition peer-checked:ring-2 peer-checked:ring-red-500 peer-checked:ring-offset-2" />
                  </label>

                  <label className="cursor-pointer">
                    <Field
                      type="radio"
                      name="project_color"
                      value="blue"
                      className="peer sr-only"
                    />

                    <span className="block h-7 w-7 rounded-full bg-blue-600 ring-2 ring-transparent transition peer-checked:ring-2 peer-checked:ring-blue-500 peer-checked:ring-offset-2" />
                  </label>

                  <label className="cursor-pointer">
                    <Field
                      type="radio"
                      name="project_color"
                      value="green"
                      className="peer sr-only"
                    />

                    <span className="block h-7 w-7 rounded-full bg-green-600 ring-2 ring-transparent transition peer-checked:ring-2 peer-checked:ring-green-500 peer-checked:ring-offset-2" />
                  </label>

                  <label className="cursor-pointer">
                    <Field
                      type="radio"
                      name="project_color"
                      value="yellow"
                      className="peer sr-only"
                    />

                    <span className="block h-7 w-7 rounded-full bg-yellow-600 ring-2 ring-transparent transition peer-checked:ring-2 peer-checked:ring-yellow-400 peer-checked:ring-offset-2" />
                  </label>

                  <label className="cursor-pointer">
                    <Field
                      type="radio"
                      name="project_color"
                      value="purple"
                      className="peer sr-only"
                    />

                    <span className="block h-7 w-7 rounded-full bg-purple-600 ring-2 ring-transparent transition peer-checked:ring-2 peer-checked:ring-purple-500 peer-checked:ring-offset-2" />
                  </label>
                </div>
              </div>
            </div>

            {/* Members */}
            <div>
              <label
                htmlFor="project_members"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Members
              </label>

              <Field
                id="project_members"
                name="project_members"
                type="text"
                placeholder="Add member..."
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                You can add project members later.
              </p>
            </div>
          </div>

          {/* buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Project
            </button>
          </div>
        </Form>
      </div>
    </Formik>
  );
};

export default CreateProjectModal;
