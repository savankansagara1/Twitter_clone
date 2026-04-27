Understood — I'll provide a revised README that removes the models/ folder and keeps all SQL queries inside controllers. Below is a complete README adjusted to your preference (controllers hold queries). Concise and ready to place in your repo.

# Twitter Clone — README
Date: April 27, 2026

Project overview
A Twitter-like REST API (Node + TypeScript + MySQL) implementing signup/login, tweets with media (Cloudinary), follows, likes, retweets, comments, and notifications. Validation uses Zod. All DB queries live inside controller files (no models/ or services/ folders).

Tech stack
- Node.js + TypeScript
- Express
- MySQL (schema provided)
- Zod (validation)
- Cloudinary (media storage)
- multer or multer-storage-cloudinary (file upload)
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- dotenv
- mysql2 or promise-based DB client
- ts-node-dev for development

Project structure (create these)
- .env
- package.json
- tsconfig.json
- README.md
- schema/
  - data.sql
  - db.sql
- src/
  - config/
    - db.ts                 # DB connection pool (export query helper)
    - cloudinary.ts         # Cloudinary init & upload helpers
    - index.ts              # export configs
  - controllers/
    - auth.controller.ts    # signup/login (contains all auth queries)
    - users.controller.ts   # profile CRUD, followers/following queries
    - tweets.controller.ts  # create/get/delete tweets + feed (contains tweet & tweet_media queries)
    - media.controller.ts   # upload-only endpoints & Cloudinary helpers (optional)
    - follows.controller.ts # follow/unfollow queries
    - reactions.controller.ts # likes/toggles queries
    - retweets.controller.ts  # retweet/unretweet queries
    - comments.controller.ts  # create/get/delete comments queries
    - notifications.controller.ts # create/get/mark-read queries
  - routes/
    - index.routes.ts       # mounts all routers
    - auth.routes.ts
    - users.routes.ts
    - tweets.routes.ts
    - media.routes.ts
    - follows.routes.ts
    - reactions.routes.ts
    - comments.routes.ts
    - notifications.routes.ts
  - middleware/
    - auth.middleware.ts    # JWT verification, attach req.user
    - validate.middleware.ts# Zod wrapper (body/params/query)
    - upload.middleware.ts  # multer + Cloudinary streaming config
    - error.middleware.ts   # centralized error handler
    - rateLimit.middleware.ts (optional)
  - validators/
    - auth.schema.ts
    - user.schema.ts
    - tweet.schema.ts
    - comment.schema.ts
    - follow.schema.ts
    - reaction.schema.ts
  - types/
    - express.d.ts          # augment Request types for typed body/user
    - index.ts
  - utils/
    - password.ts           # hash/compare helpers
    - jwt.ts                # sign/verify tokens
    - pagination.ts
    - sanitize.ts
  - app.ts                  # express app (for tests)
  - server.ts               # bootstrap and app.listen
- dist/ (build output)

Notes
- Do not create a services/ or models/ folder.
- Controllers will contain DB queries (use parameterized queries via db connection).
- Keep controllers organized and not overly large—split by resource as shown.

Database
Use your provided schema (place in schema/). Example .env DB values:
DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_CONNECTION_LIMIT, TZ

Configuration (src/config/db.ts)
- Export a single query helper: async function query(sql, params) that uses mysql2/promise pool and returns rows.
- Run session timezone per connection or ensure DB time_zone is +00:00.

Environment variables (minimum)
- PORT, NODE_ENV
- JWT_SECRET, JWT_EXPIRES_IN
- BCRYPT_SALT_ROUNDS
- DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- ALLOWED_ORIGINS

Authentication
- Signup: validate (Zod), hash passwords with bcrypt, insert user, return JWT + user object (exclude hashed_password).
- Login: accept email or username, verify, return JWT.
- auth.middleware.ts: verify Bearer token, set req.user = { user_id }.

Cloudinary & uploads
- Use multer to parse multipart/form-data.
- Use cloudinary.v2.uploader.upload_stream to upload files; return secure_url and resource_type.
- Store media entries in tweet_media table with media_type (image|video) and media_url.

Validation (Zod)
- Use validate.middleware(schema, target) to validate body/params/query.
- Put all schemas in src/validators.

Routes (summary)
Base path: /api

Auth
- POST /api/auth/signup — public — body: { fullname, username, email, dob, password, country, bio? }
- POST /api/auth/login — public — body: { emailOrUsername, password }

Users
- GET /api/users/:id — public
- GET /api/users/@:username — public
- PUT /api/users/me — auth — update profile
- GET /api/users/:id/followers — public/paginated
- GET /api/users/:id/following — public/paginated

