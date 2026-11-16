import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// ── Mock Supabase ────────────────────────────────────────────
vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("../components/layout/Loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

import { supabase } from "../lib/supabase";
import ProtectedRoute from "../app/router/ProtectedRoute";

const renderWithRoute = (initialRoute = "/dashboard") =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route
            index
            element={<div data-testid="protected-content">Dashboard</div>}
          />
        </Route>
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state while checking the session", () => {
    const getSession = vi.fn().mockImplementation(() => new Promise(() => {}));
    supabase.auth.getSession = getSession;

    renderWithRoute();

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("redirects to /login when no session is found", async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("renders protected children when a session exists", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
    });

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });
});
