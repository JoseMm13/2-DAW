// clinicData.js
export const patients = [
  {
    patientId: "PAC-2022-09A#",
    name: "Elena Rostova",
    birthDate: "1988-04-12",
    insuranceTier: "Premium",
    allergies: ["penicillin", "aspirin", "ibuprofen"],
    consultations: [
      { ticketId: "TK-2025-CARD-11", specialty: "Cardiology", date: "2025-11-14T09:30:00", fee: 180, diagnosisCode: "DX-CARD-441" },
      { ticketId: "TK-2026-DERM-04", specialty: "Dermatology", date: "2026-02-10T11:15:00", fee: 95, diagnosisCode: "DX-DERM-102" }
    ]
  },
  {
    patientId: "PAC-2024-14B$",
    name: "Marcus Vance",
    birthDate: "2001-09-25",
    insuranceTier: "Standard",
    allergies: ["latex", "peanuts"],
    consultations: [
      { ticketId: "TK-2026-TRAU-88", specialty: "Traumatology", date: "2026-01-20T16:00:00", fee: 220, diagnosisCode: "DX-TRAU-990" }
    ]
  },
  {
    patientId: "PAC-2021-33C*",
    name: "Sophia Chen",
    birthDate: "1975-12-03",
    insuranceTier: "Premium",
    allergies: ["penicillin", "sulfa"],
    consultations: [
      { ticketId: "TK-2025-CARD-02", specialty: "Cardiology", date: "2025-10-05T08:45:00", fee: 190, diagnosisCode: "DX-CARD-449" },
      { ticketId: "TK-2025-NEUR-77", specialty: "Neurology", date: "2025-12-18T14:20:00", fee: 310, diagnosisCode: "DX-NEUR-801" },
      { ticketId: "TK-2026-OPHT-12", specialty: "Ophthalmology", date: "2026-03-01T10:00:00", fee: 110, diagnosisCode: "DX-OPHT-300" }
    ]
  },
  {
    patientId: "pac_insecure_01",
    name: "John Doe",
    birthDate: "1995-07-19",
    insuranceTier: "Basic",
    allergies: ["codeine"],
    consultations: [
      { ticketId: "TK-2026-GEN-01", specialty: "General Medicine", date: "2026-01-15T12:00:00", fee: 60, diagnosisCode: "DX-GEN-100" }
    ]
  },
  {
    patientId: "PAC-2023-55D!",
    name: "Amina Al-Mansoor",
    birthDate: "1992-03-30",
    insuranceTier: "Premium",
    allergies: ["dust_mites", "pollen"],
    consultations: [
      { ticketId: "TK-2025-PULM-23", specialty: "Pulmonology", date: "2025-09-12T10:30:00", fee: 210, diagnosisCode: "DX-PULM-301" },
      { ticketId: "TK-2026-ALLR-09", specialty: "Allergology", date: "2026-01-18T15:00:00", fee: 140, diagnosisCode: "DX-ALLR-205" }
    ]
  },
  {
    patientId: "PAC-2020-88E%",
    name: "Carlos Mendoza",
    birthDate: "1964-11-08",
    insuranceTier: "Standard",
    allergies: ["penicillin", "contrast_dye", "aspirin"],
    consultations: [
      { ticketId: "TK-2025-CARD-65", specialty: "Cardiology", date: "2025-08-22T08:15:00", fee: 195, diagnosisCode: "DX-CARD-442" },
      { ticketId: "TK-2025-ENDO-14", specialty: "Endocrinology", date: "2025-11-03T11:45:00", fee: 160, diagnosisCode: "DX-ENDO-510" },
      { ticketId: "TK-2026-NEPH-02", specialty: "Nephrology", date: "2026-02-14T09:00:00", fee: 240, diagnosisCode: "DX-NEPH-612" }
    ]
  },
  {
    patientId: "PAC-2025-12F&",
    name: "Beatrice Dubois",
    birthDate: "2003-05-17",
    insuranceTier: "Standard",
    allergies: [],
    consultations: [
      { ticketId: "TK-2026-DERM-33", specialty: "Dermatology", date: "2026-01-09T13:20:00", fee: 95, diagnosisCode: "DX-DERM-108" }
    ]
  },
  {
    patientId: "PAC-2024-71G@",
    name: "Liam O'Connor",
    birthDate: "1983-08-22",
    insuranceTier: "Premium",
    allergies: ["ibuprofen", "naproxen"],
    consultations: [
      { ticketId: "TK-2025-TRAU-41", specialty: "Traumatology", date: "2025-10-29T17:30:00", fee: 230, diagnosisCode: "DX-TRAU-985" },
      { ticketId: "TK-2026-RHUM-07", specialty: "Rheumatology", date: "2026-02-20T10:15:00", fee: 175, diagnosisCode: "DX-RHUM-402" }
    ]
  },
  {
    patientId: "pac_temp_err_99",
    name: "Unknown Visitor",
    birthDate: "1999-01-01",
    insuranceTier: "Basic",
    allergies: ["latex"],
    consultations: [
      { ticketId: "TK-2026-GEN-99", specialty: "General Medicine", date: "2026-02-01T08:00:00", fee: 55, diagnosisCode: "DX-GEN-101" }
    ]
  },
  {
    patientId: "PAC-2023-44H#",
    name: "Kenji Sato",
    birthDate: "1979-06-14",
    insuranceTier: "Premium",
    allergies: ["shellfish", "iodine"],
    consultations: [
      { ticketId: "TK-2025-GAST-19", specialty: "Gastroenterology", date: "2025-07-19T11:00:00", fee: 260, diagnosisCode: "DX-GAST-701" },
      { ticketId: "TK-2025-ONCO-05", specialty: "Oncology", date: "2025-12-05T14:30:00", fee: 380, diagnosisCode: "DX-ONCO-911" }
    ]
  },
  {
    patientId: "PAC-2022-67J$",
    name: "Fatima Zahra",
    birthDate: "1990-10-02",
    insuranceTier: "Standard",
    allergies: ["nickel", "sulfa"],
    consultations: [
      { ticketId: "TK-2025-GYNE-12", specialty: "Gynecology", date: "2025-09-28T09:45:00", fee: 150, diagnosisCode: "DX-GYNE-220" },
      { ticketId: "TK-2026-ENDO-08", specialty: "Endocrinology", date: "2026-01-11T12:15:00", fee: 165, diagnosisCode: "DX-ENDO-518" }
    ]
  },
  {
    patientId: "PAC-2025-90K*",
    name: "Oliver Smith",
    birthDate: "2015-02-18",
    insuranceTier: "Premium",
    allergies: ["eggs", "peanuts", "milk"],
    consultations: [
      { ticketId: "TK-2025-PEDI-03", specialty: "Pediatrics", date: "2025-11-20T16:45:00", fee: 120, diagnosisCode: "DX-PEDI-014" },
      { ticketId: "TK-2026-PEDI-18", specialty: "Pediatrics", date: "2026-02-25T10:00:00", fee: 120, diagnosisCode: "DX-PEDI-019" }
    ]
  },
  {
    patientId: "PAC-2021-19L!",
    name: "Ingrid Lindholm",
    birthDate: "1958-04-05",
    insuranceTier: "Standard",
    allergies: ["morphine", "codeine"],
    consultations: [
      { ticketId: "TK-2025-NEUR-34", specialty: "Neurology", date: "2025-06-14T15:30:00", fee: 290, diagnosisCode: "DX-NEUR-799" },
      { ticketId: "TK-2025-OPHT-09", specialty: "Ophthalmology", date: "2025-10-10T11:00:00", fee: 105, diagnosisCode: "DX-OPHT-290" },
      { ticketId: "TK-2026-CARD-08", specialty: "Cardiology", date: "2026-01-29T08:30:00", fee: 185, diagnosisCode: "DX-CARD-450" }
    ]
  },
  {
    patientId: "PAC-INVALID-X0",
    name: "Ghost Patient",
    birthDate: "1980-01-01",
    insuranceTier: "Basic",
    allergies: [],
    consultations: []
  },
  {
    patientId: "PAC-2024-82M%",
    name: "Mateo Fernandez",
    birthDate: "1997-12-29",
    insuranceTier: "Standard",
    allergies: ["amoxicillin", "penicillin"],
    consultations: [
      { ticketId: "TK-2025-OTOL-01", specialty: "Otolaryngology", date: "2025-12-02T16:15:00", fee: 135, diagnosisCode: "DX-OTOL-150" },
      { ticketId: "TK-2026-TRAU-15", specialty: "Traumatology", date: "2026-02-17T11:30:00", fee: 215, diagnosisCode: "DX-TRAU-988" }
    ]
  },
  {
    patientId: "PAC-2026-03N&",
    name: "Chukwudi Okafor",
    birthDate: "1972-07-11",
    insuranceTier: "Premium",
    allergies: ["aspirin"],
    consultations: [
      { ticketId: "TK-2026-CARD-31", specialty: "Cardiology", date: "2026-01-08T09:15:00", fee: 205, diagnosisCode: "DX-CARD-460" },
      { ticketId: "TK-2026-GAST-04", specialty: "Gastroenterology", date: "2026-02-28T13:45:00", fee: 275, diagnosisCode: "DX-GAST-720" }
    ]
  }
];