class ExpressError extends Error {
//custom error class that extends the built-in Error class 
    constructor(statusCode, message) {
        super();
        //calls the constructor of the parent Error class so the custom error class
        //can inherit the properties and methods of the parent class
        this.statusCode = statusCode;
        this.message = message;
        //this is used to set the status code and message properties of the custom error object
         // 'this' refers to the **current instance** of ExpressError being created
        // In other words, 'this' is the object that will be returned when you do:
        // const err = new ExpressError(404, "Not Found");
        // Using 'this', we can add properties to this object
       // set a custom HTTP status code
               // set a custom error message
    }
}

module.exports = ExpressError;