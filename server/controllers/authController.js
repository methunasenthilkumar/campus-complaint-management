const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

exports.registerStudent = async (req, res, next) => {
  try {
    const { studentName, studentId, department, email, password } = req.body;
    if (!studentName || !studentId || !department || !email || !password) {
      return res.status(400).json({ message: "All registration fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (await Student.findOne({ $or: [{ email: email.toLowerCase() }, { studentId }] })) {
      return res.status(409).json({ message: "A student with this ID or email already exists" });
    }
    const student = await Student.create({
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      department: department.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12)
    });
    const token = signToken({ id: student._id, role: "student", studentId: student.studentId });
    res.status(201).json({ message: "Registration successful", token, user: { name: student.studentName, studentId: student.studentId, department: student.department, email: student.email, role: "student" } });
  } catch (error) { next(error); }
};

exports.loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const student = await Student.findOne({ email: email.trim().toLowerCase() });
    if (!student || !(await bcrypt.compare(password, student.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken({ id: student._id, role: "student", studentId: student.studentId });
    res.json({ message: "Login successful", token, user: { name: student.studentName, studentId: student.studentId, department: student.department, email: student.email, role: "student" } });
  } catch (error) { next(error); }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ message: "Invalid administrator credentials" });
    }
    const token = signToken({ id: admin._id, role: "admin" });
    res.json({ message: "Login successful", token, user: { name: admin.username, email: admin.email, role: "admin" } });
  } catch (error) { next(error); }
};
