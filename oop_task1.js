class BankAccount {
    #balance = 0;
    #transactions = [];
    constructor(accountNumber,type,balance){
    if(new.target === BankAccount){
        throw new TypeError("Cannot instantiate abstract class BankAccount");
    }
    this._accountNumber = accountNumber;
    this._type = type;
    this.#balance = balance;
    this.#transactions = [];
    Object.defineProperty(this,'accountNumber',{
        get: function (){
            return this._accountNumber;
        },
        set: function(accountNumber){
        if(String(accountNumber).length === 10){
            this._accountNumber = accountNumber;
        }
        else{
            throw new ValidateError("Account number must be exactly 10 digits long");
        }
    },
    enumerable: true
    })
    Object.defineProperty(this, 'balance', {
        get: function() {
            return this.#balance;
        },
        set: function(){
            throw new Error("Can not directly change balance")
        },
        enumerable: true,
        configurable: false
    });
    Object.defineProperty(this, 'type', {
        get: function() {
            return this._type;
        },
        set: function(type){
            if(typeof type !== 'string'){
                throw new TypeError("Type must be a string");
            }
            if(type !== 'individual' && type !== 'joint'){
                throw new Error("individual or joint")
            }
            this._type = type
        },
        enumerable: true,
        configurable: false
    });

    Object.defineProperty(this, 'transactions', {
    get: function(){ return [...this.#transactions] },
    set: function(){ throw new Error("Transactions cannot be set directly"); },
    enumerable: true,
    configurable: false
});
    }

    getBalance(){
        return this.#balance;
    }

    getTransactions(){
        return [...this.#transactions];
    }
    _recordTransaction(transaction) {
        this.#transactions.push(transaction);
    }
    _increaseBalance(amount){
        this.#balance += amount
    }
    _decreaseBalance(amount){
        this.#balance -= amount;
    }
    deposit(amount){
        throw new Error("Method 'deposit()' must be implemented.");
    }
    withdraw(amount){
        throw new Error("Method 'withdraw()' must be implemented.");
    }
    transferFunds(targetAccount, amount, actor){
        throw new Error("Method 'transferFunds()' must be implemented.");
    }
}


class Transaction{
    constructor(accountNumber,amount,transactiontype,timestamp){
        this.accountNumber = accountNumber;
        this.amount = amount;
        this.transactiontype = transactiontype;
        this.timestamp = new Date().toISOString();
    }
}

class IndividualAccount extends BankAccount {
    constructor(accountNumber, type, balance = 0) {
        super(accountNumber, type, balance)
    }

    deposit(amount) {
        if(amount <= 0){
            throw new InvalidTransaction("Deposit must be positive")
        }
        this._recordTransaction(new Transaction(this.accountNumber,'deposit', amount))
        this._increaseBalance(amount)
    }

    withdraw(amount) {
        if(amount <= 0) throw new InvalidTransaction("Withdrawal must be positive");
        if(amount > this.balance) throw new InsufficentFundsError("Not enough balance"); 
        this._recordTransaction(new Transaction(this.accountNumber,'withdraw', amount))
        this._decreaseBalance(amount)
    }
    transferFunds(targetAccount, amount, actor) {
        if (amount <= 0) {
            throw new InvalidTransaction("Transfer amount must be positive");
        }
        if (amount > this.balance) {
            throw new InvalidTransaction("not enough funds");
        }
        this.withdraw(amount);
        targetAccount.deposit(amount);
        this._recordTransaction(new Transaction(this.accountNumber, 'transfer', amount));
    }


}
class JointAccount extends BankAccount {
    constructor(accountNumber, type, balance, owners = []) {
        super(accountNumber, 'joint', balance);
        this.owners = owners;
    }
    addOwners(owner){
        this.owners.push(owner);
    }
    deposit(amount) {
        if (amount <= 0) {
            throw new Error("Deposit amount must be positive");
        }
        this._recordTransaction(new Transaction(this.accountNumber,'deposit', amount))
        this._increaseBalance(amount);
    }

    withdraw(amount) {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be positive");
        }
        if (amount > this.balance) {
            throw new Error("not enough funds");
        }
        this._recordTransaction(new Transaction(this.accountNumber,'withdraw', amount))
        this._decreaseBalance(amount);
    }
    getBalance() {
        return this.balance;
    }

    transferFunds(targetAccount, amount, actor) {
        if (amount <= 0) {
            throw new Error("Transfer amount must be positive");
        }
        if (amount > this.balance) {
            throw new Error("not enough funds");
        }
        this._recordTransaction(new Transaction(this.accountNumber,'transfer', amount))
        this.withdraw(amount);
        targetAccount.deposit(amount);

    }


}
class ValidateError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidateError";
    }
}
class InsufficentFundsError extends Error {
    constructor(message) {
        super(message);
        this.name = "Insufficent Funds Error";
    }
}
class InvalidTransaction extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidTransaction";
    }
}
class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthorizationError";
    }
}


class Customer{
    constructor(name, contactInfo){
        this._name = name;
        this.contactInfo = contactInfo;
        this.accounts = [];
        Object.defineProperty(this,'name',{
            set: function(value){
                if(!value){
                    throw new Error("name can not be empty string.")
                }
                this._name = value;
            },
            get: function(){
                return this._name
            },
            enumerable: true,
            configurable: false,
    });


    }
    set contactInfo(email) {
    if (!this.emailChecker(email)) {
        throw new ValidateError("Invalid email address");
    }
    this._contactInfo = email;
    }
    get contactInfo(){
        return this._contactInfo;
    }


    emailChecker(email){
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(email);
    }
    addAccount(account){
        if(!(account instanceof BankAccount)) throw new Error("add valid account");
        this.accounts.push(account);
        if(account instanceof JointAccount) account.addOwners(this._name);
    }

    viewAccounts(){
        return this.accounts;
    }

    viewTransactionsHistory(accountNumber){
        const account = this.accounts.find(acc => acc.accountNumber === accountNumber);
        if (!account) throw new ValidateError("Account not found");
        return account.getTransactions();
    }
}

const acc1 = new IndividualAccount('1234567890', 'individual',1000);
const jointAcc = new JointAccount('0987654321', 'joint', 2000);
const customer = new Customer("Albert", "albert@gmail.com");

customer.addAccount(acc1);
customer.addAccount(jointAcc);
acc1.deposit(100)
jointAcc.deposit(300);
jointAcc.transferFunds(acc1, 100, 'Albert')
console.log(acc1.getBalance());
console.log(jointAcc.getBalance());

console.log(customer.viewTransactionsHistory('1234567890')); 
console.log(customer.viewTransactionsHistory('0987654321'));