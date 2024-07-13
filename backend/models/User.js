import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organDonor: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  organs: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default User;
