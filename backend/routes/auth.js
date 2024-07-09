const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Patient, Doctor } = require('../models');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { address, role, name, age, gender, bloodGroup, specialty, availability } = req.body;

    try {
        const user = await User.create({ address, role });

        if (role === 'patient') {
            await Patient.create({ name, age, gender, bloodGroup, userId: user.id });
        } else if (role === 'doctor') {
            await Doctor.create({ name, age, gender, specialty, availability, userId: user.id });
        }

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { address } = req.body;

    try {
        const user = await User.findOne({ where: { address } });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
