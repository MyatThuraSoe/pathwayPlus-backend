const express = require("express");
const router = express.Router();
const ConsultingAppointment = require("../models/consultantAppoinment");

const checkAuth = require("./authRoutes");

// consulting appoinment ----------------------
// Create a new consulting appointment
router.post("/create", checkAuth, async (req, res) => {
  try {
    const appointment = new ConsultingAppointment({
      consultingsession: req.body.consultingsession_id,
      name: req.body.name,
      email: req.body.email,
      facebook: req.body.facebook,
      age: req.body.age,
      phone: req.body.phone,
      education: req.body.education,
      purpose: req.body.purpose,
      status: req.body.status,
    });
    await appointment.save();
    res.status(201).send(appointment);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all consulting appoinments
router.get("/all", async (req, res) => {
  try {
    const consultingAppointments = await ConsultingAppointment.find().populate({
      path: "consultingsession",
      populate: {
        path: "consultant",
        select: "name _id",
      },
    });

    const total = await ConsultingAppointment.count({});
    res.json({ consultingAppointments: consultingAppointments, total: total });
  } catch (error) {
    res.status(500).send(error);
  }
});

// get single consulting appoinment
// here is response object
// {
//   "_id": "34375836437384",
//   "consultingsession": {
//     "_id": "7458345337384",
//     "consultant": {
//       "_id": "375836437384644",
//       "name": "Consultant Name"
//     },
//     "available": true,
//     "date": "2022-01-01T00:00:00.000Z",
//     "start_time": "10:00",
//     "end_time": "12:00",
//     "createdAt": "2022-01-01T00:00:00.000Z",
//     "updatedAt": "2022-01-01T00:00:00.000Z"
//   },
//   "name": "Client Name",
//   "email": "client@email.com",
//   "facebook": "facebook_link",
//   "age": "20",
//   "phone": "1234567890",
//   "education": "Undergraduate",
//   "purpose": "Career Counseling",
//   "status": "Completed",
//   "createdAt": "2022-01-01T00:00:00.000Z",
//   "updatedAt": "2022-01-01T00:00:00.000Z"
// }
router.get("/:id", async (req, res) => {
  try {
    const consultingAppointment = await ConsultingAppointment.findById(
      req.params.id
    ).populate({
      path: "consultingsession",
      populate: {
        path: "consultant",
        select: "name _id",
      },
    });
    if (!consultingAppointment) {
      return res.status(404).send("Consulting appointment not found");
    }
    consultingAppointment = {
      ...consultingAppointment,
      consultantname: consultingsession.consultant.name,
    };
    res.json(consultingAppointment);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/page/:pagenumber", async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pagenumber);
    const limit = 10;

    const total = await ConsultingAppointment.count({});
    const totalPages = Math.ceil(total / limit);
    if (pageNumber < 1) {
      pageNumber = 1;
    } else if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }

    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    const consultingAppointments = await ConsultingAppointment.find()
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: "consultingsession",
        populate: {
          path: "consultant",
          select: "name _id",
        },
      });

    res.send({
      consultingAppointments: consultingAppointments,
      currentPage: pageNumber,
      total: total,
      totalPages: totalPages,
      hasNextPage: endIndex < total,
      hasPreviousPage: startIndex > 0,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// update consulting appoinment
router.patch("/:id", checkAuth, async (req, res) => {
  try {
    const {
      consultingsession,
      name,
      email,
      facebook,
      age,
      phone,
      education,
      purpose,
      status,
    } = req.body;

    const consultingAppointment = await ConsultingAppointment.findByIdAndUpdate(
      req.params.id,
      {
        consultingsession,
        name,
        email,
        facebook,
        age,
        phone,
        education,
        purpose,
        status,
      },
      { new: true }
    );

    if (!consultingAppointment) {
      return res.status(404).send("Consulting appointment not found");
    }

    res.send(consultingAppointment);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    let appointment = await ConsultingAppointment.findByIdAndDelete(
      req.params.id
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Consulting appointment not found" });
    }
    res.json({ message: "Consulting appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
