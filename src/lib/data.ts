import type { Vehicle } from "./types";

// ALL DATA IS SYNTHETIC. No real vehicles, owners, or documents.
// Regeneration story per vehicle is deliberate: each one demos a different report outcome.

export const FLEET: Vehicle[] = [
  {
    // The demo hero: 2 owners, ACTIVE LOAN — "don't pay until Form 35 clears"
    regNo: "GJ01AB1234",
    maker: "Maruti Suzuki",
    model: "Swift VXI",
    year: 2021,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS6",
    color: "Pearl White",
    rto: "GJ01 - Ahmedabad",
    regDate: "2021-03-15",
    chassisMasked: "MA3EYD32S00XXXXXX",
    engineMasked: "K12MNXXXXXX",
    status: "ACTIVE",
    owners: [
      {
        serial: 1,
        name: "Rajesh Patel",
        maskedName: "RA****H P***L",
        from: "2021-03-15",
        to: "2023-08-02",
      },
      { serial: 2, name: "Amit Shah", maskedName: "AM** S**H", from: "2023-08-02" },
    ],
    hypothecation: {
      active: true,
      financier: "HDFC Bank Ltd",
      since: "2023-08-02",
      form35Pending: true,
    },
    insurance: { insurer: "ICICI Lombard", validTill: "2027-02-11" },
    puc: { validTill: "2026-11-20" },
    tax: { paidTill: "2036-03-14" },
    challans: [
      {
        id: "CH-88121",
        date: "2025-12-04",
        offense: "Over-speeding (MV Act 183)",
        amount: 1500,
        status: "PAID",
      },
      {
        id: "CH-91245",
        date: "2026-05-18",
        offense: "No parking zone",
        amount: 500,
        status: "PENDING",
      },
    ],
    accident: { flag: false },
    fairPrice: { min: 465000, max: 510000 },
    odometerKm: 48200,
  },
  {
    // Clean single-owner — the "green tick" demo
    regNo: "GJ05CD5678",
    maker: "Hyundai",
    model: "i20 Sportz",
    year: 2022,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS6",
    color: "Fiery Red",
    rto: "GJ05 - Surat",
    regDate: "2022-06-10",
    chassisMasked: "MALBB51BLHMXXXXXX",
    engineMasked: "G4LAXXXXXX",
    status: "ACTIVE",
    owners: [{ serial: 1, name: "Priya Desai", maskedName: "PR*** D***I", from: "2022-06-10" }],
    hypothecation: { active: false },
    insurance: { insurer: "Bajaj Allianz", validTill: "2027-06-09" },
    puc: { validTill: "2027-01-05" },
    tax: { paidTill: "2037-06-09" },
    challans: [],
    accident: { flag: false },
    fairPrice: { min: 610000, max: 655000 },
    odometerKm: 31500,
  },
  {
    // 3 owners + accident flag — the "walk away" demo
    regNo: "GJ06EF9012",
    maker: "Honda",
    model: "City ZX",
    year: 2019,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS4",
    color: "Golden Brown",
    rto: "GJ06 - Vadodara",
    regDate: "2019-01-22",
    chassisMasked: "MRHGM6650KPXXXXXX",
    engineMasked: "L15B1XXXXXX",
    status: "ACTIVE",
    owners: [
      {
        serial: 1,
        name: "Suresh Mehta",
        maskedName: "SU****H M***A",
        from: "2019-01-22",
        to: "2021-05-30",
      },
      {
        serial: 2,
        name: "Kiran Joshi",
        maskedName: "KI**N J***I",
        from: "2021-05-30",
        to: "2024-02-14",
      },
      { serial: 3, name: "Vikram Chauhan", maskedName: "VI***M C*****N", from: "2024-02-14" },
    ],
    hypothecation: { active: false },
    insurance: { insurer: "New India Assurance", validTill: "2026-09-01" },
    puc: { validTill: "2026-07-30" },
    tax: { paidTill: "2034-01-21" },
    challans: [
      {
        id: "CH-45332",
        date: "2024-11-02",
        offense: "Signal jump (MV Act 184)",
        amount: 5000,
        status: "PENDING",
      },
      {
        id: "CH-45890",
        date: "2025-01-15",
        offense: "Driving without seatbelt",
        amount: 1000,
        status: "PENDING",
      },
      {
        id: "CH-51002",
        date: "2025-09-21",
        offense: "Over-speeding (MV Act 183)",
        amount: 2000,
        status: "PENDING",
      },
    ],
    accident: {
      flag: true,
      note: "Major damage claim recorded (insurer, 2023). Structural repair indicated.",
    },
    fairPrice: { min: 520000, max: 585000 },
    odometerKm: 88700,
  },
  {
    // Blacklisted — hard stop demo
    regNo: "GJ18GH3456",
    maker: "Tata",
    model: "Nexon XZ+",
    year: 2020,
    vehicleClass: "Motor Car (LMV)",
    fuel: "DIESEL",
    emission: "BS6",
    color: "Foliage Green",
    rto: "GJ18 - Gandhinagar",
    regDate: "2020-09-05",
    chassisMasked: "MAT62744XLPXXXXXX",
    engineMasked: "1497TCXXXXXX",
    status: "BLACKLISTED",
    owners: [{ serial: 1, name: "Deepak Rana", maskedName: "DE***K R**A", from: "2020-09-05" }],
    hypothecation: { active: false },
    insurance: { insurer: "Oriental Insurance", validTill: "2025-11-30" },
    puc: { validTill: "2025-10-11" },
    tax: { paidTill: "2030-09-04" },
    challans: [
      {
        id: "CH-99011",
        date: "2025-06-19",
        offense: "Vehicle reported in theft case",
        amount: 0,
        status: "DISPUTED",
      },
    ],
    accident: { flag: false },
    fairPrice: { min: 0, max: 0 },
    odometerKm: 61000,
  },
  {
    // Expired everything — negligence demo + expiry nudges in garage
    regNo: "GJ03JK7890",
    maker: "Maruti Suzuki",
    model: "WagonR LXI",
    year: 2017,
    vehicleClass: "Motor Car (LMV)",
    fuel: "CNG",
    emission: "BS4",
    color: "Silky Silver",
    rto: "GJ03 - Rajkot",
    regDate: "2017-04-18",
    chassisMasked: "MA3EWDE1S00XXXXXX",
    engineMasked: "K10BNXXXXXX",
    status: "ACTIVE",
    owners: [{ serial: 1, name: "Naman Doshi", maskedName: "NA*** D***I", from: "2017-04-18" }],
    hypothecation: { active: false },
    insurance: { insurer: "United India", validTill: "2026-04-02" },
    puc: { validTill: "2026-06-15" },
    tax: { paidTill: "2032-04-17" },
    challans: [
      {
        id: "CH-77120",
        date: "2026-07-01",
        offense: "Expired PUC (MV Act 190(2))",
        amount: 1000,
        status: "PENDING",
      },
    ],
    accident: { flag: false },
    fairPrice: { min: 210000, max: 245000 },
    odometerKm: 74300,
  },
  {
    // Commercial with fitness — the roadmap "commercial lane" teaser
    regNo: "GJ12MN2468",
    maker: "Mahindra",
    model: "Bolero Pik-Up",
    year: 2021,
    vehicleClass: "Goods Carrier (LGV)",
    fuel: "DIESEL",
    emission: "BS6",
    color: "White",
    rto: "GJ12 - Jamnagar",
    regDate: "2021-11-25",
    chassisMasked: "MA1ZS2GHKM2XXXXXX",
    engineMasked: "GHB4XXXXXX",
    status: "ACTIVE",
    owners: [
      {
        serial: 1,
        name: "Bharat Transport Co",
        maskedName: "BH***T T******T CO",
        from: "2021-11-25",
      },
    ],
    hypothecation: {
      active: true,
      financier: "Cholamandalam Finance",
      since: "2021-11-25",
      form35Pending: false,
    },
    insurance: { insurer: "IFFCO Tokio", validTill: "2026-11-24" },
    puc: { validTill: "2026-10-02" },
    tax: { paidTill: "2026-09-30" },
    fitness: { validTill: "2026-11-24" },
    challans: [
      {
        id: "CH-33451",
        date: "2026-02-11",
        offense: "Overloading (MV Act 194)",
        amount: 20000,
        status: "PAID",
      },
    ],
    accident: { flag: false },
    fairPrice: { min: 640000, max: 700000 },
    odometerKm: 112000,
  },
  {
    // Loan fully cleared (Form 35 done) — contrast with the hero
    regNo: "GJ27PQ1357",
    maker: "Kia",
    model: "Sonet HTK+",
    year: 2022,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS6",
    color: "Aurora Black",
    rto: "GJ27 - Ahmedabad East",
    regDate: "2022-02-14",
    chassisMasked: "MZBFP81CLNMXXXXXX",
    engineMasked: "G4FLXXXXXX",
    status: "ACTIVE",
    owners: [{ serial: 1, name: "Meera Iyer", maskedName: "ME*** I**R", from: "2022-02-14" }],
    hypothecation: { active: false },
    insurance: { insurer: "HDFC Ergo", validTill: "2027-02-13" },
    puc: { validTill: "2026-12-25" },
    tax: { paidTill: "2037-02-13" },
    challans: [],
    accident: { flag: false },
    fairPrice: { min: 780000, max: 840000 },
    odometerKm: 27800,
  },
  {
    // Scrapped via RVSF — Certificate of Deposit story
    regNo: "GJ04RS8642",
    maker: "Hyundai",
    model: "Santro Xing",
    year: 2008,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS3",
    color: "Beige",
    rto: "GJ04 - Bhavnagar",
    regDate: "2008-08-30",
    chassisMasked: "MALAA51HR8MXXXXXX",
    engineMasked: "G4HGXXXXXX",
    status: "SCRAPPED",
    owners: [
      {
        serial: 1,
        name: "Hasmukh Trivedi",
        maskedName: "HA****H T*****I",
        from: "2008-08-30",
        to: "2025-12-01",
      },
    ],
    hypothecation: { active: false },
    insurance: { insurer: "—", validTill: "2024-08-29" },
    puc: { validTill: "2024-06-01" },
    tax: { paidTill: "2023-08-29" },
    challans: [],
    accident: { flag: false },
    fairPrice: { min: 0, max: 0 },
    odometerKm: 158000,
  },
];

