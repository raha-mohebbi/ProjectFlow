import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// ── Mock Supabase before importing AuthProvider ───────────────
const { getSession, onAuthStateChange, unsubscribe } = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: { getSession, onAuthStateChange },
  },
}));

import AuthProvider from "../app/providers/AuthProvider";
import authReducer from "../store/slices/authSlice";

// ── Probe component that exposes the Redux auth state ─────────
const Probe = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <span data-testid="auth-status">
        {isAuthenticated ? "authed" : "guest"}
      </span>
      <span data-testid="user-email">{user?.email ?? "none"}</span>
    </>
  );
};

const renderProvider = () =>
  render(
    <Provider store={configureStore({ reducer: { auth: authReducer } })}>
      <AuthProvider>
        <Probe />
      </AuthProvider>
    </Provider>
  );

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe } },
    });
  });

  it("dispatches setAuth when an initial session exists", async () => {
    getSession.mockResolvedValue({
      data: {
        session: { user: { id: "u1", email: "a@b.com" }, access_token: "tok" },
      },
    });

    renderProvider();

    expect(await screen.findByTestId("auth-status")).toHaveTextContent("authed");
    expect(screen.getByTestId("user-email")).toHaveTextContent("a@b.com");
  });

  it("stays unauthenticated when there is no initial session", async () => {
    getSession.mockResolvedValue({ data: { session: null } });

    renderProvider();

    await waitFor(() => expect(getSession).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("auth-status")).toHaveTextContent("guest");
    expect(screen.getByTestId("user-email")).toHaveTextContent("none");
  });

  it("dispatches setAuth when onAuthStateChange emits a session", async () => {
    getSession.mockResolvedValue({ data: { session: null } });

    renderProvider();
    await waitFor(() => expect(getSession).toHaveBeenCalled());

    const callback = onAuthStateChange.mock.calls[0][0];
    await act(async () => {
      callback("SIGNED_IN", { user: { id: "u1", email: "real@user.com" } });
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("authed");
    expect(screen.getByTestId("user-email")).toHaveTextContent("real@user.com");
  });

  it("dispatches clearAuth when onAuthStateChange emits a null session", async () => {
    getSession.mockResolvedValue({
      data: { session: { user: { id: "u1", email: "a@b.com" } } },
    });

    renderProvider();
    expect(await screen.findByTestId("auth-status")).toHaveTextContent("authed");

    const callback = onAuthStateChange.mock.calls[0][0];
    await act(async () => {
      callback("SIGNED_OUT", null);
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("guest");
    expect(screen.getByTestId("user-email")).toHaveTextContent("none");
  });

  it("unsubscribes from auth changes on unmount", () => {
    // Never settles → no state update can happen after unmount
    getSession.mockReturnValue(new Promise(() => {}));

    const { unmount } = renderProvider();
    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
