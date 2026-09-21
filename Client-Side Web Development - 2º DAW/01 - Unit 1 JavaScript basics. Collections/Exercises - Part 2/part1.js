// Part 1 
// Section 1
import { clinicData } from './clinicData.js'

const consults = clinicData.flatMap(p => p.consultations)
console.log(consults)

const totalRevenue = consults.reduce((acc, c) => acc + c.fee, 0)
const highestConsult = consults.reduce((max, c) => {
    return c.fee > max.fee ? c : max
}, consults[0])

const formatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    fractionDigits: 2
}
)

console.log(`Total revenue: ${formatter.format(totalRevenue)}`)
console.log(`Highest Billable Consultation: ${formatter.format(highestConsult.fee)}`)

//Section 2

const drugContraindications = new Set(['penicillin', 'latex', 'morphine'])


const elegilePatientsByName = clinicData.filter( patient => {
    const allergies = new Set((patient.allergies ?? []).map(a => String(a).toLowerCase()))
    return allergies.isDisjointFrom(drugContraindications)
}).map(p => p.name)

const listFormat = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction"
})

console.log(listFormat.format(elegilePatientsByName))

// Section 3

const anonymizedPatients = clinicData.reduce((acc, p) => {
    const validIdPattern = /^PAC-\d{4}-\w{2}[!@#$%*&]$/
    if (validIdPattern.test(p.id ?? '')) {
        const maskedName = String(p.name ?? '').replace(/\B\w/g, "*")
        const maskedId = String(p.id).replace(/^PAC-\d{4}-/, "PAC-****-")
        const consultationCount = (p.consultations ?? []).length
        acc.push({ name: maskedName, id: maskedId, consultationCount })

        acc.push(`${maskedId} | ${maskedName} | ${consultationCount}`)
    }
    return acc
}, [])

console.log(anonymizedPatients)


// Section 4
const sophia = clinicData.find(patient => patient.name === "Sophia Chen");
const targetConsultation = sophia?.consultations?.find(c => c.id === "TK-2026-OPHT-12");

if (targetConsultation) {
  const originalDate = new Date(targetConsultation.date);
  const followUpDate = new Date(originalDate);

  followUpDate.setDate(followUpDate.getDate() + 45);

  const day = followUpDate.getDay();
  if (day === 6) {
    followUpDate.setDate(followUpDate.getDate() + 2);
  } else if (day === 0) {
    followUpDate.setDate(followUpDate.getDate() + 1);
  }

  const dateFormat = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "full",
    timeStyle: "short"
  });

  console.log(`Last consultation: ${dateFormat.format(originalDate)}`);
  console.log(`Next consultation: ${dateFormat.format(followUpDate)}`);
} else {
  console.log("Target consultation not found.");
}
