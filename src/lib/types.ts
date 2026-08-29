export type Owner = {
  serial: number;
  name: string; // full name, revealed only after consent unlock
  maskedName: string;
  from: string; // ISO date
  to?: string;
};

export type Challan = {
  id: string;
  date: string;
  offense: string;
  amount: number;
  status: "PAID" | "PENDING" | "DISPUTED";
};

export type Vehicle = {
  regNo: string;
  maker: string;
  model: string;
  year: number;
  vehicleClass: string;
  fuel: "PETROL" | "DIESEL" | "CNG" | "ELECTRIC";
  emission: string;
  color: string;
  rto: string; // e.g. "GJ01 - Ahmedabad"
  regDate: string;
  chassisMasked: string;
  engineMasked: string;
  status: "ACTIVE" | "BLACKLISTED" | "SCRAPPED";
  owners: Owner[];
  hypothecation: {
    active: boolean;
    financier?: string;
    since?: string;
    form35Pending?: boolean;
  };
  insurance: { insurer: string; validTill: string };
  puc: { validTill: string };
  tax: { paidTill: string };
  fitness?: { validTill: string }; // commercial only
  challans: Challan[];
  accident: { flag: boolean; note?: string };
  fairPrice: { min: number; max: number };
  odometerKm: number;
};

export type ApplicationType =
  | "TRANSFER_OF_OWNERSHIP"
  | "HP_TERMINATION"
  | "NOC"
  // The roadmap services (see lib/services.ts). They share this record so a
  // citizen's garage lists every application in one place, whatever produced it.
  | "FITNESS_ATS"
  | "PERMIT"
  | "LEARNER_LICENCE"
  | "DL_RENEWAL"
  | "FANCY_NUMBER"
  | "SCRAPPING"
  | "GRIEVANCE";

export type Application = {
  id: string; // e.g. GJ2026-000123
  type: ApplicationType;
  regNo: string;
  stages: string[];
  currentStage: number; // index into stages; === stages.length means complete
  createdAt: string;
  slot?: { rto: string; date: string; time: string };
};

export type Payment = {
  id: string;
  receiptNo: string;
  purpose: string;
  regNo?: string;
  amount: number;
  date: string;
  status: "SUCCESS";
};
