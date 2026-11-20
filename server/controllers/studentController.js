const Complaint = require("../models/Complaint");

const createComplaintId = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SC-${date}-${random}`;
};

exports.createComplaint = async (req, res, next) => {
  try {
    const { category, description } = req.body;
    if (!category || !description) return res.status(400).json({ message: "Category and description are required" });
    if (description.trim().length < 10) return res.status(400).json({ message: "Description must be at least 10 characters" });

    const student = req.student;
    let complaintId;
    let complaint;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      complaintId = createComplaintId();
      try {
        complaint = await Complaint.create({
          complaintId,
          studentId: student.studentId,
          studentName: student.studentName,
          department: student.department,
          category,
          description: description.trim()
        });
        break;
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
    }
    if (!complaint) return res.status(500).json({ message: "Could not generate a unique complaint ID" });
    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) { next(error); }
};

exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ studentId: req.student.studentId }).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) { next(error); }
};

exports.trackComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId.trim().toUpperCase(),
      studentId: req.student.studentId
    });
    if (!complaint) return res.status(404).json({ message: "Complaint not found or not owned by this student" });
    res.json({ complaint });
  } catch (error) { next(error); }
};
