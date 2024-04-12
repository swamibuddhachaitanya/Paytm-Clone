// backend\routes\user.js

const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  ValidateUser,
  signinValidation,
  updateBody,
} = require("../middlewares/zodValidation");
const { User, uniqueUserValidation, Account } = require("../db/db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = Router();



router.post(
  "/signup",
  ValidateUser,
  uniqueUserValidation,
  async function (req, res) {
    //inputs are correct then create a user and return its id as userid
    //upon signup the new user should be created and then that created user's _id should be used as the payload for the jwt and that token should be returned as the Response:
    // Status code - 200
    // {
    // 	message: "User created successfully",
    // 	token: "jwt"
    // }

    try {
      const { username, firstName, lastName, password } = req.body;

      const newUser = new User({
        username,
        firstName,
        lastName,
      });

      // Add another functionality to hash the password using bcrypt
      var hashedPassword = await newUser.createHash(password);
      newUser.password = hashedPassword;

      // Save newUser object to database
      const savedUser = await newUser.save();
      
      // create a random value between 1 and 10000
      const randomBalance = Math.floor(Math.random()* 10000) + 1;
      
      const newAccount = new Account({
        userId: savedUser._id,
        balance: randomBalance
      });

      await newAccount.save();

      //creating payload and using jwt secret to create the jwt
      const payload = {
        userId: savedUser._id,
      };

      const token = jwt.sign(payload, JWT_SECRET);

      res.status(200).json({ msg: "User created successfully", token: token });

    } catch (error) {
      res
        .send(500)
        .json({ msg: "getting error while creating new user in the signup." });
    }
  }
);

router.post("/signin", signinValidation, async function (req, res) {
  //to signin and give the token to the user
  try {
    //getting only username and password via the body
    //so verify the token
    let user = await User.findOne({ username: req.body.username });

    if (user) {
      //user exists
      if (await user.validatePassword(req.body.password)) {
        //if password is also correct
        //then create the jwt and return it with the success message
        //creating payload and using jwt secret to create the jwt
        const payload = {
          userId: user._id,
        };

        const token = jwt.sign(payload, JWT_SECRET);

        return res.status(200).json({
          jwt: token,
        });
      } else {
        return res.status(400).json({ error: "Incorrect Password" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/", authMiddleware, async function (req, res) {
  //this is for updating the password, firstname or lastname one or more of them can be updated at once.
  try {
    const userId = req.userId;
    //see if the format is right using zod middleware
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Error while updating information",
      });
    }
    let password = req.body.password;
    if (password) {
      //then first hash it and then put it into the db
      // Hashing user's salt and password with 10 iterations,
      const saltRounds = 10;

      // First method to generate a salt and then create hash
      const salt = await bcrypt.genSalt(saltRounds);
      password = await bcrypt.hash(password, salt);
      req.body.password = password;
    }

    await User.updateOne({ _id: userId }, req.body);

    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(400).json({ error: "error during updating" });
  }
});

router.get("/bulk", async function (req, res) {
  // Route to get users from the backend, filterable via firstName/lastName
  // This is needed so users can search for their friends and send them money
  try {
    const name = req.query.filter; // name to find in the db;

    const usersFound = await User.find(
      { $or: [{ firstName: name }, { lastName: name }] }, //condition for query
      '_id username firstName lastName ' // fields to include
    );

    if (usersFound) {
      return res.status(200).json(usersFound);
    } else {
      return res.status(404).json({ message: "Users not found" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: "error during filtering{bulk route}" });
  }
});

module.exports = router;