/**
 * The demo's "today". The fleet's validity dates are calibrated against this, so
 * every expiry check must use it — a page reading the real clock would contradict
 * the others (garage saying "expired" while the report shows the same doc valid).
 */
export const DEMO_NOW = new Date("2026-08-28");

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export const DEMO_OTP = "123456";
export const REPORT_FEE = 99;
export const TRANSFER_FEE = 530; // Form 29/30 transfer fee (mock, GJ LMV ballpark)
export const HP_TERMINATION_FEE = 100;

// Vehicles "owned" by the demo login (any mobile) — powers My Garage
export const MY_VEHICLES = ["GJ03JK7890", "GJ01AB1234"];

export function findVehicle(regNo: string): Vehicle | undefined {
  return FLEET.find(
    (v) => v.regNo.toUpperCase().replace(/\s/g, "") === regNo.toUpperCase().replace(/\s/g, "")
  );
}

export const TRANSFER_STAGES = [
  "Seller & buyer details (Form 29/30)",
  "HP termination check (Form 35)",
  "Document upload",
  "Fee payment",
  "e-Sign by seller",
  "RTO appointment",
  "RC transfer approved",
];

export function emi(principal: number, annualRatePct: number, months: number): number {
  // Guard the inputs the UI can produce: a typed negative or zero tenure would
  // otherwise render a negative or Infinite EMI as if it were financial advice.
  if (!(principal > 0) || !(months > 0) || annualRatePct < 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}
