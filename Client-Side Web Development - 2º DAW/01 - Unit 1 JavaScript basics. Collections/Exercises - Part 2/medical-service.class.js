export class MedicalService {
  #serviceCode;
  #baseFee;

  constructor(serviceCode, baseFee) {
    this.#serviceCode = serviceCode;
    this.baseFee = baseFee;
  }

  get serviceCode() {
    return this.#serviceCode;
  }

  get baseFee() {
    return this.#baseFee;
  }

  set baseFee(value) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue) || numericValue < 30) {
      console.error("Error: baseFee cannot be set below 30.");
      return;
    }

    this.#baseFee = numericValue;
  }

  valueOf() {
    return this.#baseFee;
  }

  toString() {
    const formattedFee = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR"
    }).format(this.#baseFee);

    return `[${this.#serviceCode}] Base Fee: ${formattedFee}`;
  }
}
