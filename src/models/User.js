import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class User extends Model {}

User.init(
  {
    username: { type: DataTypes.STRING, allowNull, unique: true },
    email: { type: DataTypes.STRING, allowNull, unique: true },
    password: { type: DataTypes.STRING, allowNull, validate: { min: 6 } },
    profileImage: { type: DataTypes.STRING, defaultValue: "" },
  },
  { sequelize, modelName: "User" },
);
