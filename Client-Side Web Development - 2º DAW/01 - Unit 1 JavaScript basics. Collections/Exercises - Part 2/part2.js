import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { MedicalService } from "./medical-service.class.js";
import { EmergencyTriage } from "./emergency-triage.class.js";
import { LabProcedure } from "./lab-procedure.class.js";

const r1 = readline.createInterface({ input, output });

const services = new Map();

services.set("EM-01", new EmergencyTriage("EM-01", 50, 3));
services.set("EM-02", new EmergencyTriage("EM-02", 80, 5));
services.set("LB-01", new LabProcedure("LB-01", 40, "Blood"));
services.set("LB-02", new LabProcedure("LB-02", 60, "Culture"));

let option = "";

while (option !== "0") {
  console.log("============ MEDICARE BILLING SYSTEM ============");
  console.log("1) List All Services (Formatted)");
  console.log("2) Register New Medical Service");
  console.log("3) Apply Emergency Triage Surcharges");
  console.log("4) Sterilize Lab Kits");
  console.log("5) Compare Two Services by Price (valueOf)");
  console.log("6) Lookup Service by Code");
  console.log("0) Exit");
  console.log("=================================================");

  option = await r1.question("Choose an option: ");

  switch (option) {
    case "1":
      for (const service of services.values()) {
        console.log(service.toString());
      }
      break;

    case "2": {
      const code = await r1.question("Service code: ");
      const fee = Number(await r1.question("Base fee: "));
      const type = await r1.question("Type (1=Emergency, 2=Lab): ");

      if (type === "1") {
        const level = Number(await r1.question("Urgency level (1-5): "));
        services.set(code, new EmergencyTriage(code, fee, level));
      } else if (type === "2") {
        const sampleType = await r1.question("Sample type (Blood/Tissue/Culture): ");
        services.set(code, new LabProcedure(code, fee, sampleType));
      }
      break;
    }

    case "3":
      for (const service of services.values()) {
        service?.applyTriageCharge?.();
      }
      console.log("Emergency triage charges applied.");
      break;

    case "4":
      for (const service of services.values()) {
        service?.sterilizeKit?.();
      }
      break;

    case "5": {
      const code1 = await r1.question("First service code: ");
      const code2 = await r1.question("Second service code: ");

      const service1 = services.get(code1);
      const service2 = services.get(code2);

      if (service1 && service2) {
        if (service1 < service2) {
          console.log(`${code1} is cheaper than ${code2}`);
        } else if (service1 > service2) {
          console.log(`${code1} is more expensive than ${code2}`);
        } else {
          console.log("Both services cost the same.");
        }
      } else {
        console.log("One or both service codes are not registered.");
      }
      break;
    }

    case "6": {
      const code = await r1.question("Service code: ");
      console.log(services.get(code)?.toString() ?? "Service code not registered");
      break;
    }

    case "0":
      console.log("Exiting...");
      break;

    default:
      console.log("Invalid option.");
  }
}

r1.close();