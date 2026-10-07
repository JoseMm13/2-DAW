import { clinicData } from './clinicData.js';

//Section 1
console.log("Section 1")

const consultationsIterator = clinicData.flatMap(patient => patient.consultations);
const totalRevenue = consultationsIterator.reduce((acc, consultation) => acc + consultation.fee, 0);
const highestConsultation = consultationsIterator.reduce((max, consultation) => {
    return consultation.fee > max.fee ? consultation : max;
}, consultationsIterator[0]);
const euroFormatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
});
console.log(`Total Revenue: ${euroFormatter.format(totalRevenue)}`);
console.log(
    `Highest Billable Consultation: ${highestConsultation.ticketId} (${highestConsultation.specialty}) - ${euroFormatter.format(highestConsultation.fee)}`
);
//Section 2
console.log("Section 2")

const drugContraindications = new Set(["penicillin", "latex", "morphine"]);
const safePatients = clinicData.filter(patient =>
    !patient.allergies.some(allergy => drugContraindications.has(allergy))
);
const safeNames = safePatients.map(patient => patient.name);
const nameFormatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction"
});

console.log(nameFormatter.format(safeNames));

//Section 3
console.log("Section 3")

const validIdPattern = /^PAC-\d{4}-\w{2}[!@#$%*&]$/;
// Así muestra el patrón con {2} no muestra nada y suponemos que está bien.
// const validIdPattern = /^PAC-\d{4}-\w{3}[!@#$%*&]$/;

const anonymizedPatients = clinicData
    .filter (patient => validIdPattern.test(patient.patientId))
    .map(patient => {
        const maskedName = patient.name.replace(/\B\w/g, "*");
        const maskedId = patient.patientId.replace(/^PAC-\d{4}/, "PAC-****");
        const consultationCount = patient.consultations.length;
        return `${maskedName} | ${maskedId} | ${consultationCount}`;
    });

anonymizedPatients.forEach(line => console.log(line));

//Section 4
console.log("Section 4")

const nameConsultation = clinicData.find(p => p.name === "Sophia Chen");
const lastConsultation = nameConsultation.consultations.find(
    c => c.ticketId === "TK-2026-OPHT-12"
);
const originalDate = new Date(lastConsultation.date);
const followUpDate = new Date(originalDate);
followUpDate.setMinutes(followUpDate.getMinutes() + 45);
const day = followUpDate.getDay(); 

if (day === 6) {
    followUpDate.setDate(followUpDate.getDate() + 2);
} else if (day === 0) {
    followUpDate.setDate(followUpDate.getDate() + 1);
}
const formatter = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "full",
    timeStyle: "short"
});

console.log("Última consulta:", formatter.format(originalDate));
console.log("Próxima consulta:", formatter.format(followUpDate));
