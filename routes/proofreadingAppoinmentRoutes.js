const express = require("express");
const router = express.Router();
const ProofreadingAppointment = require("../models/proofreadingAppoinment");

const checkAuth = require("./authRoutes");

// proofreading appointment ---------------
// Create a new proofreading appointment
router.post("/create", checkAuth, async (req, res) => {
  try {
    const appointment = new ProofreadingAppointment({
      proofreadingsession: req.body.proofreadingsession_id,
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

// Get all proofreading appointments
router.get("/all", async (req, res) => {
  try {
    const proofreadingAppointments =
      await ProofreadingAppointment.find().populate({
        path: "proofreadingsession",
        populate: {
          path: "proofreader",
          select: "name _id",
        },
      });
    const total = await ProofreadingAppointment.count({});
    res.send({
      proofreadingAppointments: proofreadingAppointments,
      total: total,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific proofreading appointment
router.get("/:id", async (req, res) => {
  try {
    const proofreadingAppointment = await ProofreadingAppointment.findById(
      req.params.id
    ).populate({
      path: "proofreadingsession",
      populate: {
        path: "proofreader",
        select: "name _id",
      },
    });
    if (!proofreadingAppointment) {
      return res.status(404).send("Proofreading appointment not found");
    }
    res.send(proofreadingAppointment);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/page/:pagenumber", async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pagenumber);
    const limit = 10;

    const total = await ProofreadingAppointment.count({});
    const totalPages = Math.ceil(total / limit);
    if (pageNumber < 1) {
      pageNumber = 1;
    } else if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }

    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    const proofreadingAppointments = await ProofreadingAppointment.find()
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: "proofreadingsession",
        populate: {
          path: "proofreader",
          select: "name _id",
        },
      });

    res.send({
      proofreadingAppointments: proofreadingAppointments,
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

// Update a specific proofreading appointment
router.patch("/update/:id", checkAuth, async (req, res) => {
  try {
    const {
      proofreadingsession,
      name,
      email,
      facebook,
      age,
      phone,
      education,
      purpose,
      status,
    } = req.body;
    const proofreadingAppointment =
      await ProofreadingAppointment.findByIdAndUpdate(
        req.params.id,
        {
          proofreadingsession,
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

    if (!proofreadingAppointment) {
      return res.status(404).send("Proofreading appointment not found");
    }

    res.send(proofreadingAppointment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a specific proofreading appointment
router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    let appointment = await ProofreadingAppointment.findByIdAndDelete(
      req.params.id
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Proofreading appointment not found" });
    }
    res.json({ message: "Proofreading appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
