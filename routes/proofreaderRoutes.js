const express = require("express");
const router = express.Router();
const Proofreader = require("../models/proofreader");

const checkAuth = require("./authRoutes");

// proofreaders -------------------
// Create a new proofreader
router.post("/create", checkAuth, async (req, res) => {
  const newProofreader = {
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
    const proofreader = new Proofreader(newProofreader);
    await proofreader.save();
    res.status(201).send(proofreader);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all proofreaders
router.get("/all", async (req, res) => {
  try {
    const proofreaders = await Proofreader.find();
    const totalproofreader = await Proofreader.count({});
    res.send({ proofreaders: proofreaders, total: totalproofreader });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/page/:pagenumber", async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pagenumber);
    const limit = Number(req.query.limit) || 10;

    const total = await Proofreader.count({});
    if (total <= 0) {
      res.status(404).send("No proofreader was found, please create one!");
    }
    const totalPages = Math.ceil(total / limit);
    if (pageNumber < 1) {
      pageNumber = 1;
    } else if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }

    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    const proofreader = await Proofreader.find().skip(startIndex).limit(limit);

    res.send({
      proofreader: proofreader,
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

// Get a specific proofreader
router.get("/:id", async (req, res) => {
  try {
    const proofreader = await Proofreader.findById(req.params.id);

    if (!proofreader) {
      return res.status(404).send("Proofreader not found");
    }
    res.send(proofreader);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a specific proofreader
router.patch("/update/:id", checkAuth, async (req, res) => {
  const newProofreader = {
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
    const proofreader = await Proofreader.findByIdAndUpdate(
      req.params.id,
      newProofreader,
      { new: true }
    );
    if (!proofreader) {
      return res.status(404).send("Proofreader not found");
    }
    res.send(proofreader);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a specific proofreader
router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const proofreader = await Proofreader.findByIdAndDelete(req.params.id);
    if (!proofreader) {
      return res.status(404).send("Proofreader not found");
    }
    res.send(proofreader);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
