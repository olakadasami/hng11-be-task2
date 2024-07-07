const AppError = require("../utils/appError");

const handleJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired!", 401);
};

const handleTimeoutError = () => {
  return new AppError("Request timeout", 408);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err.data,
  });
};

const sendErrorProd = (err, res) => {
  const { isOperational } = err;

  const statusCode = isOperational ? err.statusCode : 500;
  const message = isOperational ? err.message : "Something went very wrong!";
  const data = isOperational ? err.data : null;
  const status = isOperational ? err.status : "error";

  console.error("An error occurred in the server ==> : ", err);

  return res.status(statusCode).json({
    status: status,
    message: message,
    statusCode: statusCode,
    // error: data,
  });
};

module.exports = errorHandler = (err, req, res, next) => {
  err.statusCode = err?.statusCode || 500;
  err.status = err?.status || "Error";
  let error = err;

  switch (process.env.NODE_ENV) {
    case "development":
      logger.error(
        `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return sendErrorDev(err, res);
    case "production":
      switch (true) {
        // case err instanceof MongooseError.CastError:
        //   error = handleMongooseCastError(err);
        //   break;
        // case err instanceof MongooseError.ValidationError:
        //   error = handleMongooseValidationError(err);
        //   break;
        case "timeout" in err && err.timeout:
          error = handleTimeoutError();
          break;
        case err.name === "JsonWebTokenError":
          error = handleJWTError();
          break;
        case err.name === "TokenExpiredError":
          error = handleJWTExpiredError();
          break;
        // case err.code === 11000:
        //   error = handleMongooseDuplicateFieldsError(err, next);
        // break;
        default:
          break;
      }

      return sendErrorProd(error, res);
    default:
      return sendErrorDev(err, res);
  }
};
