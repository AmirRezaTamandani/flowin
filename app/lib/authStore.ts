"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const MOCK_OTP_CODE = "123456";

type AuthState = {
  phone: string | null;
  token: string | null;
  hasHydrated: boolean;
  login: (phone: string) => void;
  logout: () => void;
  markHydrated: () => void;
};

function createMockToken(phone: string): string {
  return `mock-jwt-${phone}-${Date.now()}`;
}

export function isMockOtpValid(code: string): boolean {
  return code === MOCK_OTP_CODE;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      phone: null,
      token: null,
      hasHydrated: false,
      login: (phone) =>
        set({
          phone,
          token: createMockToken(phone),
        }),
      logout: () =>
        set({
          phone: null,
          token: null,
        }),
      markHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "mock-auth-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phone: state.phone,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);
