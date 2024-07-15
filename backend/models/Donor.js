import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Donor = sequelize.define("Donor", {
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organDonation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  organs: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Donor;
