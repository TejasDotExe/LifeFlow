const express = require("express");
const {
  getDonarList,
  getHospitalList,
  getOrganisationList,
  deleteUser,
} = require("../controllers/adminController");
const adminMiddelware = require("../middlewares/adminMiddelware");
const authMiddelware = require("../middlewares/authMiddelware");

const router = express.Router();


router.get("/donar-list", authMiddelware, adminMiddelware, getDonarList);
router.get("/hospital-list", authMiddelware, adminMiddelware, getHospitalList);
router.get(
  "/organisation-list",
  authMiddelware,
  adminMiddelware,
  getOrganisationList
);

router.delete("/delete-user/:id", authMiddelware, adminMiddelware, deleteUser);

module.exports = router;
