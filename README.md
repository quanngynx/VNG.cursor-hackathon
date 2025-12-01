# VNG.cursor-hackathon

Backend API project using Node.js, TypeScript, Express, and Firebase Firestore.

🔗 **Live Demo:** [https://nutritrack-inky.vercel.app/](https://nutritrack-inky.vercel.app/)

## 📋 System Requirements

  - **Node.js**:
      - Backend: \>= 18.x
      - Frontend: \>= 20.9.0 (Next.js 16 requirement)
  - **pnpm**: \>= 8.x (or npm/yarn)
  - **Firebase Service Account Key**: JSON file from Firebase Console

## 🚀 Installation & Setup

### 1\. Install dependencies

```bash
cd server
pnpm install
```

### 2\. Firebase Configuration

1.  Download the Firebase Service Account Key from Firebase Console.
2.  Place the JSON file in the project's root directory (at the same level as the `server` folder).
3.  Ensure the filename matches the configuration in `server/src/configs/firebase.ts`.

**Note**: By default, the file requires the name: `cursor-hackathon-2e617-firebase-adminsdk-fbsvc-93b16413db.json`

### 3\. Environment Variables Configuration (Optional)

Create a `.env` file in the `server` directory if you need to override default values:

```env
# API URLs
NEXT_PUBLIC_API_URL_CLIENTS=http://localhost:3000
NEXT_PUBLIC_API_URL_SERVER=http://localhost:3002

# Ports
NEXT_PUBLIC_API_PORT_CLIENTS=3000
NEXT_PUBLIC_API_PORT_SERVER=3002

# App Name
BRAND_APP_NAME=VNG.cursor-hackathon Server
```

### 4\. Run the Project

#### Development mode (with hot reload)

```bash
pnpm dev
```

#### Production mode

```bash
# Build project
pnpm build

# Start server
pnpm start
```

### 5\. Verification

The server will run at: `http://localhost:3002` (or the configured port).

Check if the API is running:

```bash
curl http://localhost:3002/
```

## 📁 Project Structure

```
VNG.cursor-hackathon/
├── server/                      # Backend server
│   ├── src/
│   │   ├── app.ts               # Express app configuration
│   │   ├── main.ts              # Entry point
│   │   ├── configs/             # Configuration files
│   │   │   ├── cors.ts          # CORS configuration
│   │   │   └── firebase.ts      # Firebase initialization
│   │   ├── controllers/         # Request handlers
│   │   │   └── food-log.controller.ts
│   │   ├── middlewares/         # Express middlewares
│   │   │   └── request-context.middleware.ts
│   │   ├── repositories/        # Data access layer
│   │   │   ├── base.repository.ts  # Base repository class
│   │   │   ├── user.repository.ts
│   │   │   ├── food-log.repository.ts
│   │   │   ├── chat-message.repository.ts
│   │   │   └── index.ts
│   │   ├── routes/              # API routes
│   │   │   ├── router.v1.ts     # Main router
│   │   │   └── food-log.routes.ts
│   │   ├── schemas/             # Zod validation schemas
│   │   │   ├── base.schema.ts
│   │   │   ├── user.schema.ts
│   │   │   ├── food-log.schema.ts
│   │   │   ├── chat-message.schema.ts
│   │   │   └── index.ts
│   │   ├── services/            # Business logic layer
│   │   │   └── example-firebase.service.ts
│   │   ├── scripts/             # Utility scripts
│   │   │   ├── seed-data.ts     # Database seeding
│   │   │   └── README.md
│   │   └── venv/                # Environment variables
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json            # TypeScript configuration
│   ├── nodemon.json             # Nodemon configuration
│   └── eslint.config.mjs        # ESLint configuration
├── docs/                        # Project documentation
│   ├── 01_Requirements_and_Scope.md
│   ├── 02_System_Architecture.md
│   ├── 03_UI_UX_Flow.md
│   └── 04_Implementation_Plan.md
├── LICENSE
└── README.md                    # This file
```

## 🛠️ Available Scripts

Inside the `server/` directory:

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run server in development mode with hot reload |
| `pnpm dev:debug` | Run server in debug mode |
| `pnpm start` | Run server in production mode (requires build first) |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm build:watch` | Build and watch for changes |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Check code style |
| `pnpm lint:fix` | Automatically fix code style issues |
| `pnpm clean` | Remove build directory |
| `pnpm seed` | Run script to seed data into the database |

## 📚 References

  - `server/QUICK_START.md` - Quick start guide on how to use repositories and services
  - `server/FIREBASE_SCHEMA_GUIDE.md` - Detailed guide on Firebase schemas
  - `server/FIREBASE_SETUP_SUMMARY.md` - Summary of the Firebase setup structure
  - `server/SEED_DATA_GUIDE.md` - Guide for seeding data
  - `docs/` - Documentation regarding requirements, architecture, and implementation plan

## 🏗️ Architecture

The project utilizes the following patterns:

  - **Repository Pattern**: Separates data access logic
  - **Service Layer**: Handles business logic
  - **Controller Layer**: Handles HTTP requests/responses
  - **Schema Validation**: Uses Zod for type safety and validation
  - **TypeScript**: Full type safety

## 🔧 Tech Stack

  - **Runtime**: Node.js
  - **Framework**: Express.js
  - **Language**: TypeScript
  - **Database**: Firebase Firestore
  - **Validation**: Zod
  - **Security**: Helmet, CORS
  - **Logging**: Winston
  - **Package Manager**: pnpm

## 📝 Notes

  - Ensure the Firebase Service Account Key is placed in the correct location and has Firestore access permissions.
  - The default port is `3002`, which can be changed via the `NEXT_PUBLIC_API_PORT_SERVER` environment variable.
  - API base path: `/api/v1`

-----

**Gợi ý bước tiếp theo:**
Bạn có muốn tôi tạo thêm file `CONTRIBUTING.md` để hướng dẫn người khác cách đóng góp (pull request, commit convention) cho repository này không?
