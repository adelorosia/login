import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists)
    throw new Error("Sie konnen nicht mit diser E-Mail-Addresse Registerieren");
  try {
    await User.create({
      firstName,
      lastName,
      email,
      password,
      gender,
    });
    res.json("Register successfull");
  } catch (error) {
    res.json(error);
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userFound = await User.findOne({ email });
  if (userFound && (userFound.isPasswordMatched(password))) {
    console.log("hallo")
    const {
      firstName,
      lastName,
      email,
      profile_photo: photo,
      gender,
      _id: userId,
    } = userFound;
    const accessToken = jwt.sign(
      {
        firstName,
        lastName,
        email,
        photo,
        userId,
        gender
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );
    const refreshToken = jwt.sign(
      {
        firstName,
        lastName,
        email,
        photo,
        userId,
        gender
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "30d",
      }
    );
    await User.findByIdAndUpdate(userId, { refresh_token: refreshToken });
    res.cookie("token", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    throw new Error("username or password is falsh");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
try {
    const token = req.cookies.token;
    if (!token) throw new Error("not token");
    const user = await User.findOne({ refresh_token: token });
    if (!user) throw new Error("not user");
    user.refresh_token = undefined;
    await user.save();
    res.clearCookie("token");
    res.json("logout success")
} catch (error) {
    res.json(error)
}
});
