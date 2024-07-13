import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Appointment = sequelize.define("Appointment", {
  patient_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doctor_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  appointment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default Appointment;
