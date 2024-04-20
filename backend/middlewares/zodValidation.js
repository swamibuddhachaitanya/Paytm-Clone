const { z } = require("zod");

const user = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

const updateBody = z.object({
	password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

const signinUser = z.object({
    username: z.string(),
    password: z.string()
})

function ValidateUser(req, res, next) {
  //validation for signup
  try {
    const UserToValidate = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    const ValidatedUser = user.parse(UserToValidate);
    req.ValidatedUser = ValidatedUser;
    console.log("user is validated"+ req.body.username)
    next();
  } catch (error) {
   return res.status(400).json({ error: "error validating the user during signup" });
  }
}

function signinValidation(req, res, next) {
    try {
        
        const UserToValidate = {
            username: req.body.username,
            password: req.body.password,
          };
          const ValidatedUser = signinUser.parse(UserToValidate);
          req.ValidatedUser = ValidatedUser;
          next();

    } catch (error) {
        return res.status(400).json({ error: "error validating the user during signin" });
    }
}

module.exports = {
  ValidateUser,
  signinValidation,
  updateBody
};
