const express = require("express");
const controller = require("../controllers/authController");
const router = express.Router();

router.post("/student/register", controller.registerStudent);
router.post("/student/login", controller.loginStudent);
router.post("/admin/login", controller.loginAdmin);

module.exports = router;
