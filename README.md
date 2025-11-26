# Library Management System API

A RESTful API for library management system built with Node.js, Express, and Prisma ORM. This system allows managing books, members, and borrowing transactions with comprehensive business logic validation.

## Tech Stack

- **Node.js**: v24.11.1
- **Express.js**: v4.18.2
- **Prisma ORM**: v7.0.1
- **PostgreSQL**: Database
- **@prisma/adapter-pg**: v7.0.1 (Prisma 7 adapter)
- **pg**: v8.16.3 (PostgreSQL driver)
- **dotenv**: v16.3.1 (Environment configuration)

---

## Project Setup Instructions

### Prerequisites

- Node.js v24.0.0 or higher
- PostgreSQL database server
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone <repository-url>
cd test_be_PT.SGT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/db_name?schema=public"
PORT=3000
```

Replace `username`, `password`, and database connection details with your PostgreSQL credentials.

### 4. Database Setup

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev
```

This will create the following tables:

- `books` - Store book information
- `members` - Store member information
- `borrowings` - Store borrowing transactions

### 5. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This will create:

- 20 sample books
- 20 sample members
- 20 sample borrowing records

### 6. Start the Server

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The server will run on `http://localhost:3000`

### 7. Verify Installation

Test the API:

```bash
curl http://localhost:3000/api/books
```

---

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Response Format

All responses follow this structure:

**Success Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Endpoints

### 1. Books

#### Get All Books

```http
GET /api/books
```

**Query Parameters:**

- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of items per page
- `title` (optional) - Filter by book title (case-insensitive, partial match)
- `author` (optional) - Filter by author name (case-insensitive, partial match)

**Example Request:**

```bash
# Get all books with default pagination
curl http://localhost:3000/api/books

# Search books by title
curl http://localhost:3000/api/books?title=harry

# Search books by author
curl http://localhost:3000/api/books?author=rowling
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "Harry Potter and the Philosopher's Stone",
        "author": "J.K. Rowling",
        "publishedYear": 1997,
        "stock": 5,
        "isbn": "978-0439708180",
        "available": true
      }
    ],
    "pagination": {
      "total": 20,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

---

### 2. Members

#### Create a New Member

```http
POST /api/members
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "081234567890",
  "address": "Jl. Example No. 123, Jakarta"
}
```

**Validation Rules:**

- All fields are required
- `email` must be a valid email format
- `email` must be unique
- `phone` must be a valid phone number format

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "081234567890",
    "address": "Jl. Example No. 123, Jakarta"
  }'
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "081234567890",
    "address": "Jl. Example No. 123, Jakarta"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Email already exists"
}
```

#### Get Member's Borrowing History

```http
GET /api/members/:id/borrowings
```

**Path Parameters:**

- `id` (required) - Member UUID

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `status` (optional) - Filter by status: `BORROWED` or `RETURNED`

**Example Request:**

```bash
# Get all borrowings
curl http://localhost:3000/api/members/{member-id}/borrowings

# Get active borrowings only
curl http://localhost:3000/api/members/{member-id}/borrowings?status=BORROWED

```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "borrowDate": "2024-11-26T10:30:00.000Z",
        "returnDate": null,
        "status": "BORROWED",
        "book": {
          "id": "uuid",
          "title": "Harry Potter and the Philosopher's Stone",
          "author": "J.K. Rowling",
          "isbn": "978-0439708180"
        }
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### 3. Borrowings

#### Create a New Borrowing

```http
POST /api/borrowings
```

**Request Body (Single Book):**

```json
{
  "member_id": "uuid",
  "book_id": "uuid"
}
```

**Request Body (Multiple Books):**

```json
{
  "member_id": "uuid",
  "book_id": ["uuid1", "uuid2", "uuid3"]
}
```

**Business Rules:**

- Member can borrow maximum 3 books at a time
- Book must have stock available (stock > 0)
- Member must exist in the system
- Book(s) must exist in the system

