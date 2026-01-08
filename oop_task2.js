class Menu{
    #dishes;
    constructor(){
        if(new.target === Menu){
            throw new TypeError("Cannot instantiate abstract class Menu")
        }
        this.#dishes = new Map();
    }

    addDish(dish){
        throw new Error("Abstract Method must be implemented")
    }
    removeDish(dishName){
        throw new Error("Abstract Method must be implemented")
    }

    viewMenu(){
        throw new Error("Abstract Method must be implemented")
    }
    _internalAddDish(dish){
        this.#dishes.set(dish.name,dish)
    }
    _internalRemoveDish(dishName){  
        if(!this.#dishes.has(dishName)) {
        throw new DishNotFound("Dish not found");
    }
    this.#dishes.delete(dishName);
    }

    _getDish(dishName) {
    return this.#dishes.get(dishName);
    }
    _getMenu(){
        return [...this.#dishes.values()];
    }

    increasePrice(dishName, percent){
        const dish = this._getDish(dishName);
        if(!dish){throw new Error("dish not found")}
        dish.price += dish.price * (percent / 100)
    }
    decreasePrice(dishName, percent){
        const dish = this._getDish(dishName);
        if(!dish){throw new Error("dish not found")}
        dish.price -= dish.price * (percent / 100)
    }
}


class AppetizersMenu extends Menu{
    constructor(spiceLevel){
        super();
        this.spiceLevel = spiceLevel;
    }

     addDish(dish){
        if (!(dish instanceof Appetizer)) {
            throw new Error("Only Appetizers allowed");
        }
        if(!dish){ throw new Error("invalid dish")};
        if(this._getDish(dish.name)){
            throw new Error("Dish already exist")
        }
        this._internalAddDish(dish);
    }
    removeDish(dishName){
        this._internalRemoveDish(dishName);
}

    viewMenu(){
        return this._getMenu();
    }

}


class EntreesMenu extends Menu{
    constructor(prepTime){
        super();
        this.prepTime = prepTime;
    }

    addDish(dish){
        if (!(dish instanceof Entrees)) {
            throw new Error("Only Entrees allowed");
    }
        if(this._getDish(dish.name)){
            throw new Error("Dish already exist")
        }
        this._internalAddDish(dish);
    }
    removeDish(dishName){
        this._internalRemoveDish(dishName);
}

    viewMenu(){
        return this._getMenu();
    }
    

}


class DesertsMenu extends Menu{
     addDish(dish){
        if (!(dish instanceof Deserts)) {
            throw new Error("Only deserts allowed");
        }
        if(this._getDish(dish.name)){
            throw new Error("Dish already exist")
        }
        if(dish.price > 20){
            throw new Error("Maximum price cap")
        }
        this._internalAddDish(dish);
    }
    removeDish(dishName){
        this._internalRemoveDish(dishName);
}

    viewMenu(){
        return this._getMenu();
    }
    

}


class Customer{
    constructor(name,contactInfo){
        this._name = name;
        this.contactInfo = contactInfo;
        this.orderHistory = [];
    }

    set name(value){
        if(!value){
            throw new Error("Name can not be empty")
        }
        this._name = value
    }
    get name(){
        return this._name;
    }
    
    
    set contactInfo(value) {
    const regex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/;
    if (!regex.test(value)) {
      throw new Error("Invalid contact info");
    }
    this._contactInfo = value;
    }

    get contactInfo() {
    return this._contactInfo;
    }

    placeOrder(order){
        if(!(order instanceof Order)){
            throw new Error("invalid order")
        }
        this.orderHistory.push(order);
    }

    viewOrderHishtory(){
        return [...this.orderHistory];
    }
}




class Order{
    #totalPrice = 0
    constructor(customer){
        this.customer = customer;
        this.dishes = [];
    }
    addDish(dishName, menus) {
    for (const menu of menus) {
      const dish = menu._getDish(dishName);
      if (dish) {
        this.dishes.push(dish);
        this.#totalPrice += dish.price;
        return;
      }
    }
    throw new DishNotFound("Dish not found");
  }

    getTotal(){
        return this.#totalPrice;
    }

    viewSummary(){
        return this.dishes;
    }
}


class Dish{
    constructor(name,price){
        this._name = name;
        this._price = price;
    }

    set name(value){
        if(!value){
            throw new TypeError("name can not be empty");
        }
        this._name = value;
    }
    get name (){
        return this._name;
    }

    set price(value){
        if(value < 0){
            throw new Error("price can not be negative")
        }
        this._price = value;
    }

    get price(){
        return this._price;
    }
}

class Appetizer extends Dish{
    constructor(name,price){
        super(name,price);
    }
}

class Entrees extends Dish{
    constructor(name, price){
        super(name, price);
    }
}

class Deserts extends Dish{
    constructor(name, price){
        super(name, price);
    }
}


class DishNotFound extends Error{
    constructor(message){
        super(message);
        this.name = "Dish Not Found";
    }
}

class InvalidOrderError extends Error{
    constructor(message){
        super(message);
        this.name = "Invalid Order Error";
    }
}


const appetizersMenu = new AppetizersMenu("medium");
const entreesMenu = new EntreesMenu(25);
const desertsMenu = new DesertsMenu();


const cheese = new Appetizer("Cheese", 6);
const steak = new Entrees("Steak", 25);
const iceCream = new Deserts("Ice Cream", 8);

appetizersMenu.addDish(cheese);
desertsMenu.addDish(iceCream);
entreesMenu.addDish(steak);

console.log("Appetizers:", appetizersMenu.viewMenu());
console.log("Entrees:", entreesMenu.viewMenu());
console.log("Desserts:", desertsMenu.viewMenu());

const customer = new Customer("Albert", "123-456-7890");

const order = new Order(customer)

order.addDish("Steak", [appetizersMenu,entreesMenu,desertsMenu]);
order.addDish("Ice Cream", [appetizersMenu,entreesMenu,desertsMenu]);

console.log("Order:", order.viewSummary());
console.log("Total Price:", order.getTotal());

// desertsMenu.increasePrice("Ice Cream", 20)
// console.log("Order:", order.viewSummary());
// console.log("Total Price:", order.getTotal());