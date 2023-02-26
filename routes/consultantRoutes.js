const express = require("express");
const router = express.Router();
const Consultant = require("../models/consultant");

const checkAuth = require("./authRoutes");
// consultants-----------------------------------
// Create a new consultant
router.post("/create", checkAuth, async (req, res) => {
  if (!req.body) {
    res.send({ message: "Nothing in the req.body" });
  }
  const newConsultant = {
    name: req.body.name,
    email: req.body.email,
    university: req.body.university,
    specialization: req.body.specialization,
    year: req.body.year,
    country: req.body.country,
    image: req.body.img,
    bio: req.body.bio,
  };
  try {
    const consultant = new Consultant(newConsultant);
    await consultant.save();
    res.status(201).send(consultant);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all consultants
router.get("/all", async (req, res) => {
  try {
    const consultants = await Consultant.find();
    const total = await Consultant.count({});
    res.send({ consultants: consultants, total: total });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/page/:pagenumber", async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pagenumber);
    const limit = Number(req.query.limit) || 10;
    const total = await Consultant.count({});
    if (total <= 0) {
      res.status(404).send("No consultant was found, please create one!");
    }
    const totalPages = Math.ceil(total / limit);
    if (pageNumber < 1) {
      pageNumber = 1;
    } else if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }

    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    const consultants = await Consultant.find().skip(startIndex).limit(limit);

    res.send({
      consultants: consultants,
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

// Get a specific consultant
router.get("/:id", async (req, res) => {
  try {
    const consultant = await Consultant.findById(req.params.id);
    if (!consultant) {
      return res.status(404).send("Consultant not found");
    }
    res.send(consultant);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a specific consultant
router.patch("/update/:id", checkAuth, async (req, res) => {
  const newConsultant = {
    name: req.body.name,
    email: req.body.email,
    university: req.body.university,
    specialization: req.body.specialization,
    year: req.body.year,
    country: req.body.country,
    image: req.body.img,
    bio: req.body.bio,
  };
  try {
    const consultant = await Consultant.findByIdAndUpdate(
      req.params.id,
      newConsultant,
      { new: true }
    );
    if (!consultant) {
      return res.status(404).send("Consultant not found");
    }
    res.send(consultant);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a specific consultant
router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const consultant = await Consultant.findByIdAndDelete(req.params.id);
    if (!consultant) {
      return res.status(404).send("Consultant not found");
    }
    res.send(consultant);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
