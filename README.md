Expense Tracker
A full-stack personal finance management web application built with React 19 + Spring Boot 3, featuring JWT authentication, budget tracking, analytics dashboard, and CSV export.
Live Demo: expense-tracker-1-y19a.onrender.com  |  Backend: Spring Boot REST API  |  Frontend: React + Vite

Features
FeatureDescriptionJWT AuthenticationStateless auth with BCrypt password hashing, 24-hour token expiryTransaction ManagementAdd, edit, delete income/expense transactions with inline editingCustom Categories7 default categories auto-created on signup + create your ownBudget TrackingSet per-category monthly budgets with SAFE / WARNING / EXCEEDED alertsAnalytics DashboardMonthly income/expense summary + category-wise pie chart breakdownCSV ExportDownload monthly transactions as a CSV filePaginationTransaction list with server-side paginationHistorical ViewBrowse any month/year (2023-2026) independentlyMulti-user IsolationAll data is scoped per user — no data leakage between accounts

Tech Stack
Frontend
TechnologyVersionPurposeReact19.2.0UI frameworkReact Router DOM7.13.0Client-side routing + protected routesAxios1.13.5HTTP client with JWT interceptorRecharts3.7.0Pie chart for category analyticsVite7.3.1Build tool and dev server
Backend
TechnologyVersionPurposeSpring Boot3.5.5REST API frameworkJava17LanguageSpring SecurityBoot-managedAuth filter chainJJWT0.12.6JWT generation and validationSpring Data JPABoot-managedORM layerPostgreSQL—Relational databaseOpenCSV5.9CSV export generationSpringDoc OpenAPI2.8.4Swagger API documentationLombokBoot-managedBoilerplate reduction

Architecture
expense-tracker/
├── expense-tracker-frontend/        # React SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx         # Login / Register
│   │   │   └── Dashboard.jsx        # Main app dashboard
│   │   ├── components/
│   │   │   ├── SummaryCards.jsx     # Income / Expense / Balance cards
│   │   │   ├── TransactionList.jsx  # Paginated list with inline edit
│   │   │   ├── CategoryPieChart.jsx # Recharts donut chart
│   │   │   ├── BudgetSection.jsx    # Budget form + progress bars
│   │   │   └── ProtectedRoute.jsx   # Auth guard HOC
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state (useAuth hook)
│   │   └── services/
│   │       └── api.js               # Axios service layer (all endpoints)
│   └── vercel.json                  # Vercel SPA routing fix
│
└── expense-tracker-backend/         # Spring Boot REST API
    └── src/main/java/com/expensetracker/backend/
        ├── controller/              # AuthController, TransactionController,
        │                            # CategoryController, BudgetController,
        │                            # AnalyticsController, ExportController
        ├── service/                 # Business logic layer
        ├── entity/                  # User, Transaction, Category, Budget
        ├── repository/              # JPA repositories
        ├── security/                # JwtUtil, JwtAuthFilter, SecurityConfig
        └── dto/                     # Request/Response DTOs

API Endpoints
Auth — /api/auth
MethodEndpointDescriptionPOST/registerRegister user, auto-create 7 default categoriesPOST/loginLogin, returns JWT token
Transactions — /api/transactions
MethodEndpointDescriptionPOST/Add a transactionGET/?page=0&size=8Get paginated transactionsPUT/{id}Edit transactionDELETE/{id}Delete transaction
Categories — /api/categories
MethodEndpointDescriptionGET/Get all user categoriesPOST/Create custom category
Budgets — /api/budgets
MethodEndpointDescriptionGET/?month=1&year=2025Get budgets for a monthPOST/Set or update a budgetDELETE/{id}Delete budget
Analytics — /api/analytics
MethodEndpointDescriptionGET/summary?month=1&year=2025Monthly income, expense, balanceGET/categories?month=1&year=2025Category breakdown with percentages
Export — /api/export
MethodEndpointDescriptionGET/csv?month=1&year=2025Download monthly transactions as CSV

Database Schema
users                   transactions
─────────               ────────────────────
id (PK)                 id (PK)
username (unique)       amount
email (unique)          type (INCOME/EXPENSE)
password (bcrypt)       date
                        note
categories              user_id (FK → users)
──────────              category_id (FK → categories)
id (PK)
name                    budgets
user_id (FK → users)    ───────
UNIQUE(name, user_id)   id (PK)
                        limit_amount
                        month, year
                        user_id (FK → users)
                        category_id (FK → categories)
                        UNIQUE(user_id, category_id, month, year)

Getting Started
Prerequisites

Java 17+
Node.js 18+
PostgreSQL 14+

Backend Setup
bash# 1. Create PostgreSQL database
createdb expense_tracker

# 2. Configure credentials in:
#    expense-tracker-backend/src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
spring.datasource.username=your_username
spring.datasource.password=your_password

# 3. Run the Spring Boot application
cd expense-tracker-backend
./mvnw spring-boot:run
# API running at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger-ui.html
Frontend Setup
bashcd expense-tracker-frontend
npm install
npm run dev
# App running at http://localhost:5173

Note: The backend API URL is configured in expense-tracker-frontend/src/services/api.js. Update the baseURL when deploying to production.


Deployment
Frontend (Vercel)

Connect GitHub repo to Vercel
Set Root Directory to expense-tracker-frontend
Framework: Vite | Build: npm run build | Output: dist
The included vercel.json handles React Router client-side routing

Backend
Deploy the Spring Boot JAR to Railway, Render, or Fly.io.
After deployment, update the baseURL in api.js with your backend URL and redeploy the frontend.

Key Implementation Details

Stateless JWT Auth — No server-side sessions; tokens stored in localStorage with automatic injection via Axios interceptor
Budget Alert System — Three-tier alerts: SAFE (< 80%), WARNING (>= 80%), EXCEEDED (>= 100%)
Data Isolation — Every query is filtered by userId; users can never access each other's data
Default Categories — Food, Transport, Shopping, Bills, Entertainment, Health, Other are auto-created at registration
Inline Editing — Transactions are edited in-place without navigating to a separate page
Swagger Docs — Full API documentation available at /swagger-ui.html
INR Currency — All monetary values formatted in Indian Rupees (Rs.)


Built By
Kritika Verma — Full Stack Developer

LinkedIn: linkedin.com/in/kritika-verma-9b38bb244
GitHub: github.com/Kritika29verma
Email: kritikaverma2909@gmail.com


License
MIT