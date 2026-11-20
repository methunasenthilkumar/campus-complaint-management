# Smart Campus Complaint Management System

A responsive MERN-stack application for submitting, tracking, filtering, and resolving campus complaints.

## Features

- Student registration and JWT login
- Secure complaint submission with unique IDs
- Student-only complaint history and tracking
- Administrator dashboard with live statistics
- Search and filters for complaint ID, student name, department, category, and status
- Complaint detail view and status updates
- MongoDB persistence and bcrypt password hashing

## Prerequisites

- Windows 10 or 11
- Node.js 18 or newer
- npm
- A free MongoDB Atlas account

Verify Node and npm:

```powershell
node --version
npm --version
```

## Create and Configure MongoDB Atlas

1. Create a free account at https://www.mongodb.com/atlas/database.
2. Create a free **M0** cluster.
3. In **Database Access**, create a database user and remember the username and password.
4. In **Network Access**, allow access from `0.0.0.0/0` for local development.
5. Open **Database > Connect > Drivers** and copy the connection string.
6. The database name must be `smart_campus_db`.

Example URI format:

```text
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/smart_campus_db?retryWrites=true&w=majority
```

From PowerShell, create the server environment file:

```powershell
cd C:\Users\methu\Downloads\techpp
Copy-Item server\.env.example server\.env
notepad server\.env
```

Set `MONGODB_URI` to the Atlas URI and replace `JWT_SECRET` with a long random value. The example file contains no working database credentials.

## Install and Run

Open PowerShell in the project folder.

### Backend

```powershell
cd C:\Users\methu\Downloads\techpp\server
npm install
npm run seed
npm run dev
```

Keep this terminal running. The API will be available at `http://localhost:5000`.

### Frontend

Open a second PowerShell terminal:

```powershell
cd C:\Users\methu\Downloads\techpp\client
npm install
npm run dev
```

Open `http://localhost:5173`.

The frontend uses `http://localhost:5000/api` by default. To use another API URL, create `client/.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

## Demo Accounts

After running the seed script:

| Role | Email | Password |
|---|---|---|
| Student | aarav@student.edu | student123 |
| Administrator | admin@campus.edu | admin123 |

The seed script also creates realistic Wi-Fi, projector, washroom, water, laboratory, and hostel complaints.

## Student Demonstration

1. Open `http://localhost:5173/student/login`.
2. Sign in as `aarav@student.edu` with `student123`.
3. Select **Wi-Fi** and describe a campus issue.
4. Submit the complaint and copy the generated complaint ID.
5. Locate the complaint in **My complaints**, or search with the complaint ID.
6. The status updates when an administrator changes it.

## Administrator Demonstration

1. Open `http://localhost:5173/admin/login`.
2. Sign in as `admin@campus.edu` with `admin123`.
3. Review the four statistics cards.
4. Use complaint, student, department, category, and status filters.
5. Select **View**, open complaint details, and change the status.
6. Refresh the student dashboard to confirm the same database record has the updated status.

## API Endpoints

- `POST /api/auth/student/register`
- `POST /api/auth/student/login`
- `POST /api/auth/admin/login`
- `POST /api/complaints`
- `GET /api/complaints/my-complaints`
- `GET /api/complaints/track/:complaintId`
- `GET /api/admin/stats`
- `GET /api/admin/complaints`
- `GET /api/admin/complaints/filter`
- `GET /api/admin/complaints/:complaintId`
- `PUT /api/admin/complaints/:complaintId/status`

## Re-seeding

Running the seed script replaces application seed collections. It is intended for development and demonstration:

```powershell
cd C:\Users\methu\Downloads\techpp\server
npm run seed
```
