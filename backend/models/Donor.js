import { DataTypes } from "sequelize";
import sequelize from "../sequelize";

const Donor = sequelize.define("Donor", {
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
