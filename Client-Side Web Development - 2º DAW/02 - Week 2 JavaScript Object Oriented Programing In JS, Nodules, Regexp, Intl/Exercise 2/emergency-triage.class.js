import {MedicalService} from "./medical-service.class.js";

export class EmergencyTriage extends MedicalService{
    #urgencyLevel;

    //Getter
    get urgencyLevel(){
        return this.#urgencyLevel;
    }

    //Setter with validation
    set urgencyLevel(value){
        if (value < 1 || value > 5) {
            console.error("Urgency level must be between 1 and 5.");
            return;
        }
        this.#urgencyLevel = value;
    }

    // Method applyTriageCharge() that increases the baseFee by a factor of 
    // urgencyLevel * 0.20 and returns the updated fee.
    
    applyTriageCharge() {
        const increaseFactor = this.#urgencyLevel * 0.20;
        this.baseFee = this.baseFee * (1 + increaseFactor);
        return this.baseFee;
    }
    //Constructor
    constructor(serviceCode, baseFee, urgencyLevel) {
        super(serviceCode, baseFee);
        this.urgencyLevel = urgencyLevel; // -> **Importante: Aquí se usa el setter sino no se aplicaría la validación**.
    }

    // Method to String
    toString() {
        return `${super.toString()} [EMERGENCY Level ${this.#urgencyLevel}]`;
    }
}
