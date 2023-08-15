import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
const RegisterUser = async (req, res) => {
  try {
    // get the user
    const { firstName, lastName, email, password } = req.body;

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password less than 6 characters" });
    }

    // Validate user input
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: "Please fill in all fields" });
    }

    // checl user if user is already registered
    // validate user if user is already registered in the database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .send({ message: "User already registered, Please Login" });
    }

    // encrypt user password
    const encryptedUserPassword = await bcrypt.hash(password, 10);

    // create user in our database
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(), //sanitize email
      password: encryptedUserPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_TOKENKEY,
      {
        expiresIn: "5h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 5,
    });

    // save user token
    user.token = token;

    // retrun new user
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// login user
const authControllers = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      res.status(400).json({ message: "Please fill in all fields" });
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_TOKENKEY,
        {
          expiresIn: "5h",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 5,
      });

      //   save user token
      user.token = token;

      //   user
      return res.status(200).json({ user });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.log(error);
  }
};

// Logout user
const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Successfully logged out" });
};

export { authControllers, RegisterUser, logout };
