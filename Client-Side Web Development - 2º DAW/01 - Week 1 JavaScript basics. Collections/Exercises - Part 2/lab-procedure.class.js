import { MedicalService } from "./medical-service.class.js";

export class LabProcedure extends MedicalService {
  #sampleType;

  constructor(serviceCode, baseFee, sampleType) {
    super(serviceCode, baseFee);
    this.sampleType = sampleType;
  }

  get sampleType() {
    return this.#sampleType;
  }

  set sampleType(value) {
    const validTypes = ["Blood", "Tissue", "Culture"];

    if (!validTypes.includes(value)) {
      console.error("Error: sampleType must be Blood, Tissue, or Culture.");
      return;
    }

    this.#sampleType = value;
  }

  sterilizeKit() {
    console.log(`Sterilizing testing kit for ${this.#sampleType} analysis.`);
  }

  toString() {
    return `[LAB Sample: ${this.#sampleType}] ${super.toString()}`;
  }
}
