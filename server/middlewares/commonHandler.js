const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "INTERNAL SERVER ERROR";
  return res.status(status).json({
    status: message,
    message: "Something went wrong",
    data: null,
  });
};

const notFoundHandler = (req, res, next) => {
  return res.status(404).json({
    status: "NOT FOUND",
    message: "There is no resource you looking for",
    data: null,
  });
};

module.exports = { errorHandler, notFoundHandler };