Follows
- POST /api/follows — auth — body: { followee_id }
- DELETE /api/follows/:followee_id — auth

Tweets
- POST /api/tweets — auth, upload — body: { content? } + files
- GET /api/tweets/:id — public
- DELETE /api/tweets/:id — auth (owner)
- GET /api/tweets/user/:user_id — public (paginated)
- GET /api/tweets/feed — auth (paginated)

Media
- POST /api/media/upload — auth, upload — returns media_url & media_type

Retweets
- POST /api/retweets — auth — body: { tweet_id }
- DELETE /api/retweets/:tweet_id — auth

Reactions
- POST /api/reactions — auth — body: { tweet_id, isLiked } (toggle)
- GET /api/tweets/:id/reactions — public

Comments
- POST /api/comments — auth — body: { tweet_id, comment_content, parent_comment_id? }
- GET /api/tweets/:id/comments — public (paginated)
- DELETE /api/comments/:id — auth (owner)

Notifications
- GET /api/notifications — auth (paginated)
- PATCH /api/notifications/:id/read — auth

Controller responsibilities (with queries inside)
- Each controller file contains all DB queries related to that resource using the shared db.query helper.
- Use parameterized queries to avoid injection.
- Use transactions inside controller where multiple related queries need atomicity (e.g., create tweet + insert media rows + create notifications).
- Controllers should:
  - Validate input (via middleware).
  - Run queries.
  - Map DB rows to response objects (remove sensitive fields).
  - Create notifications when needed (follow, like, retweet, comment).
  - Return consistent JSON shapes.

DB query examples (pseudocode inside controllers)
- Create user:
  const sql = `INSERT INTO users (fullname, username, email, dob, hashed_password, country, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await db.query(sql, [fullname, username, email, dob, hashedPassword, country, bio]);

- Get tweet with media:
  const tweet = await db.query(`SELECT * FROM tweets WHERE tweet_id = ?`, [tweet_id]);
  const media = await db.query(`SELECT * FROM tweet_media WHERE tweet_id = ?`, [tweet_id]);

Middleware details
- auth.middleware.ts: check Authorization header, verify JWT, attach req.user = { user_id }.
- validate.middleware.ts: runs schema.parseAsync; on error return 400 with formatted zod issues.
- upload.middleware.ts: configure multer limits and fileFilter to accept images/videos only.
- error.middleware.ts: handle errors centrally, return consistent error JSON.

Notifications handling
- When an action occurs, controllers create a notification row:
  INSERT INTO notification (user_id, actor_id, tweet_id, comment_id, notification_type) VALUES (?, ?, ?, ?, ?)
- notification_type values: 'follow', 'like', 'retweet', 'comment'

Pagination & feed
- Accept query params: page (default 1), limit (default 20)
- Offset = (page - 1) * limit
- For feed: SELECT tweets from followees UNION own tweets ORDER BY created_at DESC LIMIT ?, ?

Security & best practices
- Hash passwords with bcrypt using BCRYPT_SALT_ROUNDS from env.
- Use parameterized queries always.
- Never return hashed_password.
- Validate/sanitize inputs.
- Limit file sizes and allowed mimetypes.
- Rate-limit critical endpoints (login, signup, tweet creation).

Response formats
- Success: { status: "success", data: { ... } }
- Paginated: { status: "success", data: [...], meta: { page, limit, total } }
- Error: { status: "error", message: "...", errors?: [...] }

Scripts (package.json)
- "dev": "ts-node-dev --respawn --transpile-only src/server.ts"
- "build": "tsc"
- "start": "node dist/server.js"
- "test": "jest"

Implementation checklist
1. Create DB and run schema files.
2. Add .env with credentials.
3. Implement src/config/db.ts (export query function).
4. Implement validators in src/validators using Zod.
5. Implement middleware (auth, validate, upload, error).
6. Implement controllers with queries (auth → users → tweets → media → follows → reactions → comments → notifications).
7. Wire routes in src/routes and mount in server.ts at /api.
8. Add tests and run integration tests against test DB.
9. Deploy (build -> dist).

Example small snippets (where to put)
- Put DB helper in src/config/db.ts and import in controllers:
  export async function query(sql: string, params?: any[]) { /* mysql2/promise pool */ }

- Use cloudinary helper in src/config/cloudinary.ts and call from upload middleware or media controller.

Next steps I can generate (pick one)
- Full skeleton of controllers (with SQL queries inside) for auth, tweets, comments, and notifications.
- Zod schemas for all endpoints.
- Middleware code for auth, validation, upload, and error handler.

Which skeleton or files would you like generated now?