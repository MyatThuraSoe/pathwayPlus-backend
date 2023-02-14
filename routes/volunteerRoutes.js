const express = require("express");
const router = express.Router();

const checkAuth = require("./authRoutes");

//get all API funcationalities
const {
  postVolunteer,
  updateVolunteer,
  getAllVolunteer,
  getSingleVolunteer,
  deleteVolunteer,
  getVolunteerList,
} = require("../controllers/volunteerApi");

router.route("/create").post(checkAuth, postVolunteer);
router.route("/all").get(getAllVolunteer);
router.route("/page/:pagenumber").get(getVolunteerList);

router.route("/:id").get(getSingleVolunteer);
router.route("/update/:id").patch(checkAuth, updateVolunteer);
router.route("/delete/:id").delete(checkAuth, deleteVolunteer);

module.exports = router;
