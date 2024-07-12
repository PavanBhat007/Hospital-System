const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Appointment = sequelize.define('Appointment', {
  patient_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  doctor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  appointment_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = Appointment;
