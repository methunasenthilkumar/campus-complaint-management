const express = require("express");
const Student = require("../models/Student");
const controller = require("../controllers/studentController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(authenticate, authorize("student"), async (req, res, next) => {
  try {
    req.student = await Student.findById(req.user.id);
    if (!req.student) return res.status(404).json({ message: "Student account not found" });
    next();
  } catch (error) { next(error); }
});

router.post("/", controller.createComplaint);
router.get("/my-complaints", controller.getMyComplaints);
router.get("/track/:complaintId", controller.trackComplaint);

module.exports = router;
