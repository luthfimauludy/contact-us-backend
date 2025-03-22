class BadRequest extends Error {
  status;

  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = BadRequest;
