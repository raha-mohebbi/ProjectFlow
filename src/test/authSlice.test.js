import { describe, it, expect } from "vitest";
import authReducer, { setAuth, clearAuth } from "../store/slices/authSlice";

describe("authSlice", () => {
  const initialState = {
    user: null,
    session: null,
    isAuthenticated: false,
  };

  it("should return the initial state when passed an unknown action", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("setAuth", () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    const mockSession = { access_token: "token-abc", user: mockUser };

    it("sets user, session, and marks authenticated", () => {
      const action = setAuth({ user: mockUser, session: mockSession });
      const result = authReducer(initialState, action);

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.isAuthenticated).toBe(true);
    });

    it("overwrites a previously authenticated state", () => {
      const loggedIn = {
        user: { id: "old-user" },
        session: { access_token: "old-token" },
        isAuthenticated: true,
      };
      const action = setAuth({ user: mockUser, session: mockSession });
      const result = authReducer(loggedIn, action);

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.isAuthenticated).toBe(true);
    });
  });

  describe("clearAuth", () => {
    it("clears user, session, and marks unauthenticated", () => {
      const loggedIn = {
        user: { id: "user-123" },
        session: { access_token: "token-abc" },
        isAuthenticated: true,
      };
      const result = authReducer(loggedIn, clearAuth());

      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
      expect(result.isAuthenticated).toBe(false);
    });

    it("clearAuth on already-cleared state is a no-op (stays clean)", () => {
      const result = authReducer(initialState, clearAuth());

      expect(result).toEqual(initialState);
    });
  });
});
