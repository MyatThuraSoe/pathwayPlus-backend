const express = require("express");
const router = express.Router();
const Event = require("../models/event");

const checkAuth = require("./authRoutes");

// events route ----------------------------
router.post("/create", checkAuth, async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "Failed to create event",
      error: "No data in the req.body",
    });
  }

  try {
    const newEvent = new Event({
      image: req.body.img,
      name: req.body.name,
      organizer: req.body.organizer,
      date: req.body.date, // change property name
      time: req.body.time,
      location: req.body.location,
      description: req.body.description,
      venue: req.body.venue, // add venue property
      registerlink: req.body.registerlink,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to create event", error: err });
  }
});

router.get("/all", async (req, res) => {
  try {
    const events = await Event.find({});
    const total = await Event.count({});
    res.json({ events: events, total: total });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err });
  }
});
router.get("/page/:pagenumber", async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pagenumber);
    const limit = Number(req.query.limit) || 10;

    const total = await Event.count({});
    if (total <= 0) {
      res.status(404).send("No event right now, please create one.");
    }
    const totalPages = Math.ceil(total / limit);
    if (pageNumber < 1) {
      pageNumber = 1;
    } else if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }

    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    const events = await Event.find().skip(startIndex).limit(limit);

    res.send({
      events: events,
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

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(404).json({ message: "Event not found", error: err });
  }
});

router.patch("/update/:id", checkAuth, async (req, res) => {
  const newevent = {
    image: req.body.img,
    name: req.body.name,
    organizer: req.body.organizer,
    date: req.body.date, // change property name
    time: req.body.time,
    location: req.body.location,
    description: req.body.description,
    venue: req.body.venue, // add venue property
    registerlink: req.body.registerlink,
  };
  try {
    await Event.findByIdAndUpdate(req.params.id, newevent);
    res.status(200).json({ message: "Event updated successfully" });
  } catch (err) {
    res.status(404).json({ message: "Event not found", error: err });
  }
});

router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: "Event not found", error: err });
  }
});

module.exports = router;
