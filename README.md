# Droply

Droply is a mobile-first campus food, grocery, and delivery marketplace designed around the NSUK community. The Next.js client includes store discovery, catalog browsing, favorites, a single-store cart, checkout, order tracking, rewards, profile management, notification preferences, and FAQs.

The repository also contains a standalone Node.js/Express/MongoDB API under [`server`](./server). It follows an MVC-style request flow:

```text
route -> validation/auth middleware -> controller -> service -> Mongoose model
```

## Local setup

Requirements: Node.js 20.19+ and MongoDB 7+.

1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.
2. Install packages with `npm install`.
3. Seed the database with `npm run seed:api`.
4. Start the API with `npm run dev:api` (port 4000 by default).
5. In another terminal, start the Next.js client with `npm run dev` (port 3000).

The API base URL is `http://localhost:4000/api/v1`. See [`server/README.md`](./server/README.md) for module and endpoint documentation.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Next.js client |
| `npm run dev:api` | Run the Express API with reloads |
| `npm run start:api` | Run the Express API |
| `npm run seed:api` | Upsert the current frontend catalog and demo data into MongoDB |
| `npm run test:api` | Run API unit and integration tests |
| `npm run lint` | Lint the repository |
| `npm run build` | Create a production Next.js build |

Seeded accounts are intended for local development only:

| Role | Email | Password |
| --- | --- | --- |
| Customer | `leonard@nsuk.edu.ng` | `Student123!` |
| Merchant | `merchant@droply.ng` | `Merchant123!` |
| Rider | `rider@droply.ng` | `Rider123!` |
| Admin | `admin@droply.ng` | `Admin123!` |
