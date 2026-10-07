import { MedicalService } from "./medical-service.class.js";

export class EmergencyTriage extends MedicalService {
  #urgencyLevel;

  constructor(serviceCode, baseFee, urgencyLevel) {
    super(serviceCode, baseFee);
    this.urgencyLevel = urgencyLevel;
  }

  get urgencyLevel() {
    return this.#urgencyLevel;
  }

  set urgencyLevel(value) {
    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 5) {
      console.error("Error: urgencyLevel must be a number between 1 and 5.");
      return;
    }

    this.#urgencyLevel = numericValue;
  }

  applyTriageCharge() {
    const increase = this.baseFee * (this.#urgencyLevel * 0.2);
    this.baseFee = this.baseFee + increase;
    return this.baseFee;
  }

  toString() {
    return `[EMERGENCY Level ${this.#urgencyLevel}] ${super.toString()}`;
  }
}
