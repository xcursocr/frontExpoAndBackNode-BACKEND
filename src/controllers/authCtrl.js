import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const register = async (req, res, next) => {
  try {
    console.log("REGISTRANDO");
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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Todos los datos son requeridos" });

    const user = await User.findOne({ where: { email: email } });

    if (!user)
      return res.status(400).json({ message: "Credenciales invalidas" });

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword)
      return res.status(400).json({ message: "Credenciales invalidas" });

    const token = generateToken(user.id);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    next(err);
  }
};
