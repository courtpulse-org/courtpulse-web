// Realistic (but entirely fictional) Lagos court data, generated for "today".
// Judges, lawyers, firms, parties and companies are invented. Court buildings
// and divisions are the real public structure of the Lagos judiciary.

import {
  addDays,
  addWorkingDays,
  minutesAgo,
  normalizeSuitNumber,
  pick,
  rng,
  todayLagos,
} from "./lib";

export function buildSeed(): any {
  const today = todayLagos();
  const r = rng(today);
  const year = Number(today.slice(0, 4));

  // ── Structure ──────────────────────────────────────────────────────────
  const divisions = [
    {
      id: "div-lagos",
      name: "Lagos (Igbosere)",
      state: "Lagos",
      court_system: "LSHC",
      prefix: "LD",
    },
    {
      id: "div-ikeja",
      name: "Ikeja",
      state: "Lagos",
      court_system: "LSHC",
      prefix: "ID",
    },
    {
      id: "div-ikorodu",
      name: "Ikorodu",
      state: "Lagos",
      court_system: "LSHC",
      prefix: "IKD",
    },
    {
      id: "div-epe",
      name: "Epe",
      state: "Lagos",
      court_system: "LSHC",
      prefix: "EPD",
    },
    {
      id: "div-fhc-lagos",
      name: "Lagos Judicial Division",
      state: "Lagos",
      court_system: "FHC",
      prefix: "FHC/L/CS",
    },
  ];

  const complexes = [
    {
      id: "cx-igbosere",
      name: "High Court, Igbosere",
      division_id: "div-lagos",
      address: "Igbosere Road, Lagos Island",
      latitude: 6.4526,
      longitude: 3.3952,
    },
    {
      id: "cx-tbs",
      name: "High Court, Tafawa Balewa Square",
      division_id: "div-lagos",
      address: "TBS, Lagos Island",
      latitude: 6.4474,
      longitude: 3.4009,
    },
    {
      id: "cx-ikeja",
      name: "High Court, Ikeja",
      division_id: "div-ikeja",
      address: "Judiciary Complex, Ikeja",
      latitude: 6.6018,
      longitude: 3.3515,
    },
    {
      id: "cx-ikorodu",
      name: "High Court, Ikorodu",
      division_id: "div-ikorodu",
      address: "Ikorodu",
      latitude: 6.6194,
      longitude: 3.5105,
    },
    {
      id: "cx-epe",
      name: "High Court, Epe",
      division_id: "div-epe",
      address: "Epe",
      latitude: 6.5841,
      longitude: 3.9834,
    },
    {
      id: "cx-fhc-ikoyi",
      name: "Federal High Court, Ikoyi",
      division_id: "div-fhc-lagos",
      address: "Ikoyi, Lagos",
      latitude: 6.4488,
      longitude: 3.4337,
    },
  ];

  const judges = [
    ["jdg-01", "Folasade A. Ogunleye"],
    ["jdg-02", "Chukwuemeka N. Obi"],
    ["jdg-03", "Adebisi T. Lawal"],
    ["jdg-04", "Ibrahim K. Musa"],
    ["jdg-05", "Olufunmilayo R. Adeyinka"],
    ["jdg-06", "Ngozi E. Okonkwo"],
    ["jdg-07", "Babatunde O. Alli"],
    ["jdg-08", "Aisha S. Bello"],
    ["jdg-09", "Tokunbo M. Ajayi"],
    ["jdg-10", "Emeka P. Nwosu"],
    ["jdg-11", "Oluwaseun A. Idowu"],
    ["jdg-12", "Kehinde O. Adewale"],
    ["jdg-13", "Halima Y. Abdullahi"],
    ["jdg-14", "Chidinma U. Eze"],
    ["jdg-15", "Rotimi B. Olatunji"],
    ["jdg-16", "Yetunde F. Coker-Ade"],
  ].map(([id, name]) => ({ id, title: "Hon. Justice", name }));

  const room = (
    id: string,
    name: string,
    complex_id: string,
    judge_id: string,
    time = "09:00",
  ) => {
    const cx = complexes.find((c) => c.id === complex_id)!;
    return {
      id,
      name,
      complex_id,
      division_id: cx.division_id,
      judge_id,
      default_sitting_time: time,
    };
  };
  const courtrooms = [
    room("cr-ikj-1", "Court 1", "cx-ikeja", "jdg-01"),
    room("cr-ikj-2", "Court 2", "cx-ikeja", "jdg-02"),
    room("cr-ikj-5", "Court 5", "cx-ikeja", "jdg-03"),
    room("cr-ikj-8", "Court 8", "cx-ikeja", "jdg-04", "09:30"),
    room("cr-ikj-12", "Court 12", "cx-ikeja", "jdg-05"),
    room("cr-ikj-16", "Court 16", "cx-ikeja", "jdg-06"),
    room("cr-igb-3", "Court 3", "cx-igbosere", "jdg-07"),
    room("cr-igb-7", "Court 7", "cx-igbosere", "jdg-08"),
    room("cr-igb-11", "Court 11", "cx-igbosere", "jdg-09"),
    room("cr-tbs-2", "Court 2", "cx-tbs", "jdg-10"),
    room("cr-tbs-4", "Court 4", "cx-tbs", "jdg-11"),
    room("cr-ikd-1", "Court 1", "cx-ikorodu", "jdg-12"),
    room("cr-epe-1", "Court 1", "cx-epe", "jdg-13"),
    room("cr-fhc-3", "Court 3", "cx-fhc-ikoyi", "jdg-14"),
    room("cr-fhc-6", "Court 6", "cx-fhc-ikoyi", "jdg-15"),
  ];

  // Assignments change over time: Ikeja Court 5 changed hands this legal year.
  const judge_assignments = [
    ...courtrooms.map((c) => ({
      id: `ja-${c.id}`,
      courtroom_id: c.id,
      judge_id: c.judge_id,
      start_date: c.id === "cr-ikj-5" ? `${year}-09-15` : `${year - 2}-09-18`,
      end_date: null,
    })),
    {
      id: "ja-old-ikj-5",
      courtroom_id: "cr-ikj-5",
      judge_id: "jdg-16",
      start_date: `${year - 3}-09-20`,
      end_date: `${year}-07-10`,
    },
  ];

  // ── People ─────────────────────────────────────────────────────────────
  const users: any[] = [
    {
      id: "u-law-1",
      role: "LAWYER",
      first_name: "Adaeze",
      last_name: "Okafor",
      phone: "+2348011111111",
      email: "adaeze@okaforpartners.ng",
      enrolment_number: "SCN/045812",
      firm: "Okafor & Partners",
      year_of_call: 2015,
      is_verified: true,
    },
    {
      id: "u-law-2",
      role: "LAWYER",
      first_name: "Tunde",
      last_name: "Oyelaran",
      phone: "+2348022222222",
      enrolment_number: "SCN/061177",
      firm: "Oyelaran Legal Practitioners",
      year_of_call: 2018,
      is_verified: true,
    },
    {
      id: "u-law-3",
      role: "LAWYER",
      first_name: "Musa",
      last_name: "Garba",
      phone: "+2348033333333",
      enrolment_number: "SCN/052290",
      firm: "Garba & Associates",
      year_of_call: 2016,
      is_verified: true,
    },
    {
      id: "u-law-4",
      role: "LAWYER",
      first_name: "Kemi",
      last_name: "Ashiru",
      phone: "+2348044444444",
      enrolment_number: "SCN/070431",
      firm: "Ashiru Law Firm",
      year_of_call: 2020,
      is_verified: true,
    },
    {
      id: "u-law-5",
      role: "LAWYER",
      first_name: "Ifeoma",
      last_name: "Nnaji",
      phone: "+2348055555555",
      enrolment_number: "SCN/066902",
      firm: "Nnaji, Ude & Co.",
      year_of_call: 2019,
      is_verified: true,
    },
    {
      id: "u-law-6",
      role: "LAWYER",
      first_name: "Segun",
      last_name: "Odukoya",
      phone: "+2348066666666",
      enrolment_number: "SCN/073815",
      firm: "Lexbridge Attorneys",
      year_of_call: 2021,
      is_verified: false,
    },
    {
      id: "u-law-7",
      role: "LAWYER",
      first_name: "Bolaji",
      last_name: "Akinola",
      phone: "+2348077777777",
      enrolment_number: "SCN/074402",
      firm: "Akinola & Akinola",
      year_of_call: 2022,
      is_verified: false,
    },
    {
      id: "u-reg-1",
      role: "REGISTRAR",
      first_name: "Grace",
      last_name: "Adeniyi",
      phone: "+2348091111111",
      email: "registrar@courtpulse.ng",
      password: "Registrar12345!",
      staff_title: "Court Registrar",
      courtroom_ids: ["cr-ikj-1", "cr-ikj-2", "cr-ikj-5"],
      is_verified: true,
    },
    {
      id: "u-reg-2",
      role: "REGISTRAR",
      first_name: "Samuel",
      last_name: "Etim",
      phone: "+2348092222222",
      email: "s.etim@courtpulse.ng",
      password: "Registrar12345!",
      staff_title: "Court Registrar",
      courtroom_ids: ["cr-igb-3", "cr-igb-7", "cr-igb-11"],
      is_verified: true,
    },
    {
      id: "u-reg-3",
      role: "REGISTRAR",
      first_name: "Blessing",
      last_name: "Umoh",
      phone: "+2348093333333",
      email: "b.umoh@courtpulse.ng",
      password: "Registrar12345!",
      staff_title: "Court Clerk",
      courtroom_ids: ["cr-fhc-3"],
      is_verified: false,
    },
    {
      id: "u-admin",
      role: "ADMIN",
      first_name: "Olumide",
      last_name: "Coker",
      phone: "+2348090000000",
      email: "admin@courtpulse.ng",
      password: "Admin12345!",
      staff_title: "Platform Admin",
      courtroom_ids: [],
      is_verified: true,
    },
  ].map((u) => ({
    created_at: minutesAgo(60 * 24 * (30 + Math.floor(r() * 200))),
    ...u,
  }));

  const lawyerNames = users
    .filter((u) => u.role === "LAWYER")
    .map((u: any) => `${u.first_name[0]}. ${u.last_name}`);
  const counselPool = [
    ...lawyerNames,
    "O. Adeyemi SAN",
    "C. Uzor",
    "F. Balogun",
    "T. Ekanem",
    "A. Olaniyan",
    "E. Ibekwe",
    "Y. Suleiman",
    "D. Akpan",
    "R. Odunsi",
    "N. Chukwu SAN",
    "S. Ogundipe",
    "P. Effiong",
  ];

  // ── Cases & cause lists ────────────────────────────────────────────────
  const claimants = [
    "Adeyemi",
    "Okonjo",
    "Balogun",
    "Eze",
    "Ibrahim",
    "Okoro",
    "Adebayo",
    "Nwachukwu",
    "Oladipo",
    "Chukwu",
    "Afolabi",
    "Danladi",
    "Ogunbanjo",
    "Umeh",
    "Salawu",
    "Onyeka",
  ];
  const defendants = [
    "Lekki Pearl Estates Ltd",
    "Oceanic Crest Ltd",
    "Harbourline Logistics Ltd",
    "Sunview Properties Ltd",
    "Greenfield Microfinance Bank",
    "Atlantic Freight Services",
    "Mainland Motors Ltd",
    "Crestwood Insurance Plc",
    "Lagos State Govt & Anor",
    "Primewell Hospitals Ltd",
    "Bluewater Marine Ltd",
    "Novaline Telecoms Ltd",
    "Registered Trustees of Grace Assembly",
    "Ikeja Mall Tenants Assoc.",
    "Kings Court Hotels Ltd",
  ];
  const businessWeights = [
    "MENTION",
    "MENTION",
    "MENTION",
    "HEARING",
    "HEARING",
    "MOTION",
    "MOTION",
    "ADOPTION",
    "RULING",
    "JUDGMENT",
  ];

  const suitFor = (division: string, serial: number, yr: number) => {
    const d = divisions.find((x) => x.id === division)!;
    if (d.court_system === "FHC") return `FHC/L/CS/${serial}/${yr}`;
    const gcm = r() < 0.3 ? "GCM" : "";
    return `${d.prefix}/${serial}${gcm}/${yr}`;
  };

  const makeItem = (
    courtroom: { id: string; division_id: string },
    n: number,
    extra: Record<string, unknown> = {},
  ): any => {
    const suit = suitFor(
      courtroom.division_id,
      100 + Math.floor(r() * 3800),
      year - Math.floor(r() * 4),
    );
    const title =
      r() < 0.15
        ? `The State v. ${pick(r, claimants)} & ${1 + Math.floor(r() * 3)} Ors`
        : `${pick(r, claimants)} v. ${pick(r, defendants)}`;
    return {
      id: `cli-${courtroom.id}-${n}`,
      item_number: n,
      suit_number: suit,
      suit_number_normalized: normalizeSuitNumber(suit),
      title,
      business: pick(r, businessWeights),
      claimant_counsel: pick(r, counselPool),
      defendant_counsel: pick(r, counselPool),
      outcome: "PENDING",
      next_date: null,
      next_business: null,
      note: null,
      ...extra,
    };
  };

  // The demo lawyer's matters, placed into specific rooms/positions so the
  // overview tells a story out of the box.
  const demoCases = [
    {
      key: "a",
      courtroom_id: "cr-ikj-5",
      item: 7,
      suit_number: "ID/2847GCM/2023",
      title: "Okafor v. Harbourline Logistics Ltd",
      business: "HEARING",
      side: "CLAIMANT",
    },
    {
      key: "b",
      courtroom_id: "cr-ikj-2",
      item: 4,
      suit_number: "ID/1190/2024",
      title: "Balogun v. Sunview Properties Ltd",
      business: "MENTION",
      side: "DEFENDANT",
    },
    {
      key: "c",
      courtroom_id: "cr-igb-7",
      item: 3,
      suit_number: "LD/3312/2022",
      title: "Estate of Late Chief Adeyemi v. Oceanic Crest Ltd",
      business: "ADOPTION",
      side: "CLAIMANT",
    },
    {
      key: "d",
      courtroom_id: "cr-fhc-3",
      item: 12,
      suit_number: "FHC/L/CS/1488/2024",
      title: "Novaline Telecoms Ltd v. Nigerian Communications Commission",
      business: "MOTION",
      side: "CLAIMANT",
    },
    {
      key: "e",
      courtroom_id: "cr-ikj-1",
      item: 2,
      suit_number: "ID/774/2025",
      title: "Primewell Hospitals Ltd v. Eze",
      business: "MENTION",
      side: "DEFENDANT",
    },
  ];

  const cause_lists: any[] = [];
  for (const c of courtrooms) {
    const size = 9 + Math.floor(r() * 8);
    const items: any[] = [];
    for (let n = 1; n <= size; n++) {
      const demo = demoCases.find(
        (d) => d.courtroom_id === c.id && d.item === n,
      );
      items.push(
        demo
          ? makeItem(c, n, {
              suit_number: demo.suit_number,
              suit_number_normalized: normalizeSuitNumber(demo.suit_number),
              title: demo.title,
              business: demo.business,
              claimant_counsel:
                demo.side === "CLAIMANT" ? "A. Okafor" : pick(r, counselPool),
              defendant_counsel:
                demo.side === "DEFENDANT" ? "A. Okafor" : pick(r, counselPool),
            })
          : makeItem(c, n),
      );
    }
    cause_lists.push({
      id: `cl-${c.id}-${today}`,
      courtroom_id: c.id,
      date: today,
      status: "PUBLISHED",
      published_at: minutesAgo(150 + Math.floor(r() * 60)),
      source: "REGISTRAR",
      items,
      current_item_id: null,
    });
  }
  const list = (id: string): any =>
    cause_lists.find((l) => l.courtroom_id === id);
  const setOutcomes = (id: string, upto: number, currentN: number | null) => {
    const l = list(id);
    for (const it of l.items) {
      if (it.item_number < upto) {
        const roll = r();
        if (roll < 0.55) {
          it.outcome = "ADJOURNED";
          it.next_date = addWorkingDays(today, 15 + Math.floor(r() * 40));
          it.next_business = pick(r, businessWeights);
        } else if (roll < 0.75) it.outcome = "HEARD";
        else if (roll < 0.9) it.outcome = "STOOD_DOWN";
        else it.outcome = "STRUCK_OUT";
      }
    }
    if (currentN) {
      const cur = l.items.find((i: any) => i.item_number === currentN);
      cur.outcome = "CALLED";
      l.current_item_id = cur.id;
    }
  };

  // Ikeja Court 5: on bench, calling item 4; the demo lawyer is item 7.
  setOutcomes("cr-ikj-5", 4, 4);
  // Ikeja Court 1: on bench; demo matter (item 2) already adjourned.
  setOutcomes("cr-ikj-1", 6, 6);
  const e = list("cr-ikj-1").items.find((i: any) => i.item_number === 2);
  Object.assign(e, {
    outcome: "ADJOURNED",
    next_date: addWorkingDays(today, 28),
    next_business: "HEARING",
    note: "Adjourned at the instance of the claimant.",
  });
  // Ikeja Court 2: not sitting. Nothing called; list stays as published.
  // Igbosere Court 7: sitting late, nothing called yet.
  // Igbosere Court 3 / TBS 2 / FHC 6: in progress.
  setOutcomes("cr-igb-3", 5, 5);
  setOutcomes("cr-tbs-2", 3, 3);
  setOutcomes("cr-fhc-6", 8, 8);
  setOutcomes("cr-ikj-8", 4, null); // in recess, between items
  setOutcomes("cr-igb-11", 99, null); // rose for the day — all done
  // FHC Court 3 list is from an OCR scan, not the registrar.
  list("cr-fhc-3").source = "OCR";

  // ── Today's statuses ──────────────────────────────────────────────────
  const st = (
    courtroom_id: string,
    status: string,
    verification: string,
    source: string,
    report_count: number,
    mins: number,
    extra: Record<string, unknown> = {},
  ): any => ({
    courtroom_id,
    status,
    verification,
    source,
    report_count,
    reported_at: minutesAgo(mins),
    reason: null,
    expected_start: null,
    until_date: null,
    note: null,
    ...extra,
  });
  const statusesByRoom = {
    "cr-ikj-1": st("cr-ikj-1", "ON_BENCH", "OFFICIAL", "REGISTRAR", 1, 48),
    "cr-ikj-2": st("cr-ikj-2", "NOT_SITTING", "OFFICIAL", "REGISTRAR", 1, 95, {
      reason: "INDISPOSED",
      note: "His Lordship is indisposed. Registrar will give new dates to counsel present from 10:00 AM.",
    }),
    "cr-ikj-5": st("cr-ikj-5", "ON_BENCH", "OFFICIAL", "REGISTRAR", 1, 36),
    "cr-ikj-8": st("cr-ikj-8", "IN_RECESS", "VERIFIED", "SPOTTER", 3, 12, {
      note: "Short break, expected back by 12:00.",
    }),
    "cr-ikj-12": st("cr-ikj-12", "SITTING", "OFFICIAL", "REGISTRAR", 1, 130, {
      expected_start: "09:30",
    }),
    "cr-igb-3": st("cr-igb-3", "ON_BENCH", "VERIFIED", "SPOTTER", 2, 25),
    "cr-igb-7": st("cr-igb-7", "SITTING_LATE", "OFFICIAL", "REGISTRAR", 1, 64, {
      reason: "CHAMBERS_MEETING",
      expected_start: "11:30",
      note: "Sitting suspended until 11:30 AM due to a meeting in chambers.",
    }),
    "cr-igb-11": st("cr-igb-11", "ROSE", "OFFICIAL", "REGISTRAR", 1, 20),
    "cr-tbs-2": st("cr-tbs-2", "ON_BENCH", "VERIFIED", "SPOTTER", 3, 40),
    "cr-tbs-4": st("cr-tbs-4", "NOT_SITTING", "OFFICIAL", "REGISTRAR", 1, 600, {
      reason: "ON_LEAVE",
      until_date: addWorkingDays(today, 8),
      note: "Judge on annual leave. All matters to be adjourned by the registry.",
    }),
    "cr-fhc-3": st("cr-fhc-3", "ON_BENCH", "UNVERIFIED", "SPOTTER", 1, 9),
    "cr-fhc-6": st("cr-fhc-6", "ON_BENCH", "VERIFIED", "SPOTTER", 3, 55),
    "cr-epe-1": st("cr-epe-1", "SITTING_LATE", "UNVERIFIED", "SPOTTER", 1, 18),
    // cr-ikj-16 and cr-ikd-1: nothing reported yet today.
  };

  const statuses = Object.fromEntries(
    Object.entries(statusesByRoom).map(([k, v]) => [`${k}|${today}`, v]),
  );
  // The night before: Ikeja Court 5's judge already told the registrar about tomorrow.
  const tomorrow = addWorkingDays(today, 1);

  const reporter = (i: number): any =>
    users.filter((u) => u.role === "LAWYER")[i];
  const status_reports: any[] = [];
  const addReports = (
    courtroom_id: string,
    status: string,
    n: number,
    mins: number,
    source = "SPOTTER",
  ) => {
    for (let i = 0; i < n; i++) {
      const u: any =
        source === "REGISTRAR"
          ? (users.find((x: any) => x.courtroom_ids?.includes(courtroom_id)) ??
            users.find((x) => x.role === "ADMIN"))
          : reporter(1 + ((i + courtroom_id.length) % 5));
      status_reports.push({
        id: `sr-${courtroom_id}-${status}-${i}`,
        courtroom_id,
        status,
        source,
        user_id: u.id,
        reporter_name: `${u.first_name} ${u.last_name}`,
        verification:
          source === "REGISTRAR"
            ? "OFFICIAL"
            : n > 1
              ? "VERIFIED"
              : "UNVERIFIED",
        note: null,
        created_at: minutesAgo(mins + i * 3),
      });
    }
  };
  for (const s of Object.values(statusesByRoom))
    addReports(
      s.courtroom_id,
      s.status,
      s.report_count,
      Math.max(
        1,
        Math.round((Date.now() - new Date(s.reported_at).getTime()) / 60000),
      ),
      s.source,
    );
  // Earlier transitions today, for the timeline.
  addReports("cr-ikj-5", "SITTING", 1, 120, "REGISTRAR");
  addReports("cr-ikj-1", "SITTING", 1, 125, "REGISTRAR");
  addReports("cr-igb-11", "ON_BENCH", 1, 160, "REGISTRAR");
  addReports("cr-ikj-8", "ON_BENCH", 2, 75);
  // A crowd report on Ikeja Court 1 that disagrees with the registrar.
  addReports("cr-ikj-1", "IN_RECESS", 1, 4);

  // ── Watchlist for every lawyer (the demo lawyer's is curated) ─────────
  const watchlist: any[] = demoCases.map((d, i) => ({
    id: `wl-${d.key}`,
    user_id: "u-law-1",
    suit_number: d.suit_number,
    title: d.title,
    side: d.side,
    division_id: courtrooms.find((c) => c.id === d.courtroom_id)!.division_id,
    courtroom_id: d.courtroom_id,
    scheduled_date: today,
    cause_list_item: d.item,
    created_at: minutesAgo(60 * 24 * (20 + i * 9)),
    history: [
      {
        date: addDays(today, -91 + i * 3),
        business: "MENTION",
        outcome: "ADJOURNED",
        next_date: addDays(today, -49 + i),
        item_number: 5 + i,
      },
      {
        date: addDays(today, -49 + i),
        business: i % 2 ? "MOTION" : "HEARING",
        outcome: i === 2 ? "STOOD_DOWN" : "ADJOURNED",
        next_date: today,
        item_number: 2 + i,
        note:
          i === 1 ? "Court did not sit; date taken from the registry." : null,
      },
    ],
  }));
  watchlist.push({
    id: "wl-f",
    user_id: "u-law-1",
    suit_number: "LD/912GCM/2021",
    title: "Crestwood Insurance Plc v. Mainland Motors Ltd",
    side: "DEFENDANT",
    division_id: "div-lagos",
    courtroom_id: "cr-tbs-4",
    scheduled_date: addWorkingDays(today, 6),
    created_at: minutesAgo(60 * 24 * 120),
    history: [
      {
        date: addDays(today, -35),
        business: "HEARING",
        outcome: "ADJOURNED",
        next_date: addWorkingDays(today, 6),
        item_number: 9,
      },
    ],
  });
  // Other lawyers watch matters in Ikeja Court 2 (so registrar actions notify them too).
  for (const it of list("cr-ikj-2").items.slice(0, 6) as any[]) {
    if (it.item_number === 4) continue;
    watchlist.push({
      id: `wl-${it.id}`,
      user_id: pick(r, ["u-law-2", "u-law-3", "u-law-4", "u-law-5"]),
      suit_number: it.suit_number,
      title: it.title,
      side: "CLAIMANT",
      division_id: "div-ikeja",
      courtroom_id: "cr-ikj-2",
      scheduled_date: today,
      cause_list_item: it.item_number,
      created_at: minutesAgo(60 * 24 * 12),
      history: [],
    });
  }

  // ── Broadcasts ────────────────────────────────────────────────────────
  const broadcasts = [
    {
      id: "bc-1",
      division_id: "div-lagos",
      courtroom_id: "cr-igb-7",
      severity: "URGENT",
      message:
        "Court 7 sitting suspended until 11:30 AM due to a meeting in chambers. Counsel in matters listed are to remain within the premises.",
      created_by: "u-reg-2",
      created_at: minutesAgo(64),
      expires_at: null,
    },
    {
      id: "bc-2",
      division_id: "div-ikeja",
      courtroom_id: "cr-ikj-2",
      severity: "URGENT",
      message:
        "Court 2 will not sit today — His Lordship is indisposed. New dates will be given at the registry from 10:00 AM.",
      created_by: "u-reg-1",
      created_at: minutesAgo(94),
      expires_at: null,
    },
    {
      id: "bc-3",
      division_id: "div-ikeja",
      courtroom_id: null,
      severity: "INFO",
      message:
        "The Ikeja registry will close at 2:00 PM on Friday for staff training. E-filing remains available.",
      created_by: "u-reg-1",
      created_at: minutesAgo(60 * 20),
      expires_at: null,
    },
    {
      id: "bc-4",
      division_id: "div-lagos",
      courtroom_id: "cr-tbs-4",
      severity: "INFO",
      message: `Court 4 (TBS): Judge on annual leave until ${addWorkingDays(today, 8)}. Counsel may take dates remotely via CourtPulse.`,
      created_by: "u-reg-2",
      created_at: minutesAgo(600),
      expires_at: null,
    },
  ];

  // ── Remote date requests (Ikeja Court 2 is not sitting) ──────────────
  const remote_dates = [
    {
      id: "rd-1",
      suit_number: list("cr-ikj-2").items[0].suit_number,
      title: list("cr-ikj-2").items[0].title,
      courtroom_id: "cr-ikj-2",
      proposed_dates: [
        addWorkingDays(today, 14),
        addWorkingDays(today, 16),
        addWorkingDays(today, 21),
      ],
      status: "PENDING",
      requested_by: "u-law-3",
      note: "Both counsel available on any of these dates.",
      created_at: minutesAgo(41),
    },
    {
      id: "rd-2",
      suit_number: list("cr-ikj-2").items[2].suit_number,
      title: list("cr-ikj-2").items[2].title,
      courtroom_id: "cr-ikj-2",
      proposed_dates: [addWorkingDays(today, 10), addWorkingDays(today, 12)],
      status: "PENDING",
      requested_by: "u-law-4",
      note: null,
      created_at: minutesAgo(22),
    },
    {
      id: "rd-3",
      suit_number: list("cr-ikj-2").items[5].suit_number,
      title: list("cr-ikj-2").items[5].title,
      courtroom_id: "cr-ikj-2",
      proposed_dates: [addWorkingDays(today, 18)],
      status: "APPROVED",
      approved_date: addWorkingDays(today, 18),
      requested_by: "u-law-5",
      note: null,
      created_at: minutesAgo(70),
    },
  ];

  // ── Brief-holding marketplace ─────────────────────────────────────────
  const brief = (id: string, extra: Record<string, unknown>) => ({
    id,
    currency: "NGN",
    created_at: minutesAgo(30 + Math.floor(r() * 200)),
    scheduled_date: today,
    ...extra,
  });
  const briefs = [
    brief("br-1", {
      suit_number: list("cr-ikj-8").items[6].suit_number,
      title: list("cr-ikj-8").items[6].title,
      courtroom_id: "cr-ikj-8",
      complex_id: "cx-ikeja",
      matter_type: "ADJOURNMENT",
      fee_amount: 1500000,
      status: "OPEN",
      requested_by: "u-law-2",
      instructions:
        "Seek an adjournment; we filed a further affidavit yesterday. Any date after the 20th.",
    }),
    brief("br-2", {
      suit_number: list("cr-ikj-12").items[3].suit_number,
      title: list("cr-ikj-12").items[3].title,
      courtroom_id: "cr-ikj-12",
      complex_id: "cx-ikeja",
      matter_type: "MENTION",
      fee_amount: 1000000,
      status: "OPEN",
      requested_by: "u-law-3",
      instructions:
        "Mention only. Inform the court that parties are exploring settlement.",
    }),
    brief("br-3", {
      suit_number: list("cr-igb-3").items[8].suit_number,
      title: list("cr-igb-3").items[8].title,
      courtroom_id: "cr-igb-3",
      complex_id: "cx-igbosere",
      matter_type: "DATE_TAKING",
      fee_amount: 800000,
      status: "OPEN",
      requested_by: "u-law-5",
      instructions: "Take a date for hearing of our motion on notice.",
    }),
    brief("br-4", {
      suit_number: "EPD/233/2024",
      title: "Onyeka v. Registered Trustees of Grace Assembly",
      courtroom_id: "cr-epe-1",
      complex_id: "cx-epe",
      matter_type: "ADJOURNMENT",
      fee_amount: 2000000,
      status: "OPEN",
      requested_by: "u-law-1",
      instructions:
        "I'm in Ikeja today. Please take a date in November; opposing counsel has consented.",
    }),
    brief("br-5", {
      suit_number: list("cr-ikj-1").items[8].suit_number,
      title: list("cr-ikj-1").items[8].title,
      courtroom_id: "cr-ikj-1",
      complex_id: "cx-ikeja",
      matter_type: "MENTION",
      fee_amount: 1200000,
      status: "IN_PROGRESS",
      requested_by: "u-law-4",
      accepted_by: "u-law-1",
      instructions:
        "Mention. Report that the parties have exchanged documents.",
    }),
    brief("br-6", {
      suit_number: "ID/3021/2023",
      title: "Afolabi v. Kings Court Hotels Ltd",
      courtroom_id: "cr-ikj-12",
      complex_id: "cx-ikeja",
      matter_type: "ADJOURNMENT",
      fee_amount: 1500000,
      status: "COMPLETED",
      requested_by: "u-law-1",
      accepted_by: "u-law-5",
      scheduled_date: addDays(today, -7),
      session_notes:
        "Matter adjourned to the 4th for hearing. Claimant's witness to be present. No costs awarded.",
    }),
  ];

  const wallets: Record<string, unknown> = {
    "u-law-1": {
      escrow_balance: 4250000,
      escrow_held: 2000000,
      credits_balance: 45,
    },
  };
  const escrow_ledger = [
    {
      id: "el-1",
      user_id: "u-law-1",
      amount: 5000000,
      type: "FUND",
      reference: "PSK-83H2KD",
      created_at: minutesAgo(60 * 24 * 14),
    },
    {
      id: "el-2",
      user_id: "u-law-1",
      amount: 1500000,
      type: "HOLD",
      reference: "br-6",
      created_at: minutesAgo(60 * 24 * 8),
    },
    {
      id: "el-3",
      user_id: "u-law-1",
      amount: 1500000,
      type: "RELEASE",
      reference: "br-6",
      created_at: minutesAgo(60 * 24 * 7),
    },
    {
      id: "el-4",
      user_id: "u-law-1",
      amount: 750000,
      type: "PAYOUT",
      reference: "br-9",
      created_at: minutesAgo(60 * 24 * 3),
    },
    {
      id: "el-5",
      user_id: "u-law-1",
      amount: 2000000,
      type: "HOLD",
      reference: "br-4",
      created_at: minutesAgo(90),
    },
  ];
  const credit_ledger = [
    {
      id: "cl-1",
      user_id: "u-law-1",
      amount: 5,
      reason: "EARLY_VERIFIED_REPORT",
      note: "Ikeja Court 8 · In recess",
      created_at: minutesAgo(60 * 24 * 2),
    },
    {
      id: "cl-2",
      user_id: "u-law-1",
      amount: 5,
      reason: "EARLY_VERIFIED_REPORT",
      note: "Igbosere Court 3 · Judge on bench",
      created_at: minutesAgo(60 * 24 * 5),
    },
    {
      id: "cl-3",
      user_id: "u-law-1",
      amount: 40,
      reason: "EARLY_VERIFIED_REPORT",
      note: "First-month Spotter bonus",
      created_at: minutesAgo(60 * 24 * 12),
    },
    {
      id: "cl-4",
      user_id: "u-law-1",
      amount: -5,
      reason: "REDEEMED_DISCOUNT",
      note: "₦500 off brief br-6",
      created_at: minutesAgo(60 * 24 * 8),
    },
  ];

  const notification = (
    id: string,
    user_id: string,
    kind: string,
    title: string,
    body: string,
    mins: number,
    link: string,
    read = false,
  ) => ({
    id,
    user_id,
    kind,
    title,
    body,
    link,
    read,
    created_at: minutesAgo(mins),
  });
  const notifications = [
    notification(
      "n-1",
      "u-law-1",
      "CAUSE_LIST_MATCH",
      "Listed as Item #7 · Ikeja Court 5",
      "Your matter ID/2847GCM/2023 is listed as Item #7 on today's cause list.",
      150,
      "/courtrooms/cr-ikj-5",
    ),
    notification(
      "n-2",
      "u-law-1",
      "STATUS_OFFICIAL",
      "Ikeja Court 2 · Not sitting",
      "Judge indisposed. Your matter ID/1190/2024 (Item #4) will be adjourned. You can take a date remotely.",
      95,
      "/courtrooms/cr-ikj-2",
    ),
    notification(
      "n-3",
      "u-law-1",
      "BROADCAST",
      "Igbosere Court 7 · Sitting late",
      "Sitting suspended until 11:30 AM due to a meeting in chambers.",
      64,
      "/courtrooms/cr-igb-7",
    ),
    notification(
      "n-4",
      "u-law-1",
      "ADJOURNED",
      "ID/774/2025 adjourned",
      `Primewell Hospitals Ltd v. Eze was adjourned to ${addWorkingDays(today, 28)} for hearing.`,
      30,
      "/matters/wl-e",
    ),
    notification(
      "n-5",
      "u-law-1",
      "STATUS_VERIFIED",
      "Ikeja Court 5 · Judge on bench",
      "Confirmed by the registrar. Now calling Item #4.",
      36,
      "/courtrooms/cr-ikj-5",
      true,
    ),
    notification(
      "n-6",
      "u-law-1",
      "BRIEF",
      "Brief accepted",
      "You are holding brief in ID/3021/2023 for Kemi Ashiru.",
      60 * 3,
      "/briefs/br-5",
      true,
    ),
  ];

  const scans = [
    {
      id: "scan-1",
      user_id: "u-law-1",
      courtroom_id: "cr-fhc-3",
      image_url: "/uploads/demo-fhc-3.jpg",
      status: "COMPLETED",
      extracted_items: list("cr-fhc-3").items.map(
        ({
          item_number,
          suit_number,
          title,
          claimant_counsel,
          defendant_counsel,
        }: any) => ({
          id: `x-${item_number}`,
          item_number,
          suit_number,
          title,
          parties: title,
          counsel: [claimant_counsel, defendant_counsel],
        }),
      ),
      matched_suit_numbers: ["FHC/L/CS/1488/2024"],
      created_at: minutesAgo(140),
    },
  ];

  const calendar = [
    {
      id: "cal-1",
      name: "Independence Day",
      kind: "PUBLIC_HOLIDAY",
      start_date: `${year}-10-01`,
      end_date: `${year}-10-01`,
      court_system: null,
    },
    {
      id: "cal-2",
      name: "Christmas vacation",
      kind: "VACATION",
      start_date: `${year}-12-18`,
      end_date: `${year + 1}-01-08`,
      court_system: "LSHC",
    },
    {
      id: "cal-3",
      name: "Christmas vacation",
      kind: "VACATION",
      start_date: `${year}-12-18`,
      end_date: `${year + 1}-01-12`,
      court_system: "FHC",
    },
    {
      id: "cal-4",
      name: "Annual vacation",
      kind: "VACATION",
      start_date: `${year}-07-13`,
      end_date: `${year}-09-14`,
      court_system: "LSHC",
    },
    {
      id: "cal-5",
      name: "Workers' Day",
      kind: "PUBLIC_HOLIDAY",
      start_date: `${year + 1}-05-01`,
      end_date: `${year + 1}-05-01`,
      court_system: null,
    },
    {
      id: "cal-6",
      name: "Easter vacation",
      kind: "VACATION",
      start_date: `${year + 1}-03-30`,
      end_date: `${year + 1}-04-10`,
      court_system: null,
    },
    {
      id: "cal-7",
      name: "Democracy Day",
      kind: "PUBLIC_HOLIDAY",
      start_date: `${year + 1}-06-12`,
      end_date: `${year + 1}-06-12`,
      court_system: null,
    },
    {
      id: "cal-8",
      name: "Annual vacation",
      kind: "VACATION",
      start_date: `${year + 1}-07-12`,
      end_date: `${year + 1}-09-13`,
      court_system: "LSHC",
    },
  ];

  // Judge's diary: dates already given out, per courtroom.
  const diary_load: Record<string, Record<string, number>> = {};
  for (const c of courtrooms) {
    diary_load[c.id] = {};
    for (let i = 1; i <= 45; i++) {
      const d = addDays(today, i);
      diary_load[c.id][d] = Math.floor(r() * 13);
    }
  }
  const diary_blocks = [
    {
      courtroom_id: "cr-ikj-2",
      date: addWorkingDays(today, 3),
      reason: "Judges' conference",
    },
    {
      courtroom_id: "cr-ikj-5",
      date: addWorkingDays(today, 9),
      reason: "Judgment writing",
    },
  ];

  const check_ins = [
    {
      id: "ci-1",
      user_id: "u-law-4",
      courtroom_id: "cr-ikj-8",
      complex_id: "cx-ikeja",
      checked_in_at: minutesAgo(80),
      checked_out_at: null,
    },
    {
      id: "ci-2",
      user_id: "u-law-5",
      courtroom_id: "cr-igb-3",
      complex_id: "cx-igbosere",
      checked_in_at: minutesAgo(50),
      checked_out_at: null,
    },
  ];

  const disputes = [
    {
      id: "dp-1",
      brief_id: "br-d1",
      raised_by: "u-law-2",
      reason:
        "Standing-in counsel did not appear; the matter was struck out for want of diligent prosecution.",
      status: "OPEN",
      created_at: minutesAgo(60 * 26),
      brief: {
        id: "br-d1",
        suit_number: "ID/1523/2023",
        title: "Oladipo v. Bluewater Marine Ltd",
        courtroom_id: "cr-ikj-16",
        complex_id: "cx-ikeja",
        matter_type: "MENTION",
        fee_amount: 1000000,
        currency: "NGN",
        status: "DISPUTED",
        requested_by: "u-law-2",
        requester_name: "Tunde Oyelaran",
        accepted_by: "u-law-6",
        holder_name: "Segun Odukoya",
        scheduled_date: addDays(today, -1),
        created_at: minutesAgo(60 * 30),
      },
    },
  ];

  const activity = [
    {
      id: "act-1",
      actor: "Grace Adeniyi",
      action: "posted Not sitting (Judge indisposed)",
      target: "Ikeja Court 2",
      courtroom_id: "cr-ikj-2",
      created_at: minutesAgo(95),
    },
    {
      id: "act-2",
      actor: "Grace Adeniyi",
      action: "published today's cause list (14 items)",
      target: "Ikeja Court 5",
      courtroom_id: "cr-ikj-5",
      created_at: minutesAgo(160),
    },
    {
      id: "act-3",
      actor: "Samuel Etim",
      action: "broadcast an urgent notice",
      target: "Igbosere Court 7",
      courtroom_id: "cr-igb-7",
      created_at: minutesAgo(64),
    },
    {
      id: "act-4",
      actor: "3 spotters",
      action: "verified In recess",
      target: "Ikeja Court 8",
      courtroom_id: "cr-ikj-8",
      created_at: minutesAgo(12),
    },
    {
      id: "act-5",
      actor: "Grace Adeniyi",
      action: "called Item #4",
      target: "Ikeja Court 5",
      courtroom_id: "cr-ikj-5",
      created_at: minutesAgo(8),
    },
  ];

  // Counsel subscribed to each courtroom's alerts (beyond those on today's list).
  const subscribers = Object.fromEntries(
    courtrooms.map((c) => [c.id, 25 + Math.floor(r() * 140)]),
  );

  const alert = (
    id: string,
    courtroom_id: string,
    kind: string,
    message: string,
    recipients: number,
    mins: number,
    actor: string,
  ) => {
    const failed = recipients > 20 ? Math.floor(r() * 3) : 0;
    return {
      id,
      courtroom_id,
      kind,
      message,
      recipients,
      sms: recipients,
      whatsapp: Math.round(recipients * 0.82),
      delivered: recipients - failed,
      failed,
      actor,
      created_at: minutesAgo(mins),
    };
  };
  const alerts = [
    alert(
      "al-1",
      "cr-ikj-2",
      "STATUS",
      "Ikeja Court 2 will NOT sit today. Judge indisposed. New dates at the registry from 10:00 AM.",
      61,
      95,
      "Grace Adeniyi",
    ),
    alert(
      "al-2",
      "cr-ikj-2",
      "BROADCAST",
      "Court 2 will not sit today — His Lordship is indisposed. New dates will be given at the registry from 10:00 AM.",
      61,
      94,
      "Grace Adeniyi",
    ),
    alert(
      "al-3",
      "cr-ikj-5",
      "STATUS",
      "Ikeja Court 5: Judge on bench. Now calling Item #1.",
      88,
      36,
      "Grace Adeniyi",
    ),
    alert(
      "al-4",
      "cr-ikj-1",
      "STATUS",
      "Ikeja Court 1: Judge on bench.",
      54,
      48,
      "Grace Adeniyi",
    ),
    alert(
      "al-5",
      "cr-ikj-1",
      "ADJOURNMENT",
      "ID/774/2025 Primewell Hospitals Ltd v. Eze adjourned to a new date for hearing.",
      2,
      30,
      "Grace Adeniyi",
    ),
    alert(
      "al-6",
      "cr-ikj-5",
      "CAUSE_LIST",
      "Today's cause list for Ikeja Court 5 is published. Check your item number on CourtPulse.",
      88,
      160,
      "Grace Adeniyi",
    ),
  ];

  return {
    seeded_for: today,
    subscribers,
    alerts,
    divisions: divisions.map(({ prefix, ...d }) => (void prefix, d)),
    complexes,
    judges,
    judge_assignments,
    courtrooms,
    users,
    statuses,
    status_reports: status_reports.map((x) => ({ ...x, date: today })),
    tomorrow,
    cause_lists,
    watchlist,
    broadcasts,
    remote_dates,
    briefs,
    wallets,
    escrow_ledger,
    credit_ledger,
    notifications,
    preferences: {},
    scans,
    calendar,
    diary_load,
    diary_blocks,
    check_ins,
    disputes,
    invites: [],
    activity,
    consensus: {
      min_reports: 2,
      window_minutes: 20,
      credit_first_n: 3,
      credit_amount: 5,
    },
  };
}
