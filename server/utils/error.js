const StatusCodes = require("http-status-code");

class BadRequest extends Error {
  status;

  constructor(message, status = StatusCodes.BAD_REQUEST) {
    super(message);
    this.status = status;
  }
}

export default BadRequest;
