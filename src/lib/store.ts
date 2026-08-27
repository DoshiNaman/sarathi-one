"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Application, Payment } from "./types";

type State = {
  mobile: string | null;
  locale: "en" | "hi";
  unlockedReports: string[];
  applications: Application[];
  payments: Payment[];
  login: (mobile: string) => void;
  logout: () => void;
  setLocale: (l: "en" | "hi") => void;
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
      mobile: null,
      locale: "en",
      unlockedReports: [],
      applications: [],
      payments: [],
      login: (mobile) => set({ mobile }),
      logout: () => set({ mobile: null }),
      setLocale: (locale) => set({ locale }),
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
          id: `GJ2026-${String(100000 + get().applications.length + 1).slice(1)}`,
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
    { name: "sarathi-one" }
  )
);
