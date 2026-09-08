import type { Vehicle } from "./types";

// ALL DATA IS SYNTHETIC. No real vehicles, owners, or documents.
// Regeneration story per vehicle is deliberate: each one demos a different report outcome.

/**
 * Which 3D model shows a given car.
 *
 * Keyed by the car, not by the registration number. Keying by plate meant the
 * name came from the database while the model came from the code, so moving a
 * car between records showed one car's name over another car's body. Whatever
 * the record says it is, the matching model loads.
 */
const MODEL_FILES = new Map([
  ["maruti suzuki swift vxi", "/models/swift.glb"],
  ["hyundai i20 n line", "/models/i20.glb"],
  ["honda city zx", "/models/city.glb"],
  ["tata safari xz+", "/models/safari.glb"],
  ["tata safari dicor", "/models/safari.glb"],
  ["maruti suzuki wagonr lxi", "/models/wagonr.glb"],
  ["kia sonet htk+", "/models/sonet.glb"],
  ["hyundai santro xing", "/models/santro.glb"],
  ["honda civic vx", "/models/civic.glb"],
  ["honda jazz v", "/models/jazz.glb"],
  ["honda accord hybrid", "/models/accord.glb"],
  ["maruti suzuki ertiga zxi", "/models/ertiga.glb"],
  // Deliberately absent: the Bolero. Our only Bolero is a Pik-Up — a goods
  // carrier with an open cargo bed — and the model we hold is the SUV. Anyone
  // can tell those two apart, so that record takes the generic body instead of
  // a car it is not.
]);

export function modelFor(maker: string, model: string) {
  return MODEL_FILES.get(`${maker} ${model}`.trim().toLowerCase());
}

