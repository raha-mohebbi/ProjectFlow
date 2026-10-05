import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// ── Mock Supabase before importing the component ──────────────
vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
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
import RegisterPage from "../features/auth/pages/RegisterPage";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </MemoryRouter>
  );

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText("Full Name"), {
    target: { value: "Ali Test" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password123" },
  });
  fireEvent.change(screen.getByLabelText("Confirm Password"), {
    target: { value: "password123" },
  });
};

const submit = () =>
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));

describe("RegisterPage — error paths & extra flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows toast.error when Supabase returns an error", async () => {
    supabase.auth.signUp.mockResolvedValue({
      error: { message: "Email already registered" },
    });

    renderPage();
    fillValidForm();
    submit();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Email already registered")
    );
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("shows a success toast on successful sign-up", async () => {
    supabase.auth.signUp.mockResolvedValue({ error: null });

    renderPage();
    fillValidForm();
    submit();

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Account created successfully!"
      )
    );
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows a generic error toast when signUp throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    supabase.auth.signUp.mockRejectedValue(new Error("network down"));

    renderPage();
    fillValidForm();
    submit();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong. Please try again."
      )
    );
    expect(toast.success).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("disables the submit button and shows 'Creating account...' while pending", async () => {
    let resolveSignUp;
    supabase.auth.signUp.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignUp = resolve;
        })
    );

    renderPage();
    fillValidForm();
    submit();

    const pendingButton = await screen.findByRole("button", {
      name: "Creating account...",
    });
    expect(pendingButton).toBeDisabled();

    resolveSignUp({ error: null });
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Account created successfully!"
      )
    );
  });
});
