const bcrypt = require("bcrypt");
const { loginSchema } = require("../../validators/user_validator");
const prisma = require("../../db/prisma");
const catchAsync = require("../../utils/catchAsync");
const generateToken = require("../../utils/generateToken");
const AppError = require("../../utils/appError");

module.exports = catchAsync(async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  });

  //   If validation error
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context.key,
      message: err.message,
    }));

    return res.status(422).json({ errors });
  }

  //  Find User
  const { password, ...user } = await prisma.user.findUnique({
    where: {
      email: value.email,
    },
  });

  if (!user || !(await bcrypt.compare(value.password, password))) {
    return next(new AppError("Authentication failed", 401));
  }

  //   generate Access token
  const accessToken = await generateToken(user, process.env.JWT_SECRET, "1d");

  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      accessToken,
      user,
    },
  });
});
