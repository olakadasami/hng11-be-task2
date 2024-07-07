const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const prisma = require("../db/prisma");

/**
 * Protect middleware, adds req.user
 * @desc Checks if user is authenticated
 * By checking authorization headers for bearer token
 */
module.exports = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Unauthorized, Token Required", 401));
  }

  // Verify Token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check if user exists
  const exists = await prisma.user.findUnique({
    where: {
      userId: decoded.userId,
    },
  });
  if (!exists) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }

  // check for expired token
  const expiredToken = decoded.exp < Date.now() / 1000;
  if (expiredToken)
    return next(new AppError("Unauthorized, Expired token", 401));

  // Set req.user and Grant access to protected route
  req.user = { userId: decoded.userId };
  next();
});