**Example Request:**

```bash
# Borrow single book
curl -X POST http://localhost:3000/api/borrowings \
  -H "Content-Type: application/json" \
  -d '{
    "member_id": "member-uuid",
    "book_id": "book-uuid"
  }'

# Borrow multiple books
curl -X POST http://localhost:3000/api/borrowings \
  -H "Content-Type: application/json" \
  -d '{
    "member_id": "member-uuid",
    "book_id": ["book-uuid-1", "book-uuid-2"]
  }'
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "borrowings": [
      {
        "id": "uuid",
        "bookId": "uuid",
        "memberId": "uuid",
        "borrowDate": "2024-11-26T10:30:00.000Z",
        "returnDate": null,
        "status": "BORROWED"
      }
    ],
    "message": "Successfully borrowed 1 book(s)"
  }
}
```

**Error Responses (400):**

```json
{
  "success": false,
  "error": "Member not found"
}
```

```json
{
  "success": false,
  "error": "Member already has 3 active borrowings. Maximum limit reached."
}
```

```json
{
  "success": false,
  "error": "Cannot borrow more than 3 books at once"
}
```

```json
{
  "success": false,
  "error": "Book 'Book Title' is currently out of stock"
}
```

#### Return a Borrowed Book

```http
PUT /api/borrowings/:id/return
```

**Path Parameters:**

- `id` (required) - Borrowing UUID

**Business Rules:**

- Borrowing record must exist
- Book must not be already returned
- Stock is automatically incremented upon return

**Example Request:**

```bash
curl -X PUT http://localhost:3000/api/borrowings/{borrowing-id}/return
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookId": "uuid",
    "memberId": "uuid",
    "borrowDate": "2024-11-26T10:30:00.000Z",
    "returnDate": "2024-11-27T14:20:00.000Z",
    "status": "RETURNED"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": "Borrowing not found"
}
```

```json
{
  "success": false,
  "error": "Book has already been returned"
}
```

---

## Database Schema

### Books Table

```prisma
model Book {
  id            String      @id @default(uuid())
  title         String
  author        String
  publishedYear Int
  stock         Int
  isbn          String      @unique
  borrowings    Borrowing[]
}
```

### Members Table

```prisma
model Member {
  id         String      @id @default(uuid())
  name       String
  email      String      @unique
  phone      String
  address    String
  borrowings Borrowing[]
}
```

### Borrowings Table

```prisma
model Borrowing {
  id         String           @id @default(uuid())
  bookId     String
  memberId   String
  borrowDate DateTime         @default(now())
  returnDate DateTime?
  status     BorrowingStatus  @default(BORROWED)
  book       Book             @relation(fields: [bookId], references: [id])
  member     Member           @relation(fields: [memberId], references: [id])
}

enum BorrowingStatus {
  BORROWED
  RETURNED
}
```

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (auto-reload)
- `npm run seed` - Seed database with sample data
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma Client

---

### Project Structure

```
test_be_PT.SGT/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.js             # Database seeder
│   └── migrations/         # Migration files
├── src/
│   ├── app.js              # Express app entry point
│   ├── config/
│   │   └── database.js     # Prisma client configuration
│   ├── controllers/        # Request handlers
│   │   ├── bookController.js
│   │   ├── memberController.js
│   │   └── borrowingController.js
│   ├── services/           # Business logic layer w^w
│   │   ├── bookService.js
│   │   ├── memberService.js
│   │   └── borrowingService.js
│   └── routes/             # API routes
│       ├── bookRoutes.js
│       ├── memberRoutes.js
│       └── borrowingRoutes.js
├── .env                    # Environment variables
├── package.json            # Dependencies
├── prisma.config.ts        # Prisma 7 configuration
└── README.md               # This is file u read raig naw :D
```

---

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation errors, business logic violations)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (unexpected errors)

---

## License

This project is created for PT.SGT backend test assessment.
