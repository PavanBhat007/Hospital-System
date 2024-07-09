const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config');
const abi = require('./abi');

const { Web3 } = require('web3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

const infuraUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

// Ensure the connection is working
web3.eth.net.isListening()
    .then(() => console.log('Web3 connection established'))
    .catch(error => console.error('Error connecting to Web3:', error));

const contractABI = abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

app.post('/signup', async (req, res) => {
    const { address, password, role, name, age, gender, bloodGroup, specialty, availability } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await pool.query('INSERT INTO users (address, role, password) VALUES ($1, $2, $3) RETURNING id', [address, role, hashedPassword]);
        const userId = userResult.rows[0].id;

        if (role === 'patient') {
            await contract.methods.addPatient(address, name, age, gender, bloodGroup).send({ from: process.env.CONTRACT_OWNER_ADDRESS });
        } else if (role === 'doctor') {
            await pool.query('INSERT INTO doctors (user_id, name, age, gender, specialty, availability) VALUES ($1, $2, $3, $4, $5, $6)', [userId, name, age, gender, specialty, availability]);
            await contract.methods.addDoctor(address, name, age, gender, specialty, availability).send({ from: process.env.CONTRACT_OWNER_ADDRESS });
        }

        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
});

app.post('/login', async (req, res) => {
    const { address, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE address = $1', [address]);
        const user = userResult.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user.id, address: user.address, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied');
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

// Patient routes
app.get('/patient/profile', authenticateToken, async (req, res) => {
    if (req.user.role !== 'patient') return res.status(403).send('Access denied');

    try {
        const patient = await contract.methods.getPatient(req.user.address).call();
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).send('Error fetching patient profile');
    }
});

app.post('/patient/updateProfile', authenticateToken, async (req, res) => {
    if (req.user.role !== 'patient') return res.status(403).send('Access denied');

    const { name, age, gender, bloodGroup } = req.body;

    try {
        await contract.methods.addPatient(req.user.address, name, age, gender, bloodGroup).send({ from: process.env.CONTRACT_OWNER_ADDRESS });
        res.status(200).send('Profile updated');
    } catch (error) {
        res.status(500).send('Error updating profile');
    }
});

app.get('/patient/appointments', authenticateToken, async (req, res) => {
    if (req.user.role !== 'patient') return res.status(403).send('Access denied');

    try {
        const appointments = await contract.methods.getPatient(req.user.address).call();
        res.status(200).json(appointments[5]); // appointments are stored in the 5th index
    } catch (error) {
        res.status(500).send('Error fetching appointments');
    }
});

app.post('/patient/bookAppointment', authenticateToken, async (req, res) => {
    if (req.user.role !== 'patient') return res.status(403).send('Access denied');

    const { doctorAddress, details } = req.body;

    try {
        await contract.methods.addAppointment(req.user.address, doctorAddress, details).send({ from: process.env.CONTRACT_OWNER_ADDRESS });
        res.status(200).send('Appointment booked');
    } catch (error) {
        res.status(500).send('Error booking appointment');
    }
});

app.delete('/patient/appointments/:index', authenticateToken, async (req, res) => {
    if (req.user.role !== 'patient') return res.status(403).send('Access denied');

    const { doctorAddress, index } = req.body;

    try {
        await contract.methods.removeAppointment(req.user.address, doctorAddress, index).send({ from: process.env.CONTRACT_OWNER_ADDRESS });
        res.status(200).send('Appointment deleted');
    } catch (error) {
        res.status(500).send('Error deleting appointment');
    }
});

// Doctor routes
app.get('/doctor/profile', authenticateToken, async (req, res) => {
    if (req.user.role !== 'doctor') return res.status(403).send('Access denied');

    try {
        const doctor = await contract.methods.getDoctor(req.user.address).call();
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).send('Error fetching doctor profile');
    }
});

app.post('/doctor/updateProfile', authenticateToken, async (req, res) => {
    if (req.user.role !== 'doctor') return res.status(403).send('Access denied');

    const { name, age, gender, specialty, availability } = req.body;

    try {
        await contract.methods.addDoctor(req.user.address, name, age, gender, specialty, availability).send({ from: process.env.CONTRACT_OWNER_ADDRESS });
        res.status(200).send('Profile updated');
    } catch (error) {
        res.status(500).send('Error updating profile');
    }
});

app.get('/doctor/appointments', authenticateToken, async (req, res) => {
    if (req.user.role !== 'doctor') return res.status(403).send('Access denied');

    try {
        const appointments = await contract.methods.getDoctor(req.user.address).call();
        res.status(200).json(appointments[5]); // appointments are stored in the 5th index
    } catch (error) {
        res.status(500).send('Error fetching appointments');
    }
});

// Admin routes
app.get('/admin/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied');

    try {
        const users = await pool.query('SELECT * FROM users');
        res.status(200).json(users.rows);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});