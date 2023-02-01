const authRouter = require("./authRoutes");
const consultantRouter = require("./consultantRoutes");
const consultingAppoinmentRouter = require("./consultingAppoinmentRoutes");
const consultingsessionRouter = require("./consultingsessionRoutes");
const eventRouter = require("./eventRoutes");
const proofreaderRouter = require("./proofreaderRoutes");
const proofreadingAppoinmentRouter = require("./proofreadingAppoinmentRoutes");
const proofreadingsession = require("./proofreadingsessionRoutes");
const userRouter = require("./userRoutes");
const vacancyRouter = require("./vacancyRoutes");
const volunteerRouter = require("./volunteerRoutes");

const express = require("express");
const publicRouter = express();

publicRouter.use("/consultants", consultantRouter);
publicRouter.use("/consultingappoinments", consultingAppoinmentRouter);
publicRouter.use("/consultingsessions", consultingsessionRouter);
publicRouter.use("/events", eventRouter);
publicRouter.use("/proofreaders", proofreaderRouter);
publicRouter.use("/proofreadingappoinments", proofreadingAppoinmentRouter);
publicRouter.use("/proofreadingsessions", proofreadingsession);
publicRouter.use("/users", userRouter);
publicRouter.use("/vacancies", vacancyRouter);
publicRouter.use("/volunteers", volunteerRouter);

module.exports = publicRouter;
