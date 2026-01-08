class Rental{
    constructor(rentalID,customer, car, rentalDuration){
        if(new.target === Rental){
            throw new TypeError("Abstract class can not be instanciated");
        }
        if (rentalDuration <= 0) {
            throw new InvalidRentalDurationError("Invalid rental duration");
        }
        this.rentalID = rentalID;
        this.customer = customer;
        this.car = car;
        this.rentalDuration = rentalDuration;
    }

    rentCar(){
        throw new Error("Abstract method must be implemented");

    }

    returnCar(){
        throw new Error("Abtsract method must be implemented");
    }

    calculateRentalPrice(){
        throw new Error("Abtsract method must be implemented");
    }


}

class StandardRental extends Rental{
    constructor(rentalID,customer, car, rentalDuration){
        super(rentalID,customer, car, rentalDuration);
    }

    rentCar(){
        this.car.markRented();
        console.log("Car rented");
    }

    returnCar(){
        this.car.markAvailable();
        console.log("Car Available");
    }

    calculateRentalPrice(){
        return this.car.rentalPricePerDay * this.rentalDuration;
    }


}

class LuxuryCarRental extends Rental{
    constructor(rentalID,customer, car, rentalDuration){
        super(rentalID,customer, car, rentalDuration);
    }

    rentCar(){
        this.car.markRented();
        console.log("Luxury Car rented");
    }

    returnCar(){
        this.car.markAvailable();
        console.log("Luxury Car Available");
    }

    calculateRentalPrice(){
        return this.car.rentalPricePerDay * this.rentalDuration + this.car.extraFee;
    }


}

class Car{
    constructor(make, model, rentalPricePerDay, isAvailable){
        this.make = make;
        this.model = model;
        this.rentalPricePerDay = rentalPricePerDay;
        this.isAvailable = isAvailable;
    }

    set make(value){
        if(!value){
            throw new Error("car make can not be empty string");
        }
        this._make = value;
    }
    get make(){
        return this._make;
    }

    set model(value){
        if(!value){
            throw new Error("car model can not be empty string");
        }
        this._model = value;
    }
    get model(){
        return this._model;
    }

    set rentalPricePerDay(value){
        if(value < 0){
            throw new Error("Price must be positive number")
        }
        this._rentalPricePerDay = value;
    }
    get rentalPricePerDay(){
        return this._rentalPricePerDay;
    }

    markRented(){
        if(!this.isAvailable){
            throw new CarNotAvailableError("Car is not available now");
        }
        this.isAvailable = false;
    }
    markAvailable(){
        this.isAvailable = true;
    }

}

class EconomyCar extends Car{
    constructor(make, model, rentalPricePerDay, isAvailable){
        super(make, model, rentalPricePerDay, isAvailable);
    }
}

class LuxuryCar extends Car{
    constructor(make, model, rentalPricePerDay, isAvailable, extraFee){
        super(make, model, rentalPricePerDay, isAvailable);
        this.extraFee = extraFee;
    }
}


class Customer{
    constructor(name, contactInfo){
        this.name = name;
        this.contactInfo = contactInfo;
        this.rentalHistory = [];
    }

    set name(value){
        if(!value){
            throw new Error("Name can not be empty");
        }
        this._name = value;
    }

    get name(){
        return this._name;
    }

    set contactInfo(value){
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
       if(!regex.test(value)){
        throw new Error("invalid mail address");
       }
       this._contactInfo = value;
    }
    get contactInfo(){
        return this._contactInfo;
    }

    searchcars(filters){
        
    }
    viewRentalHistory(){
        return [...this.rentalHistory];
    }
}


class CarNotAvailableError extends Error{
    constructor(message){
        super(message);
        this.name = "CarNotAvailableError";
    }
}

class InvalidRentalDurationError extends Error{
    constructor(message){
        super(message);
        this.name = "InvalidRentalDurationError";
    }
}

const economyCar = new EconomyCar("Kia", "Forte", 50, true);
const luxuryCar = new LuxuryCar("BMW", "M5", 150, true, 200);
const customer = new Customer("Alik", "alikavetisyan@gmail.com");
const economyRental = new StandardRental(1,customer,economyCar,3);
const luxuryRental = new LuxuryCarRental(2,customer,luxuryCar,4);
console.log("Economy car available before:", economyCar.isAvailable);
economyRental.rentCar();
console.log("Economy car available after:", economyCar.isAvailable);
console.log("Economy car rental price:", economyRental.calculateRentalPrice());
console.log("Luxury car available before:", luxuryCar.isAvailable);
luxuryRental.rentCar();
console.log("Luxury car available after:", luxuryCar.isAvailable);
console.log("Luxury car rental price:", luxuryRental.calculateRentalPrice());
