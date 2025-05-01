import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcryptjs";

export class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      unique: { msg: "Este usuario ya existe en nuestra base de datos" },
      allowNull: false,
      validate: {
        notEmpty: { msg: "El Usuario es requerido" },
      },
      set(value) {
        this.setDataValue("username", value.trim()); // elimninamos espacios
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Este correo ya existe en nuestra base de datos" },
      validate: {
        notEmpty: { msg: "El Correo es requerido" },
        isEmail: { msg: "El Correo no es un correo valido" },
      },
      set(value) {
        this.setDataValue("email", value.trim().toLowerCase()); // eliminamos espacios y pasamos todo a minusculas
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La contraseña es requerida" },
        len: {
          args: [6],
          msg: "La contraseña debe tener al menos 6 caracteres",
        },
      },
    },
    profileImage: { type: DataTypes.STRING, defaultValue: "" },
  },
  { sequelize, modelName: "User" },
);

User.beforeCreate(async (user, option) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});
