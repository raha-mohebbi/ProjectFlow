import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── Mock Supabase before importing the component ──────────────
vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

// ── Mock react-hot-toast so <Toaster /> doesn't pollute the DOM ─
vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}));

import { supabase } from "../lib/supabase";
import LoginPage from "../features/auth/pages/LoginPage";

const renderPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form with email and password fields", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    // Yup validation errors are async — wait for them to appear
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();

    // signInWithPassword should NOT have been called
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("shows 'Must be at least 6 characters' for short passwords", async () => {
    renderPage();

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Must be at least 6 characters")).toBeInTheDocument();
  });

  it("calls signInWithPassword with correct values on valid submit", async () => {
    const mockSignIn = supabase.auth.signInWithPassword;
    mockSignIn.mockResolvedValue({ error: null });

    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });
    expect(mockSignIn).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("does not submit when validation fails for empty password", async () => {
    renderPage();

    // Valid email, but no password
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });
});
