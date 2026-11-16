/**
 * Factory for a fresh Supabase mock.
 *
 * Call inside vi.mock() factory in each test that needs the Supabase client:
 *
 *   vi.mock("../../../lib/supabase", () => ({
 *     supabase: createSupabaseMock(),
 *   }));
 */

import { vi } from "vitest";

export const createSupabaseMock = (overrides = {}) => {
  const defaults = {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  };

  return {
    auth: { ...defaults.auth, ...overrides.auth },
    from: overrides.from || defaults.from,
  };
};
