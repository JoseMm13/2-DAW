// Part 1 
// Section 1
import { patients } from './clinicData.js'

const consults = patients.flatMap(p => p.consultations)
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


