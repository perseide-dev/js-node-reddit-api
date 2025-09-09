# Reddit API

Node.js REST API for:
- User authentication (JWT)
- Synchronizing and querying public subreddits from Reddit
- Interactive documentation via Swagger

## Technologies
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT (authentication)
- Swagger (OpenAPI 3)
- Axios (external API consumption)

## Architecture

Layered Architecture:

```
HTTP Client
   ↓
Routes (Express Router)
   ↓
Controllers
   ↓
Services (Business logic)
   ↓
Models (Sequelize / Data Mapper)
   ↓
PostgreSQL
```

Elements:
- Config: config/database.js
- Entry point: src/app.js
- Routes: src/routes/authRoutes.js, src/routes/redditRoutes.js
- Controllers: src/controllers/authController.js, src/controllers/redditController.js
- Services: src/services/authService.js, src/services/redditService.js
- Models: src/models/User.js, src/models/Reddit.js
- Middleware: src/middlewares/authMiddleware.js
- Docs: src/docs/swagger.js

## Design Patterns
- Layered / Service Layer: clear separation of concerns
- Data Mapper: Sequelize abstracts DB access
- Middleware Pattern: JWT auth in authMiddleware
- Implicit DTO: login response bundles { user, token }
- Environment variable usage (12-Factor App)
- Idempotent partial upsert via bulkCreate(..., { ignoreDuplicates: true }) in redditService.fetchAndStoreReddits

Potential extension: Repository pattern (add repositories/ folder)

## Key Services
- Register: authService.register
- Login: authService.login
- Sync subreddits: redditService.fetchAndStoreReddits
- Pagination & search (ILIKE over name/title/description): redditService.getPaginatedReddits
- Detail: redditService.getRedditDetail

## Main Endpoints
See interactive docs: GET /api/docs

Basic flow:
1. POST /api/auth/register
2. POST /api/auth/login → token
3. Authorization header: Authorization: Bearer <token>
4. POST /api/reddits/sync
5. GET /api/reddits?page=1&limit=10&q=javascript
6. GET /api/reddits/{name}

## Local Setup

### Requirements
- Node.js >= 18
- Docker (recommended) or local PostgreSQL

### 1. Clone
```bash
git clone <repo-url>
cd js-node-reddit-api
```

### 2. Create database (Docker)
```bash
docker run --name reddit-postgres \
  -e POSTGRES_DB=redditdb \
  -e POSTGRES_USER=reddituser \
  -e POSTGRES_PASSWORD=redditpass \
  -p 5432:5432 -d postgres:16
```

### 3. Environment variables
Create .env:

```env
DB_NAME=redditdb
DB_HOST=localhost
DB_USER=reddituser
DB_PASS=redditpass
DB_PORT=5432
DB_SSL=false
JWT_SECRET=change_this_secret
PORT=3000
```

Do not reuse sample secrets in production.

### 4. Install dependencies
```bash
npm install
```

### 5. Run (dev)
```bash
npm run dev
```

### 6. Verify
- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

Tables auto-created by sequelize.sync() in src/app.js.

## Quick Usage (curl)

Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass123"}'
```

Login:
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass123"}' | jq -r '.token')
```

Sync:
```bash
curl -X POST http://localhost:3000/api/reddits/sync -H "Authorization: Bearer $TOKEN"
```

List:
```bash
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/reddits?limit=5&q=dev"
```

## Search & Pagination
Params:
- page (int, default 1)
- limit (int, default 10)
- q (string, partial ILIKE on name/title/description)

Implemented in redditService.getPaginatedReddits.

## Security
- Password hashing with bcrypt (cost 10) in authService.register
- JWT expires in 1h in authService.login
- Middleware validates token: src/middlewares/authMiddleware.js

## Possible Future Enhancements
- Real Repository layer
- Redis cache for subreddit detail
- Tests (Jest / Supertest)
- Centralized error handler
- Soft deletes / timestamps
- Refresh tokens / rotation
- Structured logging