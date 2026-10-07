export class MedicalService{
    #serviceCode;
    #baseFee;
    
    //Getters 
    get serviceCode(){
        return this.#serviceCode;
    }

    get baseFee(){
        return this.#baseFee;
    }

    //Setters with validation
    set baseFee(value){
        if (value < 30) {
            console.error("Base fee cannot be below 30.");
            return;
        }
        this.#baseFee = value;
    }
    //Override valueOf
    valueOf(){
        return this.#baseFee;
    }

    //Constructor
    constructor(serviceCode, baseFee){
        this.#serviceCode = serviceCode;
        this.#baseFee = baseFee;
    }

    //Method to String
    toString(){
        const formattedFee = new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR"
        }).format(this.#baseFee);
        return `[${this.#serviceCode}] Base Fee: ${formattedFee}`;
    }
}