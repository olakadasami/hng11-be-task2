const prisma = require("../db/prisma");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  createOrgSchema,
  addUserToOrgSchema,
} = require("../validators/organisation_validator");

/**
 * @desc Get all organisations associated with user
 * @route GET
 */
exports.index = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  // find user
  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
    include: {
      organisations: true,
    },
  });

  if (!user) {
    return next(new AppError("User does not exist", 400));
  }

  res.status(200).json({
    status: "success",
    message: "<message>",
    data: {
      organisations: user.organisations,
    },
  });
});

/**
 * @desc Get single organisation associated with user
 * @route GET
 * @params orgId number
 */
exports.show = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { orgId } = req.params;

  // find user
  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
    include: {
      organisations: true,
    },
  });
  const org = await user.organisations.find((i) => i.orgId === +orgId);

  if (!org) {
    return next(new AppError("Organisation does not exist", 400));
  }

  res.status(200).json({
    status: "success",
    message: "<message>",
    data: org,
  });
});

/**
 * @desc user create a new organisation
 * @route POST
 */
exports.createNewOrg = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { error, value } = createOrgSchema.validate(req.body, {
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

  // create organisation
  const newOrg = await prisma.organisation.create({
    data: {
      ...value,
      users: {
        connect: { userId },
      },
    },
  });

  res.status(200).json({
    status: "success",
    message: "<message>",
    data: newOrg,
  });
});

/**
 * @desc Add user to an existing organisation
 * @route POST
 * @params ordId
 */
exports.addUserToOrg = catchAsync(async (req, res, next) => {
  const { orgId } = req.params;
  const { error, value } = addUserToOrgSchema.validate(req.body, {
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

  //   find user
  const user = await prisma.user.findUnique({
    where: {
      userId: +value.userId,
    },
  });
  if (!user) {
    return next(new AppError("Client Error", 400));
  }

  // add user to organisation
  const updatedOrg = await prisma.organisation.update({
    where: { orgId: +orgId },
    data: {
      users: {
        connect: { userId: user.userId },
      },
    },
  });

  console.log({ updatedOrg });

  res.status(200).json({
    status: "success",
    message: "User added to organisation successfully",
  });
});
