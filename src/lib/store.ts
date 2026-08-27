"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Application, Payment } from "./types";
import { DEFAULT_MODEL } from "./models";

type State = {
  hydrated: boolean;
  mobile: string | null;
  locale: "en" | "hi";
  model: string;
  unlockedReports: string[];
  applications: Application[];
  payments: Payment[];
  markHydrated: () => void;
  login: (mobile: string) => void;
  logout: () => void;
  setLocale: (l: "en" | "hi") => void;
  setModel: (m: string) => void;
  unlockReport: (regNo: string) => void;
  addPayment: (p: Omit<Payment, "id" | "receiptNo" | "date" | "status">) => Payment;
  addApplication: (a: Omit<Application, "id" | "createdAt">) => Application;
  advanceApplication: (id: string) => void;
};

let counter = 0;
function uid(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${counter}`;
}

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      mobile: null,
      locale: "en",
      model: DEFAULT_MODEL,
      unlockedReports: [],
      applications: [],
      payments: [],
      markHydrated: () => set({ hydrated: true }),
      login: (mobile) => set({ mobile }),
      logout: () => set({ mobile: null }),
      setLocale: (locale) => set({ locale }),
      setModel: (model) => set({ model }),
      unlockReport: (regNo) =>
        set((s) =>
          s.unlockedReports.includes(regNo) ? s : { unlockedReports: [...s.unlockedReports, regNo] }
        ),
      addPayment: (p) => {
        const payment: Payment = {
          ...p,
          id: uid("PAY"),
          receiptNo: uid("RCPT"),
          date: new Date().toISOString(),
          status: "SUCCESS",
        };
        set((s) => ({ payments: [payment, ...s.payments] }));
        return payment;
      },
      addApplication: (a) => {
        const application: Application = {
          ...a,
          id: `GJ2026-${String(1000000 + get().applications.length + 1).slice(1)}`,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ applications: [application, ...s.applications] }));
        return application;
      },
      advanceApplication: (id) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id && a.currentStage < a.stages.length
              ? { ...a, currentStage: a.currentStage + 1 }
              : a
          ),
        })),
    }),
    {
      name: "sarathi-one",
      // Server renders the empty store; rehydrate only after mount so SSR and the
      // first client render agree. Without this a logged-in reload flashes the
      // logged-out branch and React reports a hydration mismatch.
      skipHydration: true,
      // `hydrated` is runtime-only state; persisting it would defeat the guard.
      partialize: ({ hydrated: _hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => state?.markHydrated(),
    }
  )
);

/** Call once on mount (see StoreHydrator) to load persisted state. */
export function hydrateStore() {
  void useApp.persist.rehydrate();
  // Fires even when localStorage is empty, so guarded pages never hang.
  if (!useApp.getState().hydrated) useApp.getState().markHydrated();
}
