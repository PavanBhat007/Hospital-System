// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.ENUM('patient', 'doctor', 'admin'),
        allowNull: false
    }
});

module.exports = User;
