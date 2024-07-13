import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import sequelize from "./sequelize.js";
import dotenv from "dotenv";

import User from "./models/User.js";
import Appointment from "./models/Appointment.js";

dotenv.config();

const PORT = process.env.BACKEND_PORT || 5000;
const FLASK_URL = process.env.FLASK_URL;

const app = express();

app.use(cors());
app.use(express.json());

sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

app.post("/login", async (req, res) => {
  console.log("POST -> /login");
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.send({
          token: "LOGIN-SUCCESS",
          message: "Successful login",
          user_data: user,
        });
      } else {
        res.send({ token: "LOGIN-FAIL", message: "Passwords don't match" });
      }
    } else {
      res.send({ token: "LOGIN-FAIL", message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user from database:", error);
    res.status(500).send({ token: "LOGIN-FAIL", message: "Internal error" });
  }
});

app.post("/signup", async (req, res) => {
  console.log("POST -> /signup");
  let { username, email, password, dob, gender, role, specialty } = req.body;
  role = role.toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
      dob,
      gender,
      role,
      specialty,
    });

    res.send({
      token: "SIGNUP-SUCCESS",
      message: "Successful signup",
    });
  } catch (error) {
    console.error("Error inserting user into database:", error);
    res
      .status(500)
      .send({ token: "SIGNUP-FAIL", message: "User already exists" });
  }
});

app.get("/profile", async (req, res) => {
  console.log("GET -> /profile");
  const { user_id } = req.query;

  try {
    const user = await User.findOne({ where: { id: user_id } });

    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile from database:", error);
    res.status(500).send({ message: "Internal error" });
  }
});

app.post("/appointment", async (req, res) => {
  console.log("POST -> /appointment");
  const { user_id, doctor_id, appointment_date } = req.body;

  const patient_name = await User.findOne({ where: { id: user_id } }).then(
    (data) => data.username
  );
  const doctor_name = await User.findOne({ where: { id: doctor_id } }).then(
    (data) => data.username
  );

  try {
    const appointment = await Appointment.create({
      patient_name,
      doctor_name,
      appointment_date,
    });
    res.send({ message: "Appointment created successfully", appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).send({ message: "Internal error" });
  }
});

app.get("/appointments", async (req, res) => {
  console.log("GET -> /appointments");
  const { user_id, role } = req.query;

  const username = await User.findOne({ where: { id: user_id } }).then(
    (data) => data.username
  );
  let appointments = null;

  try {
    if (role === "user")
      appointments = await Appointment.findAll({
        where: { patient_name: username },
      });
    else
      appointments = await Appointment.findAll({
        where: { doctor_name: username },
      });

    res.send(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send({ message: "Internal error" });
  }
});

app.get("/doctors", async (req, res) => {
  console.log("GET -> /doctors");

  try {
    const doctors = await User.findAll({ where: { role: "doctor" } });
    res.send(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send({ message: "Internal error" });
  }
});

app.get("/know-your-med", async (req, res) => {
  const med_name = req.query["med"];

  console.log(`GET -> /know-your-med | query [${med_name}]`);
  console.log(`Fetching data from: ${FLASK_URL}/med`);

  try {
    const med_data = await fetch(`${FLASK_URL}/med`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(med_name),
    }).then((data) => data.json());

    console.log(med_data);
    res.json(med_data);
  } catch {
    console.log("FAIL");
    res.json({"messaage": "FAIL"});
  }
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT} ...`));
