require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const Complaint = require("../models/Complaint");

const seed = async () => {
  await connectDB();
  for (const model of [Student, Admin, Complaint]) {
    try {
      await model.collection.drop();
    } catch (error) {
      if (error.codeName !== "NamespaceNotFound") throw error;
    }
  }

  await Student.insertMany([
    { studentId: "CSE2024001", studentName: "Aarav Kumar", department: "Computer Science", email: "aarav@student.edu", passwordHash: await bcrypt.hash("student123", 12) },
    { studentId: "ECE2024002", studentName: "Meera Shah", department: "Electronics", email: "meera@student.edu", passwordHash: await bcrypt.hash("student123", 12) },
    { studentId: "CIV2024003", studentName: "Kabir Singh", department: "Civil Engineering", email: "kabir@student.edu", passwordHash: await bcrypt.hash("student123", 12) }
  ]);

  await Admin.create({
    username: "Campus Admin",
    email: "admin@campus.edu",
    passwordHash: await bcrypt.hash("admin123", 12),
    role: "admin"
  });

  const base = Date.now();
  await Complaint.insertMany([
    { complaintId: "SC-20261120-WIFI01", studentId: "CSE2024001", studentName: "Aarav Kumar", department: "Computer Science", category: "Wi-Fi", description: "The Wi-Fi signal in the Computer Science laboratory is unstable and frequently disconnects.", status: "Pending", createdAt: new Date(base - 86400000), updatedAt: new Date(base - 86400000) },
    { complaintId: "SC-20261120-PROJ02", studentId: "ECE2024002", studentName: "Meera Shah", department: "Electronics", category: "Projector", description: "The projector in room E-204 is not displaying a clear image and needs inspection.", status: "In Progress", createdAt: new Date(base - 172800000), updatedAt: new Date(base - 43200000) },
    { complaintId: "SC-20261120-WASH03", studentId: "CIV2024003", studentName: "Kabir Singh", department: "Civil Engineering", category: "Washroom", description: "A water pipeline in the ground-floor washroom is leaking continuously.", status: "Resolved", createdAt: new Date(base - 259200000), updatedAt: new Date(base - 86400000) },
    { complaintId: "SC-20261120-WATER04", studentId: "CSE2024001", studentName: "Aarav Kumar", department: "Computer Science", category: "Drinking Water", description: "The drinking water cooler outside the library is dispensing warm water.", status: "Pending", createdAt: new Date(base - 345600000), updatedAt: new Date(base - 345600000) },
    { complaintId: "SC-20261120-LAB05", studentId: "ECE2024002", studentName: "Meera Shah", department: "Electronics", category: "Laboratory Equipment", description: "One digital oscilloscope in the electronics lab is producing incorrect readings.", status: "In Progress", createdAt: new Date(base - 432000000), updatedAt: new Date(base - 129600000) },
    { complaintId: "SC-20261120-HOST06", studentId: "CIV2024003", studentName: "Kabir Singh", department: "Civil Engineering", category: "Hostel Maintenance", description: "The ceiling fan in hostel room 118 is making a loud noise and is unsafe.", status: "Resolved", createdAt: new Date(base - 518400000), updatedAt: new Date(base - 259200000) }
  ]);

  console.log("Seed complete:");
  console.log("Student: aarav@student.edu / student123");
  console.log("Admin: admin@campus.edu / admin123");
  process.exit(0);
};

seed().catch((error) => { console.error(error); process.exit(1); });
