Store Rating Platform
A full-stack web application that allows users to submit ratings for registered stores. Built as a company coding challenge submission.

Features
Role-Based Access Control — Admin, Normal User, Store Owner
JWT Authentication — Secure login with token-based auth
Password Security — bcrypt hashing, strong password validation
Store Ratings — Submit and modify ratings (1-5 stars)
Admin Dashboard — Manage users and stores with full CRUD
Store Owner Dashboard — View ratings for owned store
Sorting & Filtering — Backend-side, all listings sortable/filterable
Input Validation — Both frontend and backend validation
Tech Stack
Layer	Technology
Frontend	React.js + Vite
Backend	Node.js + Express.js
ORM	Sequelize
Database	PostgreSQL
Authentication	JWT + bcryptjs
Validation	express-validator
Security	Helmet, CORS
Architecture
store-rating-platform/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Sequelize models + associations
│   │   ├── controllers/    # Request handlers (thin layer)
│   │   ├── services/       # Business logic
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Auth, authorization, error handling
│   │   └── validators/     # express-validator rules
│   └── server.js
└── frontend/
    └── src/
        ├── pages/          # Login, Register, Dashboards
        ├── components/     # Navbar, reusable UI
        ├── context/        # Auth context (React Context API)
        └── services/       # Axios API client
Database Schema
Users
Field	Type	Notes
id	INTEGER	PK, Auto-increment
name	STRING(60)	20-60 chars
email	STRING	Unique
password	STRING	bcrypt hashed
address	STRING(400)	Max 400 chars
role	ENUM	ADMIN / USER / STORE_OWNER
Stores
Field	Type	Notes
id	INTEGER	PK
name	STRING(60)	20-60 chars
email	STRING	Unique
address	STRING(400)	
ownerId	INTEGER	FK → users.id
Ratings
Field	Type	Notes
id	INTEGER	PK
rating	INTEGER	1-5
userId	INTEGER	FK → users.id
storeId	INTEGER	FK → stores.id
Unique constraint: (userId, storeId)
Setup Instructions
Prerequisites
Node.js (v18+)
PostgreSQL (v14+)
npm
1. Clone the repository
git clone <your-repo-url>
cd store-rating-platform
2. Set up the database
# Connect to PostgreSQL and create the database
psql -U postgres
CREATE DATABASE store_rating_db;
\q
3. Configure backend
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
4. Start the backend
npm run dev
# Tables will be created automatically via Sequelize sync
5. Seed demo data
npm run seed
6. Set up and start frontend
cd ../frontend
npm install
npm run dev
Open http://localhost:5173

Environment Variables
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
Demo Credentials
⚠️ For testing only. Change passwords in production.

Role	Email	Password
Admin	admin@storerating.com	Admin@123
Store Owner	owner1@storerating.com	Owner@123
Store Owner	owner2@storerating.com	Owner@123
Normal User	user1@storerating.com	User@1234
Normal User	user2@storerating.com	User@1234
API Endpoints
Authentication
POST   /api/auth/register       Register new user
POST   /api/auth/login          Login (all roles)
PUT    /api/auth/password       Update password (authenticated)
Admin (requires ADMIN role)
GET    /api/admin/dashboard     Stats: total users, stores, ratings
POST   /api/admin/users         Create user (any role)
GET    /api/admin/users         List users (filters + sort)
GET    /api/admin/users/:id     User details (with rating if STORE_OWNER)
POST   /api/admin/stores        Create store
GET    /api/admin/stores        List stores (filters + sort)
Stores (authenticated users)
GET    /api/stores              List stores with user's rating (search + sort)
GET    /api/stores/:id          Store details
POST   /api/stores/:storeId/rating   Submit rating (USER only)
PUT    /api/stores/:storeId/rating   Update rating (USER only)
Store Owner (requires STORE_OWNER role)
GET    /api/store-owner/dashboard   Store info + ratings from customers
Query Parameters (sorting & filtering)
?sortBy=name&order=asc          Sort ascending
?sortBy=email&order=desc        Sort descending
?name=coffee                    Filter by name
?email=owner                    Filter by email
?address=downtown               Filter by address
?role=USER                      Filter by role (admin users endpoint)
Form Validation Rules
Field	Rule
Name	20-60 characters
Email	Valid email format
Address	Max 400 characters
Password	8-16 chars, ≥1 uppercase, ≥1 special char
Rating	Integer 1-5
Security Features
Passwords hashed with bcrypt (salt rounds: 12)
JWT tokens expire in 7 days
Helmet.js for HTTP security headers
CORS restricted to frontend origin
Role-based route protection (backend enforced)
Input validation on all endpoints
Unique constraint prevents duplicate ratings
.env excluded from git
Future Improvements
Email verification on registration
Pagination for large listings
Store image uploads
Rating analytics and charts
Notification system for store owners
Admin user management (edit/delete)
Export data to CSV
