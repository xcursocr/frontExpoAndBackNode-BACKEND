import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // get random avatar
    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username.trim()}`;

    const user = await User.create({
      username,
      email,
      password,
      profileImage,
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    next(err); // Lo captura el middleware global
  }
};
