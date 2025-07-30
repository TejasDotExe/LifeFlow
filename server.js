const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB()
  .then(() => {})
  .catch(() => {});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/test", require("./routes/testRouts"));

app.use("/api/v1/auth", require("./routes/authRoutes"));

app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));

app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));

app.use("/api/v1/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Node server is running In ${process.env.DEV_MODE} Mode on ${process.env.PORT} port`
      .bgBlue.white
  );
});