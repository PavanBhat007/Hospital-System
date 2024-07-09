const sequelize = require('../config');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

User.hasOne(Patient, { foreignKey: 'userId' });
User.hasOne(Doctor, { foreignKey: 'userId' });

sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
});

module.exports = {
    User,
    Patient,
    Doctor
};
