const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true, index: true },
  studentId: { type: String, required: true, index: true },
  studentName: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ["Classroom", "Projector", "Wi-Fi", "Drinking Water", "Laboratory Equipment", "Washroom", "Hostel Maintenance", "Electrical Issues", "Other"]
  },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
  status: { type: String, required: true, default: "Pending", enum: ["Pending", "In Progress", "Resolved"], index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

complaintSchema.pre("save", function(next) {
  if (!this.isNew) this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);
