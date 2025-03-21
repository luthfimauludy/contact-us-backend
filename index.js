const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");

// Import Routes
const Auth = require("./server/api/auth");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Middlewares
app.use("/api", Auth);

app.get("/api", (req, res) => {
  res.send("Hello!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
