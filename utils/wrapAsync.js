module.exports = function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}; //the wrapasync function takes a function as arhument or input
//and wraps or passes it into another function which handles the error
// handling and returns a function that takes req, res, and next as arguments
//it calls the original function with req, res, and next and catches any errors
//that occur during its execution, passing them to the next middleware function
//in the Express.js request-response cycle.