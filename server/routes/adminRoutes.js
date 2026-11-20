const express = require("express");
const controller = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(authenticate, authorize("admin"));
router.get("/stats", controller.getStats);
router.get("/complaints", controller.getComplaints);
router.get("/complaints/filter", controller.filterComplaints);
router.get("/complaints/:complaintId", controller.getComplaint);
router.put("/complaints/:complaintId/status", controller.updateStatus);

module.exports = router;
