const express = require("express");
const router = express.Router();
const ConsultingSession = require("../models/consultingsession");

const checkAuth = require("./authRoutes");
// consulting sessions ---------------------------
// Create a new consulting session
router.post("/create", checkAuth, async (req, res) => {
  try {
    const session = new ConsultingSession({
      consultant: req.body.consultant_id,
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

// Get all consulting sessions
router.get("/all", async (req, res) => {
  try {
    const consultingsessions = await ConsultingSession.find();
    const total = await ConsultingSession.count({});
    res.send({ consultingsessions: consultingsessions, total: total });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/page/:pagenumber", async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pagenumber);
    const limit = Number(req.query.limit) || 10;

    const total = await ConsultingSession.count({});
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
    const consultingsessions = await ConsultingSession.find()
      .skip(startIndex)
      .limit(limit);

    res.send({
      consultingsessions: consultingsessions,
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

// get sessions of a consultant
router.get("/sessionsofconsultant/:consultantid", (req, res) => {
  const consultantId = req.params.consultantid;
  ConsultingSession.find({ consultant: consultantId })
    .then((sessions) => {
      res.json(sessions);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Get a specific consulting session
router.get("/:id", async (req, res) => {
  try {
    const session = await ConsultingSession.findById(req.params.id);
    if (!session) {
      return res.status(404).send("Consulting session not found");
    }
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Update a specific consulting session
router.patch("/:id", checkAuth, async (req, res) => {
  try {
    const session = await ConsultingSession.findByIdAndUpdate(
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
      return res.status(404).send("Consulting session not found");
    }
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a specific consulting session
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const session = await ConsultingSession.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).send("Consulting session not found");
    }
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
