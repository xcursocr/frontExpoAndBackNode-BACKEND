import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcryptjs";

export class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      unique: { msg: "El campo 'username' tiene que ser unico" },
      allowNull: false,
      validate: {
        notEmpty: { msg: "El campo 'username' es obligatorio " },
      },
      set(value) {
        this.setDataValue("username", value.trim()); // elimninamos espacios
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "El campo 'email' tiene que ser unico" },
      validate: {
        notEmpty: { msg: "El campo 'email' es obligatorio " },
        isEmail: { msg: "El correo tiene no es valido" },
      },
      set(value) {
        this.setDataValue("email", value.trim().toLowerCase()); // eliminamos espacios y pasamos todo a minusculas
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
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
