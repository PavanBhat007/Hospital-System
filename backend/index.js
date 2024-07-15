import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import sequelize from "./sequelize.js";
import { Op } from 'sequelize';
import dotenv from "dotenv";
import multer from "multer";

import User from "./models/User.js";
import Appointment from "./models/Appointment.js";
import Donor from "./models/Donor.js";

dotenv.config();

const PORT = process.env.BACKEND_PORT || 4000;
const FLASK_URL = process.env.FLASK_URL;

const app = express();

app.use(cors());
app.use(express.json());

sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // File name
  }
});
const upload = multer({ storage });

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

    res.json(med_data);
  } catch {
    res.json({ messaage: "FAIL" });
  }
});

app.get("/donors", async (req, res) => {
  console.log("GET -> /donors");

  try {
    const donors = await Donor.findAll();
    const donorWithUserDetails = await Promise.all(
      donors.map(async (donor) => {
        const user = await User.findOne({ where: { id: donor.user_id } });
        donor.dataValues.username = user.username;
        donor.dataValues.email = user.email;
        return donor;
      })
    );

    console.log(donorWithUserDetails);
    res.send(donorWithUserDetails);
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).send({ message: "Failed to fetch donors" });
  }
});

app.get("/filter-by-organs", async (req, res) => {
  const organs = req.query["organs"];
  try {
    const donors = await Donor.findAll({
      where: {
        organs: {
          [Op.like]: `%${organs}%`,
        },
      },
    });
    res.send(donors);
  } catch (error) {
    console.error("Error searching donors:", error);
    res.status(500).send({ message: "Failed to search donors" });
  }
});

app.post("/new-donor", async (req, res) => {
  const { user_id, bloodType, organDonation, organs } = req.body;
  console.log(req.body);
  try {
    const newDonor = await Donor.create({
      user_id,
      bloodType,
      organDonation,
      organs,
    });
    res.status(201).send(newDonor);
  } catch (error) {
    console.error("Error creating donor:", error);
    res.status(500).send({ message: "Failed to create donor" });
  }
});

app.post("/update-donor", async (req, res) => {
  const { id, bloodType, organDonation, organs } = req.body;
  try {
    const donor = await Donor.findOne({ where: { user_id: id } });
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    donor.bloodType = bloodType;
    donor.organDonation = organDonation;
    donor.organs = organs;
    await donor.save();
    res.send(donor);
  } catch (error) {
    console.error("Error updating donor:", error);
    res.status(500).send({ message: "Failed to update donor" });
  }
});

app.post("/query", async (req, res) => {
  const { query } = req.body;
  console.log("POST -> /ask-ai " + query);
  const response = await fetch(`http://192.168.43.122:5000/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  }).then((data) => data.json());
  console.log(response);
  res.send(response);
});

app.get("/prescription", upload.single("file"), async (req, res) => {
  console.log("GET -> /prescription");
  
  try {
    console.log("Fetching...")
    const response = await fetch("http://192.168.43.122:5000/ocr", {
      method: "GET",
    });
    console.log("Done")
    res.send(response);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send({ message: "Internal error" });
  }
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT} ...`));
