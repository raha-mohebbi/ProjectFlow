import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// ── Mock Supabase ────────────────────────────────────────────
vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}));

import { supabase } from "../lib/supabase";
import RegisterPage from "../features/auth/pages/RegisterPage";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </MemoryRouter>
  );

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields: name, email, password, confirm password", () => {
    renderPage();

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(await screen.findByText("Please confirm your password")).toBeInTheDocument();

    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("shows 'Name must be at least 2 characters' for short names", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "A" },
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
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Name must be at least 2 characters")).toBeInTheDocument();
  });

  it("shows 'Passwords must match' when confirmation differs", async () => {
    renderPage();

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
      target: { value: "different" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Passwords must match")).toBeInTheDocument();
  });

  it("calls signUp with correct payload on valid submit", async () => {
    const mockSignUp = supabase.auth.signUp;
    mockSignUp.mockResolvedValue({ error: null });

    renderPage();

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
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledTimes(1);
    });
    expect(mockSignUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      options: { data: { name: "Ali Test" } },
    });
  });

  it("shows 'Password must be at least 6 characters' for short password", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Ali Test" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "12345" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(
      await screen.findByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
  });
});
