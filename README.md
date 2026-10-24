# Library Management System

A lab-ready full-stack Library Management System built with React (Vite), Spring Boot, Spring Data JPA, and MySQL.

## Features
- Dashboard summary: total books, available copies, registered members, active loans.
- Books: create, list/search, edit, and delete.
- Members: create, list, edit, and delete.
- Loans: issue an available book to a member and return an active loan.
- Validation and user-facing success/error messages.
- Responsive interface and REST API.
- MySQL persistence.

## Architecture
React UI → `fetch()` REST requests → Spring Boot REST controllers → Spring Data JPA repositories → MySQL.

## Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 20+ and npm
- MySQL 8+

## 1. Create the database
Start MySQL and run:
```sql
CREATE DATABASE library_db;
```

## 2. Configure the backend
Open `backend/src/main/resources/application.properties`. Update `spring.datasource.username` and `spring.datasource.password` for your local MySQL account. The sample uses `root` and `change_me`; do not use these values as real credentials.

## 3. Run Spring Boot
From the project root:
```bash
cd backend
mvn spring-boot:run
```
API base URL: `http://localhost:8080/api`

Tables are created/updated by Hibernate (`ddl-auto=update`) for this educational project.

## 4. Run React
Open a second terminal from the project root:
```bash
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite (normally `http://localhost:5173`).

## REST endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/books` | List/search books (`?search=...` optional) |
| GET | `/api/books/{id}` | Get one book |
| POST | `/api/books` | Create book |
| PUT | `/api/books/{id}` | Update book |
| DELETE | `/api/books/{id}` | Delete book |
| GET | `/api/members` | List members |
| POST | `/api/members` | Create member |
| PUT | `/api/members/{id}` | Update member |
| DELETE | `/api/members/{id}` | Delete member |
| GET | `/api/loans` | List loans |
| POST | `/api/loans` | Issue a book (`bookId`, `memberId`) |
| PUT | `/api/loans/{id}/return` | Return an active loan |

## Notes / limitations
- This is an educational prototype, not a production deployment.
- Authentication/authorization, fine-grained roles, overdue fines, email notifications, pagination, and deployment are not included.
- A book/member with loan history may be protected from deletion by database relationships; return or remove dependent loan records first.
- Test with sample data. Do not commit passwords or secrets to GitHub.
- Capture your own screenshots from the running application; the report has clearly marked screenshot placeholders and does not claim screenshots were captured.

## Suggested GitHub workflow
Create a repository, add this project, and push the source. Include this README and never commit real database passwords.
