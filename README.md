# Portfolio API
A production-ready Express + PostgreSQL backend for managing authenticated users, invite flows, and rich portfolio content (careers, projects, skills, education, games, and bars). The service layers HTTP transport, business logic, and persistence so that controllers stay thin, services reusable, and Sequelize models authoritative.

Backend: https://api.codetypeweb.com/
Frontend: https://codetypeweb.com/

## Contents
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Database & Migrations](#database--migrations)
- [Available Scripts](#available-scripts)
- [API Modules](#api-modules)
- [Security, Observability & Resilience](#security-observability--resilience)
- [Email & Notification Layouts](#email--notification-layouts)
- [Example Next.js 15 Integration](#example-nextjs-15-integration)
- [Testing Strategy](#testing-strategy)
- [Refactoring & Future Enhancements](#refactoring--future-enhancements)

## Architecture Overview
- **Bootstrap sequence** – `src/server.js` loads configuration, opens the PostgreSQL connection, and starts Express. Database connectivity is validated with `sequelize.authenticate()` to fail fast when credentials are invalid.【F:src/server.js†L1-L12】【F:src/config/db.js†L1-L22】
- **HTTP composition** – `src/app.js` wires security middleware (CORS, Helmet, compression), populates contextual config, logs authenticated requests, registers feature routers, and terminates the middleware chain with a centralized error handler.【F:src/app.js†L1-L52】
- **Dependency injection** – Models are initialized once via `initModels(sequelize)` and injected into controllers/services through a `deps` object so that each module can be tested in isolation without booting the full app.【F:src/app.js†L7-L49】
- **Layered modules** – Controllers (e.g., `src/controllers/user.controller.js`) validate/authorize requests and delegate to services (`src/services/user.service.js`), which encapsulate business logic and Sequelize calls, keeping cross-cutting helpers in `src/utils`.【F:src/controllers/user.controller.js†L3-L63】【F:src/services/user.service.js†L5-L29】【F:src/utils/response.js†L1-L11】

## Tech Stack
| Area | Tooling |
| --- | --- |
| Runtime | Node.js 20+, Express 4, Nodemon for hot reload |
| Database | PostgreSQL 13+, Sequelize ORM |
| Auth/Security | JWT (access tokens), bcrypt hashing, Helmet, CORS, Express Session (optional) |
| Messaging | Nodemailer transporter + HTML layouts |
| Observability | Winston logger with daily rotation |

_Reference: `package.json` dependencies and scripts._【F:package.json†L2-L38】

## Folder Structure
```
src/
  app.js / server.js           # Express bootstrap and HTTP server
  config/                      # Runtime/environment + Sequelize config
  controllers/                 # HTTP entrypoints
  services/                    # Business logic + DB orchestration
  models/                      # Sequelize schemas & associations
  routes/                      # Feature routers with per-endpoint docs
  middlewares/                 # Auth, logging, error handling
  layouts/                     # HTML emails (invites, password flows)
  utils/                       # Response helpers, pagination, etc.
```

## Local Setup
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Provision PostgreSQL**
   - Create a database/user matching the credentials you will place in `.env`.
   - Ensure the user has rights to create/alter tables (Sequelize migrations expect this).
3. **Seed environment variables**
   - Copy `.env.example` (create one if absent) to `.env` and fill out the variables listed below.
4. **Run the migration**
   ```bash
   npx sequelize-cli db:migrate
   ```
5. **Run the development server**
   ```bash
   npm run dev
   ```
   The API starts on `http://localhost:<PORT>` after a successful DB handshake.

## Environment Variables
| Key | Purpose |
| --- | --- |
| `PORT`, `NODE_ENV` | Express listen port and runtime mode. |
| `ENCRYPTION_ROUND` | bcrypt salt rounds for password hashing. |
| `INVITE_PW` | Shared secret that protects internal invite flows. |
| `SESSION_KEY` | Optional express-session signing secret. |
| `API_URL`, `FRONTEND_URL` | Used for CORS and to build absolute email links. |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | PostgreSQL connection credentials. |
| `DB_CONNECTIONLIMIT`, `DB_QUEUELIMIT` | Pool sizing knobs when using pg-pool. |
| `JWT_SECRET_KEY`, `JWT_REFRESH_SECRET_KEY` | Signing secrets for access and refresh tokens. |
| `INVITE_EXPIRES_DAYS`, `TOKEN_EXPIRES_HOURS` | TTLs for invite + password reset flows. |
| `EMAIL_SENDER` + SMTP credentials | Consumed by the Nodemailer transporter. |

_All variables above feed `src/config/config.js`, which merges them with mail helpers consumed throughout services._【F:src/config/config.js†L1-L47】

## Database & Migrations
- Sequelize is instantiated with PostgreSQL dialect, disabled SQL logging, and hard failure if authentication fails to help CI environments catch invalid credentials early.【F:src/config/db.js†L4-L22】
- Define or update models inside `src/models/*.js`. Each file exports a function that receives the shared `sequelize` instance and returns a configured model (e.g., `User` sets unique email constraints and enumerated statuses).【F:src/models/user.js†L1-L19】
- Run `npx sequelize-cli db:migrate` (migration files live in `migrations/`). Seed scripts can target the same connection by importing `sequelize` from `src/config/db`.

## Available Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Runs `nodemon src/server.js` for hot-reloaded local development. |
| `npm start` | Runs `node src/server.js` for production-grade execution. |

_See `package.json` for the authoritative list._【F:package.json†L5-L8】

## API Modules
| Module | Highlights |
| --- | --- |
| Auth (`/api/auth`) | Login/logout/me endpoints, forgot-password lifecycle, and invitation issuance/acceptance. Every route documents its auth requirements inline for quick onboarding.【F:src/routes/auth.routes.js†L1-L95】 |
| Users (`/api/users`) | Controllers enforce self-service updates (no cross-account edits) and forward calls to services that hash passwords via bcrypt when needed.【F:src/controllers/user.controller.js†L7-L62】【F:src/services/user.service.js†L12-L27】 |
| Portfolio (`/api/portfolio`) | Endpoints to fetch the authenticated portfolio, share user views, and CRUD nested resources (experiences, projects, education, skills).【F:src/routes/portfolio.routes.js†L1-L71】 |
| Games/Bars/Bases | Additional routers expose CRUD for ancillary resources (see `src/routes/game.routes.js`, `bar.routes.js`, `base.routes.js`). Game routes allow anonymous reads but gate writes with `requireAuth`.【F:src/routes/game.routes.js†L1-L39】 |
| Utilities | `utils/response.js` standardizes success/error envelopes while `buildPaginationMeta` (not shown) keeps pagination consistent across list endpoints.【F:src/utils/response.js†L1-L11】 |

## Security, Observability & Resilience
- **Transport & content security** – CORS is restricted to the configured frontend origin, Helmet hardens HTTP headers, and compression is added for network efficiency.【F:src/app.js†L1-L20】
- **Auth middleware** – `middlewares/auth.js` accepts Bearer headers or httpOnly cookies, verifies JWT signatures with the configured secret, and rejects expired tokens with a 401 response.【F:src/middlewares/auth.js†L1-L18】
- **Background logging** – `middlewares/extractUserFromToken.js` safely decodes tokens to enrich logs, while `middlewares/logger.js` streams entries to console plus daily rotating files, retaining 365 days of history.【F:src/middlewares/extractUserFromToken.js†L4-L25】【F:src/middlewares/logger.js†L1-L24】
- **Request auditing** – Once a user is decoded, every request (except `/api/auth/me`) is logged with IP, HTTP verb, and serialized body payloads for traceability.【F:src/app.js†L21-L39】
- **Error handling** – `middlewares/errorHandler.js` centralizes 5xx output to prevent leaking stack traces while keeping failure logs in stderr.【F:src/middlewares/errorHandler.js†L1-L9】
- **Email trust** – All transactional email bodies are rendered from vetted templates in `src/layouts/email.js` for invites, welcomes, password resets, and confirmations, ensuring consistent branding and anti-phishing copy.【F:src/layouts/email.js†L1-L96】

## Email & Notification Layouts
- Invitation, welcome, password reset, and update confirmation emails are fully responsive HTML snippets kept in `src/layouts/email.js`. Services call into these helpers, which then pipe through the configured Nodemailer transporter defined in `src/config/emailConfig`. This keeps copy centralized and auditable for legal/security reviews.【F:src/layouts/email.js†L1-L96】【F:src/config/config.js†L1-L14】

### How it works
1. **Service module** – `fetchPortfolio` centralizes API calls so the rest of the app only depends on one function. The comments outline each operational step.
2. **Hook** – `usePortfolio` encapsulates `useState`/`useEffect` plumbing, ensuring UI components remain stateless and easy to test.
3. **Presentation components** – `PortfolioCard` is a pure functional component with Tailwind utility classes, which makes snapshot testing straightforward.
4. **Page assembly** – `PortfolioPage` imports the hook and card, so tests can mock `usePortfolio` to simulate various states.

### Architectural reasoning
- Mirrors the backend's controller/service/model split on the frontend (page/hook/service) for familiarity.
- Functional components without side-effects make it trivial to compose React Testing Library tests.
- Using environment-driven Axios clients respects deployments where the API lives under a different host or prefix.

### Refactoring, testing, and security considerations for the example
- **Refactoring** – Consider extracting skeleton components or using SWR/React Query for caching once requirements grow.
- **Testing** – Write RTL tests that mock `usePortfolio` to verify loading/error/success renders; integration tests can stub network requests with MSW.
- **Security** – Always send requests with `withCredentials` so httpOnly JWT cookies flow correctly; additionally, gate the page via Next.js middleware that redirects unauthenticated users before rendering sensitive data.

## Testing Strategy
- **Unit tests** – Focus on services by injecting stubbed Sequelize models (thanks to the DI pattern in each service factory). Mock `models.User` methods to validate logic around password changes or invite expirations.
- **Integration tests** – Spin up an in-memory PostgreSQL (or dockerized) instance, run migrations, and hit Express routes via Supertest to verify middleware ordering, response envelopes (`utils/response`), and auth guards.
- **E2E** – Pair the backend with the provided Next.js example to validate cross-origin cookies, invite flows, and password resets end-to-end.

## Refactoring & Future Enhancements
1. **Configuration hardening** – Introduce a schema validator (e.g., `zod`) that fails fast when mandatory env vars are missing.
2. **Rate limiting** – Layer a Redis-backed limiter on `/api/auth` endpoints to prevent brute-force login attempts.
3. **Background jobs** – Move heavy email dispatches to a queue (BullMQ) to keep API responses snappy under load.
4. **Observability** – Emit structured JSON logs and pipe them to OpenTelemetry for distributed tracing once multiple services collaborate.
5. **Testing automation** – Add GitHub Actions workflows to lint, test, and run migrations on pull requests before deploying.
