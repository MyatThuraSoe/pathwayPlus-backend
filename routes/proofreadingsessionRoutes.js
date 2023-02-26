const express = require("express");
const router = express.Router();
const ProofreadingSession = require("../models/proofreadingsession");

const checkAuth = require("./authRoutes");

// proofreading sessions ---------------------------
// Create a new proofreading session
router.post("/create", checkAuth, async (req, res) => {
  try {
    const session = new ProofreadingSession({
      proofreader: req.body.proofreader_id,
      available: req.body.available,
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    });
    await session.save();
    res.status(201).send(session);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all proofreading sessions
router.get("/all", async (req, res) => {
  try {
    const sessions = await ProofreadingSession.find();
    const total = await ProofreadingSession.count({});
    res.send({
      proofreadingSession: sessions,
      total: total,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/page/:pagenumber", async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pagenumber);
    const limit = Number(req.query.limit) || 10;
    const total = await ProofreadingSession.count({});
    if (total <= 0) {
      res.status(404).send("No session was found, please create one!");
    }
    const totalPages = Math.ceil(total / limit);
    if (pageNumber < 1) {
      pageNumber = 1;
    } else if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }

    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    const proofreadingSession = await ProofreadingSession.find()
      .skip(startIndex)
      .limit(limit);

    res.send({
      proofreadingSession: proofreadingSession,
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

// Get a specific proofreading session

router.get("/:id", async (req, res) => {
  try {
    const session = await ProofreadingSession.findById(req.params.id);
    if (!session) {
      return res.status(404).send("Proofreading session not found");
    }
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get sessions of a proofreader
router.get("/sessionsofproofreader/:proofreaderid", (req, res) => {
  const proofreaderid = req.params.proofreaderid;
  ProofreadingSession.find({ proofreader: proofreaderid })
    .then((sessions) => {
      res.json(sessions);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Update a specific proofreading session
router.patch("/:id", checkAuth, async (req, res) => {
  try {
    const session = await ProofreadingSession.findByIdAndUpdate(
      req.params.id,
      {
        available: req.body.available,
        date: req.body.date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
      },
      { new: true }
    );
    if (!session) {
      return res.status(404).send("Proofreading session not found");
    }
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a specific proofreading session
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const session = await ProofreadingSession.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).send("Proofreading session not found");
    }
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
