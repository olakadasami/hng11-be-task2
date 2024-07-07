const prisma = require("../db/prisma");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  if (userId !== +req.params.id) {
    return next(new AppError("Unauthorized access", 401));
  }

  const { password, ...user } = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  res.status(200).json({
    status: "success",
    message: "<message>",
    data: user,
  });
});
