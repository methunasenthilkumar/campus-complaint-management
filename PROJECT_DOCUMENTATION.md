# Smart Campus Complaint Management System

## 1. Project Overview
The Smart Campus Complaint Management System is a web-based application that allows students to submit and track campus-related complaints. Administrators can manage complaints and update their status.

## 2. Problem Statement
Traditional complaint handling methods are often time-consuming and difficult to track. This system provides a centralized platform for managing campus complaints.

## 3. Objectives
- Simplify complaint submission.
- Improve complaint tracking.
- Help administrators manage complaints.
- Improve communication between students and administrators.

## 4. Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| Bootstrap 5 | UI Styling |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | Database interaction |
| JWT | Authentication |
| bcryptjs | Password hashing |

## 5. User Roles

### Student
- Register and log in.
- Submit complaints.
- View submitted complaints.
- Track complaint status.

### Admin
- Log in to the admin dashboard.
- View complaints.
- Search and filter complaints.
- Update complaint status.

## 6. Complaint Status
- Pending
- In Progress
- Resolved

## 7. How to Run the Project

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 8. Future Enhancements
- Email notifications.
- Complaint priority management.
- Analytics and reports.
- Real-time status notifications.