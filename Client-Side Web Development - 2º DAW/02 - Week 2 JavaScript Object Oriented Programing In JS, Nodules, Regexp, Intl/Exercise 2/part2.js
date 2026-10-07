//import * as readLine from "node:readLine/promises";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

import { EmergencyTriage } from "./emergency-triage.class";
import { LabProcedure } from "./lab-procedure.class";

// const r1 = readLine.createInterface({ input, output }); // Create a readline interface for user input
// Se que esta mal y que deberia estar await r1.question pero lo he cambiado porque no me funciona en esta version del Node.js. 
// He creado una función question() que devuelve una promesa y la uso con await.
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => r1.question(text, resolve));

const services = new Map();
// Pre-populación (2 Emergency, 2 Lab)
services.set("SRV-01", new EmergencyTriage("SRV-01", 100, 3));
services.set("SRV-02", new EmergencyTriage("SRV-02", 150, 5));
services.set("LAB-01", new LabProcedure("LAB-01", 50, "blood"));
services.set("LAB-02", new LabProcedure("LAB-02", 75, "Tissue"));

// Menu

let option = -1;
while (option !== 0) {
    console.log("1) List All services(Formatted) ");
    console.log("2) Register New Medical Service ");
    console.log("3) Apply Emergency Triage Surcharges ");
    console.log("4) Sterilize Lab Kits ");
    console.log("5) Compare Two Services by Price (ValueOf) ");
    console.log("6) Lookup Service by Code ");
    console.log("0) Exit ");

    //const resp = await r1.question("Something to ask for: ");
    const resp = await question("Choose an option: ");
    option = Number(resp);

    //Option 1: List All services(Formatted)
    if (option === 1){
        for(const srv of services.values()){
            console.log(srv.toString());
        }
    }

    //Option 2: Register New Medical Service
    if (option === 2){
        const code = await question("Enter service code: ");
        const fee = Number(await question("Enter base fee: "));
        const type = await question("Enter service Type (1 Emergency, 2 Lab): ");

        if (type === "1") {
            const level = Number(await question("Enter urgency level (1-5): "));
            services.set(code, new EmergencyTriage(code, fee, level));
        } else if (type === 2) {
            const sample = await question("Enter sample type (blood, Tissue, Culture): "); 
            services.set(code, new LabProcedure(code, fee, sample));
        }
    }

    //Option 3: Apply Emergency Triage Surcharges
    if (option === 3){
        for (const srv of services.values()) {
            srv.applyTriageCharge?.(); // Optional concatenation operator (?.) instead.
        }
        console.log("Triage surcharges applied.");
    }

    //Option 4: Sterilize Lab Kits
    if (option === 4){
        for (const srv of services.values()) {
            srv.sterilizeKit?.(); // optional chaining operator ?. Directly (same as before).
        }
    }

    //Option 5: Compare Two Services by Price (ValueOf)
    if(option === 5){
        const c1 = await question("First service code: ");
        const c2 = await question("Second service code: ");
        const s1 = services.get(c1);
        const s2 = services.get(c2);

        if (s1 && s2) {
            if(s1 > s2){
                console.log(`${c1} is more expensive than ${c2}`);
            } else if (s1 < s2){
                console.log(`${c2} is more expensive than ${c1}`);
            } else {
                console.log("Both services have the same price.");
            }
        } else {
            console.log("One or both services codes do not exist.");
        }
    }

    //Option 6: Lookup Service by Code
    if (option === 6){
        const code = await question("Enter service code to lookup: ");
        console.log(services.get(code)?.toString() ?? "Service code not registered");
    }

    // No es muy necesaria ponerla ya que al principio del bucle ya se comprueba que option !== 0, pero por si acaso la dejo visible.
    if (option === 0) {
        console.log("Exiting Medicare Billing System...");
    }
}
r1.close(); // Finally we close the input/output stream