import {MedicalService} from "./medical-service.class";

export class LabProcedure extends MedicalService{
    #sampleType;

    //Getter
    get sampleType(){
        return this.#sampleType;
    }

    //Setter with validation
    set sampleType(value){
        const allowedTypes = ["blood", "Tissue", "Culture"];
        if (!allowedTypes.includes(value)) {
            console.error("Invalid sample type.");
            return;
        }
        this.#sampleType = value;
    }

    // Method sterilizeKit(): prints "Sterilizing testing kit for [sampleType] analysis."
    sterilizeKit() {
        console.log(`Sterilizing testing kit for ${this.#sampleType} analysis.`);
    }

    //Constructor
    constructor(serviceCode, baseFee, sampleType) {
        super(serviceCode, baseFee);
        this.sampleType = sampleType; // usa el setter igual que en la otra clase.
    }
    // Method toString
    toString() {
        return `${super.toString()} [LAB Sample: ${this.#sampleType}]`;
    }

}