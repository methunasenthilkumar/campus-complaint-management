const Complaint = require("../models/Complaint");

exports.getStats = async (req, res, next) => {
  try {
    const [total, pending, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "In Progress" }),
      Complaint.countDocuments({ status: "Resolved" })
    ]);
    res.json({ stats: { total, pending, inProgress, resolved } });
  } catch (error) { next(error); }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) { next(error); }
};

exports.filterComplaints = async (req, res, next) => {
  try {
    const { complaintId, studentName, department, category, status } = req.query;
    const filter = {};
    if (complaintId) filter.complaintId = new RegExp(complaintId.trim(), "i");
    if (studentName) filter.studentName = new RegExp(studentName.trim(), "i");
    if (department) filter.department = department;
    if (category) filter.category = category;
    if (status) filter.status = status;
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) { next(error); }
};

exports.getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId.trim().toUpperCase() });
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json({ complaint });
  } catch (error) { next(error); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid complaint status" });
    }
    const complaint = await Complaint.findOneAndUpdate(
      { complaintId: req.params.complaintId.trim().toUpperCase() },
      { $set: { status, updatedAt: new Date() } },
      { new: true, runValidators: true }
    );
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json({ message: "Complaint status updated", complaint });
  } catch (error) { next(error); }
};
