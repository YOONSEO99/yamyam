const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./lib/db");
const authRoutes = require("./routes/auth");
const lessonRoutes = require("./routes/lesson");
const userRoutes = require("./routes/user");
const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/lessons", lessonRoutes);
app.use("/api/v1/users",userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
