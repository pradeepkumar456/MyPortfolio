class ExpressError extends Error {
  constructor(message, statusCode) {
    super(message); // Pass message to the parent Error class
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
