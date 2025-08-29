class ExpressError extends Error {
  constructor(message, statusCode) {
    super(message); // Pass message to Error constructor
    this.statusCode = statusCode;
    this.name = "ExpressError";
  }
}

module.exports = ExpressError;