export const FLEET: Vehicle[] = [
  {
    // The demo hero: 2 owners, ACTIVE LOAN — "don't pay until Form 35 clears"
    regNo: "GJ01AB1234",
    maker: "Honda",
    model: "City ZX",
    year: 2021,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS6",
    color: "Pearl White",
    rto: "GJ01 - Ahmedabad",
    regDate: "2021-03-15",
    chassisMasked: "MRHGM6650KPXXXXXX",
    engineMasked: "L15B1XXXXXX",
    status: "ACTIVE",
    owners: [
      {
        serial: 1,
        name: "Rajesh Patel",
        maskedName: "RA****H P***L",
        from: "2021-03-15",
        to: "2023-08-02",
      },
      { serial: 2, name: "Amit Shroff", maskedName: "AM** S****F", from: "2023-08-02" },
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
    fairPrice: { min: 780000, max: 880000 },
    // No sourced figure for a 2021 City — see the note on KA05EF9012.
    odometerKm: 48200,
  },
  {
    // Clean single-owner — the "green tick" demo. Registered in Maharashtra.
    regNo: "MH12CD5678",
    maker: "Hyundai",
    // The model on screen is an i20 N Line, so the record says N Line. The trim
    // is on the badge and the bumper — naming a Sportz over that body is
    // exactly the mismatch this fleet must not have.
    model: "i20 N Line",
    year: 2022,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS6",
    color: "Fiery Red",
    rto: "MH12 - Pune",
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
    // i20 1.2 MT, Delhi, Mar 2022 list — see research/fleet-exshowroom-prices.md
    exShowroomPrice: 788000,
    odometerKm: 31500,
  },
  {
    // 3 owners + accident flag — the "walk away" demo. Registered in Karnataka.
    regNo: "KA05EF9012",
    maker: "Maruti Suzuki",
    model: "Swift VXI",
    year: 2019,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS4",
    color: "Golden Brown",
    rto: "KA05 - Bengaluru",
    regDate: "2019-01-22",
    chassisMasked: "MA3EYD32S00XXXXXX",
    engineMasked: "K12MNXXXXXX",
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
    fairPrice: { min: 415000, max: 470000 },
    // No sourced figure: the research covers a 2021 Swift and a 2019 City, and
    // this record is a 2019 Swift. Carrying either forward would put a real
    // car's launch price on the wrong year, so the insurance row reads
    // "not available" instead. It is past the five-year schedule regardless.
    odometerKm: 88700,
  },
  {
    // Blacklisted — hard stop demo
    regNo: "GJ18GH3456",
    maker: "Tata",
    model: "Safari XZ+",
    year: 2021,
    vehicleClass: "Motor Car (LMV)",
    fuel: "DIESEL",
    emission: "BS6",
    color: "Foliage Green",
    rto: "GJ18 - Gandhinagar",
    regDate: "2021-09-05",
    chassisMasked: "MAT62744XLPXXXXXX",
    engineMasked: "1497TCXXXXXX",
    status: "BLACKLISTED",
    owners: [{ serial: 1, name: "Deepak Rana", maskedName: "DE***K R**A", from: "2021-09-05" }],
    hypothecation: { active: false },
    insurance: { insurer: "Oriental Insurance", validTill: "2025-11-30" },
    puc: { validTill: "2025-10-11" },
    tax: { paidTill: "2031-09-04" },
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
    // Blacklisted, so the report never quotes a price for it — the verdict is
    // "do not buy at any price", and a band would argue with that.
    fairPrice: { min: 0, max: 0 },
    // No ex-showroom figure: the sourced research covered a Nexon, and this
    // record is a Safari. Rather than carry the wrong car's price forward the
    // insurance row simply reads "not available for this record".
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
    // WagonR LXI CNG, Noida, 2017 — see research/fleet-exshowroom-prices.md
    exShowroomPrice: 470000,
    odometerKm: 74300,
  },
  {
    // Commercial with fitness — the roadmap "commercial lane" teaser.
    // Registered in Rajasthan.
    regNo: "RJ14MN2468",
    maker: "Mahindra",
    model: "Bolero Pik-Up",
    year: 2021,
    vehicleClass: "Goods Carrier (LGV)",
    fuel: "DIESEL",
    emission: "BS6",
    color: "White",
    rto: "RJ14 - Jaipur",
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
    // Loan fully cleared (Form 35 done) — contrast with the hero. Registered in
    // Delhi, but petrol and recent, so it can still move to any state — the
    // "clean Delhi car" counterpoint to the old Delhi diesel below.
    regNo: "DL03PQ1357",
    maker: "Kia",
    model: "Sonet HTK+",
    year: 2022,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS6",
    color: "Aurora Black",
    rto: "DL03 - Delhi (Sarai Kale Khan)",
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
    // Sonet HTK+ 1.2 MT, New Delhi, 2022 — see research/fleet-exshowroom-prices.md
    exShowroomPrice: 879000,
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
  {
    // The inter-state trap: an old Delhi diesel. Clean papers, single owner, no
    // loan — the ONLY problem is that Delhi will not issue an NOC for a diesel
    // 15 years or older, so it cannot legally leave Delhi. This is the flagship
    // case for the "Where can this car go?" check.
    // See research/phase2-interstate-build-plan.md.
    regNo: "DL8CAF2358",
    maker: "Tata",
    model: "Safari DICOR",
    year: 2011,
    vehicleClass: "Motor Car (LMV)",
    fuel: "DIESEL",
    emission: "BS4",
    color: "Silver",
    rto: "DL08 - Delhi (Wazirpur)",
    regDate: "2011-05-10",
    chassisMasked: "MAT44451XBSXXXXXX",
    engineMasked: "2179DIXXXXXX",
    status: "ACTIVE",
    owners: [{ serial: 1, name: "Arun Malhotra", maskedName: "AR*N M******A", from: "2011-05-10" }],
    hypothecation: { active: false },
    insurance: { insurer: "National Insurance", validTill: "2027-01-15" },
    puc: { validTill: "2026-11-10" },
    tax: { paidTill: "2026-05-09" },
    challans: [],
    accident: { flag: false },
    fairPrice: { min: 260000, max: 320000 },
    odometerKm: 141000,
  },
  {
    // Petrol Civic, one owner, nothing against it — the plain "yes, buy it" case
    // for a car people actually shop for used.
    regNo: "MH14CV2019",
    maker: "Honda",
    model: "Civic VX",
    year: 2020,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS6",
    color: "Radiant Red",
    rto: "MH14 - Pune",
    regDate: "2020-07-18",
    chassisMasked: "MAKFC1650L1XXXXXX",
    engineMasked: "L15Z1XXXXXX",
    status: "ACTIVE",
    owners: [
      { serial: 1, name: "Ninad Kulkarni", maskedName: "NI**D K*******I", from: "2020-07-18" },
    ],
    hypothecation: { active: false },
    insurance: { insurer: "Bajaj Allianz", validTill: "2027-07-17" },
    puc: { validTill: "2027-01-12" },
    tax: { paidTill: "2035-07-17" },
    challans: [],
    accident: { flag: false },
    fairPrice: { min: 1150000, max: 1290000 },
    odometerKm: 42100,
  },
  {
    // A hatchback that has changed hands twice and is past the IDV schedule —
    // the ordinary used car, neither a bargain nor a warning.
    regNo: "GJ05JZ4471",
    maker: "Honda",
    model: "Jazz V",
    year: 2018,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS4",
    color: "Alabaster Silver",
    rto: "GJ05 - Surat",
    regDate: "2018-09-04",
    chassisMasked: "MAKGK1680J1XXXXXX",
    engineMasked: "L12B7XXXXXX",
    status: "ACTIVE",
    owners: [
      {
        serial: 1,
        name: "Falguni Desai",
        maskedName: "FA****I D***I",
        from: "2018-09-04",
        to: "2022-06-30",
      },
      { serial: 2, name: "Kartik Shah", maskedName: "KA***K S**H", from: "2022-06-30" },
    ],
    hypothecation: { active: false },
    insurance: { insurer: "New India Assurance", validTill: "2026-09-03" },
    puc: { validTill: "2026-03-19" },
    tax: { paidTill: "2033-09-03" },
    challans: [
      {
        id: "CH-51820",
        date: "2026-01-22",
        offense: "Signal jumping (MV Act 177)",
        amount: 1000,
        status: "PENDING",
      },
    ],
    accident: { flag: false },
    fairPrice: { min: 480000, max: 545000 },
    odometerKm: 79400,
  },
  {
    // The expensive one, and it carries a live loan with Form 35 unfiled — the
    // same trap as the hero car, at four times the money.
    regNo: "KA03AC7788",
    maker: "Honda",
    model: "Accord Hybrid",
    year: 2019,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS6",
    color: "Modern Steel",
    rto: "KA03 - Bengaluru",
    regDate: "2019-12-11",
    chassisMasked: "MAKCR6570K1XXXXXX",
    engineMasked: "LFA1XXXXXX",
    status: "ACTIVE",
    owners: [{ serial: 1, name: "Sridhar Iyer", maskedName: "SR****R I**R", from: "2019-12-11" }],
    hypothecation: {
      active: true,
      financier: "Kotak Mahindra Prime",
      since: "2019-12-11",
      form35Pending: true,
    },
    insurance: { insurer: "HDFC ERGO", validTill: "2026-12-10" },
    puc: { validTill: "2026-09-27" },
    tax: { paidTill: "2034-12-10" },
    challans: [],
    accident: { flag: false },
    fairPrice: { min: 2150000, max: 2380000 },
    odometerKm: 61800,
  },
  {
    // CNG and seven seats — the family MPV, and the newest car in the fleet, so
    // the insurance row still has a GR.8 slab to sit on.
    regNo: "GJ01ER5566",
    maker: "Maruti Suzuki",
    model: "Ertiga ZXI",
    year: 2022,
    vehicleClass: "Motor Car (LMV)",
    fuel: "CNG",
    emission: "BS6",
    color: "Pearl Auburn Red",
    rto: "GJ01 - Ahmedabad",
    regDate: "2022-04-26",
    chassisMasked: "MA3EYD61S00XXXXXX",
    engineMasked: "K15CXXXXXX",
    status: "ACTIVE",
    owners: [{ serial: 1, name: "Hiren Trivedi", maskedName: "HI**N T*****I", from: "2022-04-26" }],
    hypothecation: { active: false },
    insurance: { insurer: "ICICI Lombard", validTill: "2027-04-25" },
    puc: { validTill: "2026-12-08" },
    tax: { paidTill: "2037-04-25" },
    challans: [],
    accident: { flag: false },
    fairPrice: { min: 940000, max: 1040000 },
    // Ertiga ZXi CNG, Delhi, 2022 list — see research/fleet-exshowroom-prices.md
    exShowroomPrice: 1149000,
    odometerKm: 34600,
  },
  {
    // Four owners in ten years. Nothing is wrong with it — the point is what
    // that does to the price, and that the public lookup never tells you.
    // Shares the City body with GJ01AB1234; different plate, different record.
    regNo: "TN09CT4188",
    maker: "Honda",
    model: "City ZX",
    year: 2016,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS4",
    color: "Silky Silver",
    rto: "TN09 - Chennai",
    regDate: "2016-02-29",
    chassisMasked: "MRHGM2650GPXXXXXX",
    engineMasked: "L15A7XXXXXX",
    status: "ACTIVE",
    owners: [
      {
        serial: 1,
        name: "Vasanth Rajan",
        maskedName: "VA****H R***N",
        from: "2016-02-29",
        to: "2018-08-12",
      },
      {
        serial: 2,
        name: "Meera Krishnan",
        maskedName: "ME**A K******N",
        from: "2018-08-12",
        to: "2021-05-03",
      },
      {
        serial: 3,
        name: "Arun Selvam",
        maskedName: "AR*N S****M",
        from: "2021-05-03",
        to: "2024-01-19",
      },
      { serial: 4, name: "Divya Raman", maskedName: "DI**A R***N", from: "2024-01-19" },
    ],
    hypothecation: { active: false },
    insurance: { insurer: "United India Insurance", validTill: "2027-02-27" },
    puc: { validTill: "2026-11-15" },
    tax: { paidTill: "2031-02-28" },
    challans: [],
    accident: { flag: false },
    fairPrice: { min: 395000, max: 450000 },
    odometerKm: 112000,
  },
  {
    // The trap. Three years old, 28,000 km, one owner, papers immaculate — and
    // a structural repair on the insurer's record. Everything the eye can check
    // says buy it.
    // Shares the i20 body with MH12CD5678.
    regNo: "WB06IN2270",
    maker: "Hyundai",
    model: "i20 N Line",
    year: 2023,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS6",
    color: "Fiery Red",
    rto: "WB06 - Kolkata",
    regDate: "2023-06-08",
    chassisMasked: "MALBM51CLPMXXXXXX",
    engineMasked: "G4LDXXXXXX",
    status: "ACTIVE",
    owners: [{ serial: 1, name: "Anirban Ghosh", maskedName: "AN****N G***H", from: "2023-06-08" }],
    hypothecation: { active: false },
    insurance: { insurer: "Reliance General", validTill: "2027-06-07" },
    puc: { validTill: "2027-01-30" },
    tax: { paidTill: "2038-06-07" },
    challans: [],
    accident: {
      flag: true,
      note: "Front-end collision claim settled (insurer, 2024). Chassis member replaced.",
    },
    fairPrice: { min: 690000, max: 760000 },
    odometerKm: 28400,
  },
  {
    // Everything has lapsed at once — insurance, PUC and road tax — and there
    // are unpaid challans on top. The buyer inherits all of it.
    // Shares the WagonR body with GJ03JK7890.
    regNo: "UP32WR9034",
    maker: "Maruti Suzuki",
    model: "WagonR LXI",
    year: 2016,
    vehicleClass: "Motor Car (LMV)",
    fuel: "PETROL",
    emission: "BS4",
    color: "Beige",
    rto: "UP32 - Lucknow",
    regDate: "2016-10-21",
    chassisMasked: "MA3ERLA1S00XXXXXX",
    engineMasked: "K10BXXXXXX",
    status: "ACTIVE",
    owners: [
      {
        serial: 1,
        name: "Shalini Verma",
        maskedName: "SH****I V***A",
        from: "2016-10-21",
        to: "2020-12-04",
      },
      { serial: 2, name: "Rakesh Yadav", maskedName: "RA***H Y***V", from: "2020-12-04" },
    ],
    hypothecation: { active: false },
    insurance: { insurer: "Oriental Insurance", validTill: "2026-02-14" },
    puc: { validTill: "2025-11-30" },
    tax: { paidTill: "2026-06-30" },
    challans: [
      {
        id: "CH-77302",
        date: "2025-09-16",
        offense: "Driving without valid insurance (MV Act 196)",
        amount: 2000,
        status: "PENDING",
      },
      {
        id: "CH-77451",
        date: "2026-03-08",
        offense: "No parking zone",
        amount: 500,
        status: "PENDING",
      },
    ],
    accident: { flag: false },
    fairPrice: { min: 195000, max: 235000 },
    odometerKm: 96800,
  },
];

/**
 * The demo's "today". The fleet's validity dates are calibrated against this, so
 * every expiry check must use it — a page reading the real clock would contradict
 * the others (garage saying "expired" while the report shows the same doc valid).
 */
export const DEMO_NOW = new Date("2026-08-28");

/**
 * The car the landing page tells its story about.
 *
 * It has to be one with an active loan and an unfiled Form 35 — that is the
 * whole point of the pitch — so it is looked up by that condition rather than
 * pinned to a registration number that can move.
 */
export const HERO = FLEET.find((v) => v.hypothecation.form35Pending) ?? FLEET[0];

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
  // Not "upload": this step pulls from DigiLocker, and the stage name sat
  // directly above a card saying nothing is uploaded.
  "Documents from DigiLocker",
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
