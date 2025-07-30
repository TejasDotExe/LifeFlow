const express = require("express");
const authMiddelware = require("../middlewares/authMiddelware");
const {
  bloodGroupDetailController,
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/bloodGroup-data", authMiddelware, bloodGroupDetailController);
module.exports = router;
