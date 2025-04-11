const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 2000;
const connectDB = require("./config/connectDB");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const authentication = require("./middleware/auth");

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/API/V1/USER", userRoute);
app.use("/API/V1/POST", authentication, postRoute);

connectDB();

app.listen(PORT, () => {
  console.log(`server is running on Port ${PORT}`);
});
