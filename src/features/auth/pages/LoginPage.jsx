
import { supabase } from "../../../lib/supabase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Must be at least 6 characters"),
  });

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-100">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to your ProjectFlow account
            </p>
          </div>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const { error } =
                  await supabase.auth.signInWithPassword({
                    email: values.email,
                    password: values.password,
                  });

                if (error) {
                  toast.error(error.message);
                  return;
                }

                toast.success("Signed in successfully!");

                navigate("/dashboard");
              } catch (error) {
                console.error(error);
                toast.error("Something went wrong. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
           {({ isSubmitting, values }) => (
              <Form className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>

                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Remember me
                  </label>

                <button
  type="button"
  onClick={async () => {
    if (!values.email) {
      toast.error("Please enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      values.email
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset email sent!");
  }}
  className="font-medium text-blue-600 hover:text-blue-700"
>
  Forgot password?
</button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>

                {/* Register */}
                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Create account
                  </Link>
                </p>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

