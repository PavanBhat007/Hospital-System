const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sequelize = require("./sequelize");

require('dotenv').config();

const User = require("./models/User");

const PORT = process.env.BACKEND_PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

app.post("/login", async (req, res) => {
  console.log("POST -> /login");
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.send({ token: "LOGIN-SUCCESS", message: "Successful login" });
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
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.send({ token: "SIGNUP-SUCCESS", message: "Successful signup" });
  } catch (error) {
    console.error("Error inserting user into database:", error);
    res
      .status(500)
      .send({ token: "SIGNUP-FAIL", message: "User already exists" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT} ...`));