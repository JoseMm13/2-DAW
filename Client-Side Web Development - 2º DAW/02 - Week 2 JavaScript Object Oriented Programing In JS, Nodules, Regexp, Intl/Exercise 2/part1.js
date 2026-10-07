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

