#  Research Opportunity Portal

A full-stack web application for managing university research opportunities. Faculty members can post, view, update, and manage research openings in one place.

**Course:** Computer Networks (CN)
**Assignment:** Assignment No. 1
**Student:** Muhammad Abdullah khan (24P-0735)

---

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [GitHub Repository](#github-repository)

---

##  Features

### Backend REST API
- Create research opportunities
- Retrieve all opportunities
- Retrieve a single opportunity by ID
- Update existing opportunities
- Delete opportunities
- Change status from Open to Closed (and back)
- Proper HTTP status codes (200, 201, 400, 404, 500)
- Input validation

### Frontend
- Display all opportunities in a clean list
- Create new opportunities via form
- Edit existing opportunities (form auto-fills)
- Toggle status Open ↔ Closed with one click
- Delete opportunities with confirmation
- Success/error messages
- Client-side validation for required fields

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | MySQL / MariaDB (via XAMPP) |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| API Testing | Postman |

### Backend Packages
- `express` — Web framework
- `mysql2` — MySQL driver
- `cors` — Cross-origin request handling
- `dotenv` — Environment variable management
- `nodemon` (dev) — Auto-restart server

---

##  Project Structure

```
research-opportunity-portal/
├── backend/
│   ├── db.js                 # MySQL connection pool
│   ├── server.js             # Express API with 5 routes
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example          # Copy to .env and set password
├── database/
│   └── schema.sql            # Database + table creation SQL
├── frontend/
│   ├── index.html            # UI structure
│   ├── style.css             # Styling
│   └── app.js                # Fetch API integration
├── postman/
│   └── Research-Opportunity-Portal.postman_collection.json
├── .gitignore
└── README.md
```

---

##  Setup Instructions

### Prerequisites

Install these before running:
- [Node.js](https://nodejs.org) (LTS version)
- [XAMPP](https://www.apachefriends.org/) (for MySQL)
- [Postman](https://www.postman.com/downloads/) (for testing)
- A modern web browser (Chrome, Firefox, Edge)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Abdullahp24/research-opportunity-portal.git
cd research-opportunity-portal
```

### Step 2 — Set Up the Database

1. Start **XAMPP Control Panel** → Start **MySQL** (and **Apache**)
2. Open **phpMyAdmin**: http://localhost/phpmyadmin
3. Click the **SQL** tab
4. Copy the contents of `database/schema.sql` and paste into the SQL box
5. Click **Go**
6. The `research_portal` database and `opportunities` table will be created

### Step 3 — Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=research_portal
PORT=5000
```

**Note:** If XAMPP root has a password, add it after `DB_PASSWORD=`.

### Step 4 — Run the Backend Server

```bash
npm run dev
```

You should see:
```
 Connected to MySQL database
 Server running on http://localhost:5000
```

### Step 5 — Run the Frontend

1. In VS Code, right-click `frontend/index.html`
2. Choose **"Open with Live Server"**
3. Browser opens at: `http://127.0.0.1:5500/frontend/index.html`

**Alternative:** Use any static file server:
```bash
npx http-server frontend -p 5500
```

---

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| GET | `/api/opportunities` | Get all opportunities | 200, 500 |
| GET | `/api/opportunities/:id` | Get one opportunity | 200, 404, 500 |
| POST | `/api/opportunities` | Create new opportunity | 201, 400, 500 |
| PUT | `/api/opportunities/:id` | Update opportunity | 200, 400, 404, 500 |
| DELETE | `/api/opportunities/:id` | Delete opportunity | 200, 404, 500 |

### Request Body (POST/PUT)

```json
{
  "title": "AI in Healthcare",
  "description": "Research on ML models for disease detection",
  "research_area": "Artificial Intelligence",
  "required_skills": "Python, TensorFlow",
  "available_positions": 2,
  "application_deadline": "2025-12-31",
  "status": "Open"
}
```

### Required Fields
- `title`
- `description`
- `research_area`

---

##  Testing with Postman

The Postman collection is included at:
```
postman/Research-Opportunity-Portal.postman_collection.json
```

### Import Into Postman

1. Open Postman
2. Click **Import** (top-left)
3. Drag the `.json` file or browse to select it
4. Click **Import**
5. The collection appears in the left sidebar with 9 requests

### Test Scenarios

1. **Create Opportunity #1** — POST with full data
2. **Create Opportunity #2** — POST with different data
3. **Create Opportunity #3** — POST with different data
4. **Get All Opportunities** — GET all
5. **Get One by ID** — GET by ID
6. **Update + Close** — PUT to update + change status to Closed
7. **Validation Error** — POST with missing fields → expect 400
8. **Delete Opportunity** — DELETE by ID
9. **Get Deleted (404)** — GET the deleted ID → expect 404

---

##  GitHub Repository

**Repository URL:** https://github.com/Abdullahp24/research-opportunity-portal

---

##  Notes

- `.env` file is excluded from Git for security (contains DB password)
- `node_modules/` is excluded — run `npm install` after cloning
- The frontend must be served via a local web server (not opened as `file://`) due to CORS restrictions

---

##  Author

**Muhammad Abdullah khan**
Roll no: 24P-0735
Course: Computer Networks
Assignment No. 1