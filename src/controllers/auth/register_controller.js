const bcrypt = require("bcrypt");
const { registerSchema } = require("../../validators/user_validator");
const prisma = require("../../db/prisma");
const catchAsync = require("../../utils/catchAsync");
const generateToken = require("../../utils/generateToken");

module.exports = catchAsync(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body, {
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

  const exists = await prisma.user.findUnique({
    where: {
      email: value.email,
    },
  });

  if (exists) {
    return res.status(422).json({
      status: "Duplicate Email",
      message: "Email is already registered",
      statusCode: 422,
    });
  }

  //   Hash password
  const hashedPassword = await bcrypt.hash(value.password, 10);
  const userObj = {
    ...value,
    password: hashedPassword,
  };

  //   Create a new user
  const { password, ...newUser } = await prisma.user.create({
    data: {
      ...userObj,
      organisations: {
        create: {
          name: `${userObj.firstName}'s Organisation`,
        },
      },
    },
  });

  //   generate Access token
  const accessToken = await generateToken(
    newUser,
    process.env.JWT_SECRET,
    "1d"
  );

  res.status(201).json({
    status: "success",
    message: "Registration successful",
    data: {
      accessToken,
      user: newUser,
    },
  });
});
