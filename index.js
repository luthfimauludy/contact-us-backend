const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const {
  errorHandler,
  notFoundHandler,
} = require("./server/middlewares/commonHandler");

// Import Routes
const Admin = require("./server/api/admin");
const Auth = require("./server/api/auth");
const UserContact = require("./server/api/user/contacts");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Middlewares
app.use("/api", Auth);
app.use("/api/admin", Admin);
app.use("/api/contacts", UserContact);

app.get("/api", (req, res) => {
  res.send("Hello!");
});

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
