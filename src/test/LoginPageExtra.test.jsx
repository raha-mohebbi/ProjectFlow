import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// ── Mock Supabase before importing the component ──────────────
vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

// ── Mock react-hot-toast so assertions target the mock ────────
vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}));

import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import LoginPage from "../features/auth/pages/LoginPage";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div data-testid="dashboard" />} />
      </Routes>
    </MemoryRouter>
  );

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password123" },
  });
};

const submit = () =>
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

describe("LoginPage — error paths & extra flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it("shows toast.error and stays on login when Supabase rejects the credentials", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });

    renderPage();
    fillValidForm();
    submit();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Invalid login credentials")
    );
    expect(toast.success).not.toHaveBeenCalled();
    expect(screen.queryByTestId("dashboard")).not.toBeInTheDocument();
  });

  it("shows a success toast and navigates to /dashboard on successful login", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });

    renderPage();
    fillValidForm();
    submit();

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Signed in successfully!")
    );
    expect(await screen.findByTestId("dashboard")).toBeInTheDocument();
  });

  it("shows a generic error toast when signInWithPassword throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    supabase.auth.signInWithPassword.mockRejectedValue(
      new Error("network down")
    );

    renderPage();
    fillValidForm();
    submit();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong. Please try again."
      )
    );
    expect(screen.queryByTestId("dashboard")).not.toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("disables the submit button and shows 'Signing in...' while the request is pending", async () => {
    let resolveSignIn;
    supabase.auth.signInWithPassword.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignIn = resolve;
        })
    );

    renderPage();
    fillValidForm();
    submit();

    const pendingButton = await screen.findByRole("button", {
      name: "Signing in...",
    });
    expect(pendingButton).toBeDisabled();

    resolveSignIn({ error: null });
    expect(await screen.findByTestId("dashboard")).toBeInTheDocument();
  });

  it("does not call resetPasswordForEmail when the email field is empty", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Forgot password?" }));

    expect(toast.error).toHaveBeenCalledWith(
      "Please enter your email first."
    );
    expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("sends a password reset link when an email is provided", async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Forgot password?" }));

    await waitFor(() =>
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com"
      )
    );
    expect(toast.success).toHaveBeenCalledWith("Password reset email sent!");
  });

  it("shows an error toast when the password reset request fails", async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({
      error: { message: "SMTP failure" },
    });

    renderPage();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Forgot password?" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("SMTP failure")
    );
    expect(toast.success).not.toHaveBeenCalled();
  });
});
