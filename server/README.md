# Droply API

Droply's backend is a standalone Node.js, Express, MongoDB, and Mongoose application. It supports the NSUK marketplace frontend: authentication, stores and products, favorites, cart and checkout, payments, order tracking, rider chat, rewards, notifications, profile settings, and FAQs.

The API root is:

```text
http://localhost:4000/api/v1
```

The health endpoint is outside the API prefix:

```text
GET http://localhost:4000/health
```

## Contents

- [Why the backend is called Droply](#why-the-backend-is-called-droply)
- [Architecture](#architecture)
- [Backend modules](#backend-modules)
- [MongoDB setup](#mongodb-setup)
- [Environment variables](#environment-variables)
- [Install, seed, and run](#install-seed-and-run)
- [Frontend connection](#frontend-connection)
- [Authentication and roles](#authentication-and-roles)
- [Response format](#response-format)
- [Complete endpoint reference](#complete-endpoint-reference)
- [Frontend screen-to-endpoint map](#frontend-screen-to-endpoint-map)
- [Checkout and payment flow](#checkout-and-payment-flow)
- [Important business rules](#important-business-rules)
- [Testing](#testing)

## Why the backend is called Droply

The name came from the application that was already present in the repository. The frontend assets include `droply-logo.png` and `droply-logo-dark.png`, the design references live under `figma_images/Droply`, browser storage uses names such as `droply_theme`, and the screens consistently present the product as **Droply**. The backend therefore uses names such as `Droply API`, `droply` for the MongoDB database, and `droply_...` for payment references so it matches the existing product identity. The repository folder is named `NSUK` because NSUK is the initial campus/community the Droply product serves.

## Architecture

Requests follow this flow:

```text
route -> validation/auth middleware -> controller -> service -> Mongoose model -> MongoDB
```

| Directory | Responsibility |
| --- | --- |
| `src/routes` | Declares URLs, HTTP methods, authentication, roles, and validators |
| `src/controllers` | Converts HTTP requests into service calls and formats responses |
| `src/services` | Contains business rules, authorization scoping, pricing, inventory, and persistence orchestration |
| `src/models` | Defines MongoDB collections, relationships, validation, and indexes |
| `src/validators` | Validates write payloads with Zod before they reach services |
| `src/middleware` | JWT authentication, role authorization, request validation, 404 handling, and error handling |
| `src/config` | Loads environment configuration and manages the MongoDB connection |
| `src/seeds` | Idempotently imports the frontend catalog and creates local demo data |
| `tests` | Unit tests and full HTTP integration tests using an in-memory MongoDB instance |

## Backend modules

### Authentication

- Registers customer accounts.
- Logs in with either email or username.
- Hashes passwords with bcrypt; passwords are never returned or stored as plain text.
- Issues signed JWT access tokens.
- Revokes existing JWTs when a user logs out or changes their password.
- Rejects inactive accounts.

### Users and profiles

- Returns the signed-in user's profile, wallet balance, reward points, rating, and order count.
- Updates name, username, phone number, and avatar URL.
- Stores push, SMS, order, promotion, delivery, reward, and app-update notification preferences.
- Lets administrators search users, filter by role, and activate or deactivate accounts.

### Delivery addresses

- Creates, lists, updates, and deletes user-owned delivery addresses.
- Supports labels, delivery instructions, coordinates, and a default address.
- Automatically makes the first address the default.
- Reassigns the default when the current default address is deleted.

### Categories

- Exposes active food and grocery categories to the storefront.
- Accepts either a MongoDB ID or category slug for category detail.
- Supports colors, images, display ordering, and active/inactive state.
- Provides administrator category management.
- Prevents deleting categories that still contain products.

### Stores

- Lists active stores with search, type, open/closed, rating sort, and pagination.
- Returns a store together with its available products.
- Filters a store's products by category and popular/premium tier.
- Lets merchants manage only stores they own.
- Lets administrators manage any store and assign owners.
- Store deletion is a soft delete so historical orders remain intact.

### Products and inventory

- Lists and searches available products with store, category, tier, price, and sort filters.
- Returns product details including ingredients, nutrition, rating, store, and category.
- Supports old frontend product IDs through `legacyId` during migration.
- Lets merchants manage products belonging to their stores.
- Supports unlimited inventory with `inventory: null` or finite stock with an integer.
- Validates stock in the cart, atomically reserves finite stock at checkout, and restores it when an unpaid order is cancelled or a pre-delivery payment is refunded.
- Product deletion is a soft delete through `isAvailable: false`.

### Favorites

- Stores one favorite record per user and product.
- Lists favorites with populated product, store, and category information.
- Makes adding an existing favorite idempotent.

### Cart

- Maintains one persistent cart per user.
- Adds, updates, removes, and clears products.
- Enforces a single store per cart.
- Returns populated products and server-calculated subtotal, delivery fee, discount, and total.
- Applies and removes validated promo codes.
- Rejects quantities above available finite inventory.

### Promotions

- Supports fixed and percentage discounts.
- Supports minimum subtotal, maximum discount, start/end dates, global usage limit, and per-user usage limit.
- Supports account-owned promo codes generated by reward claims.
- Revalidates the promotion against the real cart during checkout; the frontend cannot choose the final discount.
- Provides administrator promotion management.

### Orders and tracking

- Converts the current cart and selected address into an order.
- Calculates all prices on the server and snapshots product names, prices, images, quantities, and the delivery address.
- Clears the cart after checkout.
- Provides role-scoped history: customers see their orders, riders see assigned deliveries, merchants see orders for their stores, and admins see all orders.
- Enforces the order state machine and records every update in a timeline.
- Supports cancellation, rider assignment, and reordering available products from an earlier order.
- Awards one reward point per ₦100 after delivery.

### Order chat

- Stores messages against an order.
- Restricts access to the customer, assigned rider, owning merchant, and administrators.
- Marks messages as read when the conversation is loaded.
- Creates a notification for the other order participant.

### Payments and refunds

- Supports card, wallet, and cash payment methods.
- Uses an immediate safe mock provider for local card-payment development.
- Supports Paystack initialization, callback verification, and signed webhooks.
- Never accepts or stores raw card numbers, expiry dates, CVVs, or PINs.
- Debits wallet payments atomically when the wallet has sufficient funds.
- Prevents duplicate payment records for an order.
- Lets administrators refund successful payments, return wallet funds, cancel eligible orders, restore inventory, and reverse delivery reward points.

### Reviews

- Lists public product reviews with pagination.
- Allows a customer to review only a product from one of their delivered orders.
- Allows one review per customer, order, and product.
- Recalculates product rating and review count after review creation.
- Lets customers remove their reviews and administrators remove any review.

### Rewards

- Lists active rewards and the promo template connected to a reward when applicable.
- Deducts points atomically when a reward is claimed.
- Prevents claiming the same reward more than once.
- Generates a unique, account-scoped, one-use promo code for discount rewards.
- Stores redemption history and remaining point balance.
- Provides administrator reward management; deletion is a soft delete.

### Notifications

- Stores order, promotion, delivery, reward, and system notifications.
- Returns a paginated inbox and unread count.
- Filters to unread notifications.
- Marks one notification or the entire inbox as read.

### FAQs

- Lists active FAQs for the profile support screen.
- Sorts FAQs by configured display order.
- Provides administrators with active and inactive FAQ management.

### Platform middleware

- Adds Helmet security headers.
- Restricts CORS to the configured frontend origins.
- Limits general requests and applies a stricter authentication rate limit.
- Limits JSON payloads to 256 KB.
- Validates write bodies with Zod.
- Uses one consistent 404/error response contract.
- Provides graceful MongoDB and HTTP-server shutdown.

## MongoDB setup

This project uses MongoDB Atlas. The application expects MongoDB 7 or newer.

1. Sign in to MongoDB Atlas and create a project for Droply.
2. Create a database deployment. The free shared tier is sufficient for local development.
3. Open **Security → Database Access**, create a database user, and grant it read/write access to the application database.
4. Open **Security → Network Access** and add the IP address of the computer or server running the API. Use `0.0.0.0/0` only temporarily during development and always use strong database credentials.
5. Open the deployment, select **Connect → Drivers → Node.js**, and copy the `mongodb+srv://` connection string.
6. Replace the username, password, and cluster placeholders. Add `droply` after `.net/` so Atlas uses that database.
7. Put the completed connection string in the repository-root `.env` file:

```dotenv
MONGODB_URI=mongodb+srv://DB_USER:URL_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/droply?retryWrites=true&w=majority
```

If the password contains characters such as `@`, `:`, `/`, `?`, or `#`, URL-encode the password before inserting it into the URI. Never commit the real URI or database credentials.

The database and collections are created automatically when `npm run seed:api` first writes data. You do not need to create the collections manually in Atlas.

### Verify MongoDB from the API

After starting the API, call:

```powershell
Invoke-RestMethod http://localhost:4000/health
```

A ready API returns HTTP `200` with `data.database` set to `connected`. It returns `503` when MongoDB is unavailable.

## Environment variables

Create `.env` at the repository root, not inside `server`:

```powershell
Copy-Item .env.example .env
```

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `NODE_ENV` | No | `development` | Use `development`, `test`, or `production` |
| `PORT` | No | `4000` | Express server port |
| `MONGODB_URI` | Yes | None for the documented Atlas setup | MongoDB Atlas connection string for the `droply` database |
| `JWT_SECRET` | Production | Development-only fallback | Signs and verifies access tokens; use at least 32 random characters |
| `JWT_EXPIRES_IN` | No | `7d` | JWT lifetime accepted by `jsonwebtoken` |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Comma-separated frontend origin allowlist |
| `PAYMENT_PROVIDER` | No | `mock` | Use `mock` locally or `paystack` in production |
| `PAYSTACK_SECRET_KEY` | Paystack only | Empty | Paystack secret key; never expose it through `NEXT_PUBLIC_*` |

Generate a strong JWT secret locally:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Example local `.env`:

```dotenv
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb+srv://DB_USER:URL_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/droply?retryWrites=true&w=majority
JWT_SECRET=paste-the-generated-random-value-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
PAYMENT_PROVIDER=mock
PAYSTACK_SECRET_KEY=
```

For multiple allowed frontends:

```dotenv
CORS_ORIGIN=http://localhost:3000,https://app.example.com
```

## Install, seed, and run

From the repository root:

```powershell
npm install
npm run seed:api
npm run dev:api
```

The seed is idempotent: it upserts rather than clearing the database. It imports the complete catalog from `src/data/mockData.ts`, preserves old product IDs in `legacyId`, creates categories, stores, products, addresses, promos, rewards, FAQs, and these development accounts:

| Role | Login | Password |
| --- | --- | --- |
| Customer | `leonard@nsuk.edu.ng` | `Student123!` |
| Merchant | `merchant@droply.ng` | `Merchant123!` |
| Rider | `rider@droply.ng` | `Rider123!` |
| Admin | `admin@droply.ng` | `Admin123!` |

These credentials are for local development only. Do not seed them into a public production database.

Run the frontend in a second terminal:

```powershell
npm run dev
```

Use `npm run start:api` instead of `npm run dev:api` when automatic restarts are not needed.

## Frontend connection

### 1. Add the public API URL

Create `.env.local` at the repository root:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Restart `npm run dev` after changing `.env.local`. Only the API base URL belongs in a `NEXT_PUBLIC_*` variable. MongoDB credentials, the JWT secret, and the Paystack secret must remain server-only.

### 2. Use one API helper

The frontend should send and receive JSON, attach the JWT to protected requests, and handle `204 No Content` without parsing JSON:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function api<T>(path: string, init: RequestInit = {}): Promise<T | undefined> {
  const token = typeof window !== 'undefined'
    ? window.localStorage.getItem('droply_access_token')
    : null;

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (response.status === 204) return undefined;

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'Request failed');
  return payload.data as T;
}
```

After registration or login, save `data.accessToken` and use `data.user` as the authenticated profile:

```ts
const session = await api<{ user: User; accessToken: string }>('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ identifier, password }),
});

localStorage.setItem('droply_access_token', session!.accessToken);
```

Remove the token locally after `POST /auth/logout`. Local storage matches the current token-only API, but it must be protected by a strict content-security policy and careful XSS prevention. A future refresh-token implementation should use secure, HTTP-only cookies.

### 3. Frontend identifiers

- Use MongoDB `_id` values returned by the API for writes such as cart, favorites, reviews, addresses, orders, rewards, and admin updates.
- Store detail accepts either a MongoDB ID or slug.
- Category detail accepts either a MongoDB ID or slug.
- Product detail accepts a MongoDB ID, old `legacyId`, or product slug. MongoDB `_id` is preferred.
- Prices are integer naira values. Do not multiply them by 100 in the frontend. Paystack conversion to kobo happens inside the payment service.

## Authentication and roles

Protected endpoints require:

```http
Authorization: Bearer ACCESS_TOKEN
```

Access labels used below:

| Label | Meaning |
| --- | --- |
| Public | No token required |
| Authenticated | Any active customer, merchant, rider, or admin account |
| Customer | `role: customer` only |
| Merchant | `role: merchant`; ownership is also checked in the service |
| Rider | `role: rider`; order assignment is also checked |
| Admin | `role: admin` only |

## Response format

Normal JSON response:

```json
{
  "success": true,
  "data": {}
}
```

Paginated response data:

```json
{
  "items": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "pages": 0
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": {}
}
```

Endpoints documented with `204` return no body. Common status codes are:

| Status | Meaning |
| --- | --- |
| `200` | Successful read or update |
| `201` | Resource created |
| `204` | Successful action with no response body |
| `400` | Invalid business operation |
| `401` | Missing, invalid, expired, or revoked token |
| `403` | Valid account without permission |
| `404` | Resource or route not found |
| `409` | State, uniqueness, inventory, cart-store, or transition conflict |
| `422` | Request validation failed |
| `429` | Rate limit exceeded |
| `503` | Database or payment provider is unavailable/not configured |

## Complete endpoint reference

Every path below is relative to `http://localhost:4000/api/v1`, except `/health`.

### Health

| Method and path | Access | Input | Function |
| --- | --- | --- | --- |
| `GET /health` | Public | None | Readiness check; returns service name, MongoDB connection state, and timestamp |

### Authentication

| Method and path | Access | Body | Function |
| --- | --- | --- | --- |
| `POST /auth/register` | Public | `{ name, username, email, password, phone? }` | Creates a customer and returns `{ user, accessToken }` (`201`) |
| `POST /auth/login` | Public | `{ identifier, password }` | Logs in with email or username and returns `{ user, accessToken }` |
| `POST /auth/logout` | Authenticated | None | Increments token version and revokes all existing tokens (`204`) |
| `PATCH /auth/password` | Authenticated | `{ currentPassword, newPassword }` | Changes password and revokes existing tokens (`204`) |

Password rules: 8–72 characters, at least one letter, and at least one number. Usernames are 3–30 letters, numbers, or underscores.

### Users and profile

| Method and path | Access | Query/body | Function |
| --- | --- | --- | --- |
| `GET /users/me` | Authenticated | None | Returns profile plus `ordersCount` |
| `PATCH /users/me` | Authenticated | Any of `{ name?, username?, phone?, avatar? }` | Updates the signed-in profile |
| `PATCH /users/me/notification-settings` | Authenticated | Any of `{ push?, sms?, orderUpdates?, promotions?, deliveryAlerts?, rewards?, appUpdates? }` | Updates notification preferences |
| `GET /users` | Admin | Query: `page?`, `limit?`, `role?`, `search?` | Lists/searches users; `role` can be `customer`, `merchant`, `rider`, or `admin` |
| `PATCH /users/:id/status` | Admin | `{ isActive }` | Activates/deactivates an account and revokes its existing tokens |

### Delivery addresses

All address endpoints are authenticated and automatically scoped to the signed-in user.

| Method and path | Body | Function |
| --- | --- | --- |
| `GET /addresses` | None | Lists the user's addresses, default first |
| `POST /addresses` | `{ label, address, instructions?, latitude?, longitude?, isDefault? }` | Creates an address (`201`) |
| `PATCH /addresses/:id` | Any address fields | Updates the owned address |
| `PATCH /addresses/:id/default` | None | Makes the owned address the default |
| `DELETE /addresses/:id` | None | Deletes the owned address (`204`) |

Latitude must be between `-90` and `90`; longitude must be between `-180` and `180`.

### Categories

| Method and path | Access | Query/body | Function |
| --- | --- | --- | --- |
| `GET /categories` | Public | None | Lists active categories in display order |
| `GET /categories/admin/all` | Admin | None | Lists active and inactive categories |
| `GET /categories/:identifier` | Public | MongoDB ID or slug in path | Returns one category |
| `POST /categories` | Admin | Category body | Creates a category (`201`) |
| `PATCH /categories/:id` | Admin | Partial category body | Updates a category |
| `DELETE /categories/:id` | Admin | None | Deletes an empty category (`204`) |

Category body:

```json
{
  "name": "Rice & Meals",
  "slug": "rice-meals",
  "image": "🍛",
  "backgroundColor": "#FFF3E0",
  "textColor": "#E85A1D",
  "sortOrder": 0,
  "isActive": true
}
```

`slug` is optional when creating or renaming; the service can generate it from the name.

### Stores

| Method and path | Access | Query/body | Function |
| --- | --- | --- | --- |
| `GET /stores` | Public | Query: `page?`, `limit?`, `search?`, `type?`, `isOpen?`, `sort?` | Lists active stores; use `sort=rating` for highest rated |
| `GET /stores/:identifier` | Public | ID/slug; query: `category?`, `tier?` | Returns `{ store, products }`; tier is `popular` or `premium` |
| `POST /stores` | Admin or Merchant | Store body | Creates a store (`201`); merchants become the owner automatically |
| `PATCH /stores/:id` | Admin or owning Merchant | Partial store body | Updates a store |
| `DELETE /stores/:id` | Admin | None | Soft-deletes a store and returns the updated store |

Store body:

```json
{
  "name": "Campus Kitchen",
  "slug": "campus-kitchen",
  "owner": "MONGODB_USER_ID",
  "address": "NSUK Main Gate, Keffi",
  "coverImage": "https://example.com/cover.jpg",
  "logo": "https://example.com/logo.png",
  "openingHours": "8am – 9pm",
  "deliveryTimeMinutes": 25,
  "deliveryFee": 300,
  "type": "MAIN DISH",
  "isOpen": true,
  "isActive": true
}
```

`owner` is honored only for administrators. Merchant updates cannot transfer store ownership.

### Products and product reviews

| Method and path | Access | Query/body | Function |
| --- | --- | --- | --- |
| `GET /products` | Public | Query: `page?`, `limit?`, `search?`, `store?`, `category?`, `tier?`, `minPrice?`, `maxPrice?`, `sort?` | Lists available products with populated store/category |
| `GET /products/:id` | Public | MongoDB ID, old `legacyId`, or slug | Returns product detail |
| `GET /products/:productId/reviews` | Public | Query: `page?`, `limit?` | Lists visible product reviews with user name/avatar |
| `POST /products` | Admin or Merchant | Product body | Creates a product (`201`) |
| `PATCH /products/:id` | Admin or owning Merchant | Partial product body | Updates a product |
| `DELETE /products/:id` | Admin or owning Merchant | None | Sets `isAvailable` to false and returns the product |

Product filters:

- `store`: MongoDB store ID or store slug.
- `category`: MongoDB category ID, category slug, or exact category name.
- `tier`: `popular` or `premium`.
- `sort`: `price_asc`, `price_desc`, or omit for popular/newest ordering.
- `minPrice` and `maxPrice`: integer naira amounts.

Product body:

```json
{
  "store": "MONGODB_STORE_ID",
  "category": "MONGODB_CATEGORY_ID",
  "name": "Jollof Rice",
  "slug": "jollof-rice",
  "description": "Smoky party jollof rice.",
  "ingredients": ["rice", "tomatoes", "spices"],
  "nutritionalFacts": {
    "calories": 520,
    "servingSize": "1 plate"
  },
  "price": 3000,
  "image": "https://example.com/jollof.jpg",
  "emoji": "🍛",
  "unit": "Plate",
  "isPopular": true,
  "isPremium": false,
  "isAvailable": true,
  "inventory": null
}
```

Use `inventory: null` for unlimited/not-tracked inventory or a non-negative integer for tracked stock.

### Favorites

All favorite endpoints are authenticated.

| Method and path | Body | Function |
| --- | --- | --- |
| `GET /favorites` | None | Lists favorite products with store and category |
| `PUT /favorites/:productId` | None | Adds the product if it is not already a favorite (`201`) |
| `DELETE /favorites/:productId` | None | Removes the favorite (`204`) |

### Cart

All cart endpoints are authenticated. Every cart response contains `store`, populated `items`, `promo`, `subtotal`, `deliveryFee`, `discount`, and `total`.

| Method and path | Body | Function |
| --- | --- | --- |
| `GET /cart` | None | Gets or initializes the current user's cart |
| `POST /cart/items` | `{ productId, quantity?, replaceExistingStore? }` | Adds/increments a product and returns the cart (`201`) |
| `PATCH /cart/items/:productId` | `{ quantity }` | Replaces the cart-item quantity (1–99) |
| `DELETE /cart/items/:productId` | None | Removes one item and returns the cart |
| `DELETE /cart` | None | Clears items, store, and promo (`204`) |
| `POST /cart/promo` | `{ code }` | Validates/applies a promo and returns recalculated totals |
| `DELETE /cart/promo` | None | Removes the promo and returns recalculated totals |

When adding a product from another store, the API returns `409` with `details.code: "CART_STORE_CONFLICT"`. Ask the user before retrying with `replaceExistingStore: true`, because that retry clears the old cart.

### Promotions

All promotion endpoints require authentication.

| Method and path | Access | Body | Function |
| --- | --- | --- | --- |
| `POST /promos/validate` | Authenticated | `{ code, subtotal }` | Previews promo validity and returns `{ promo, discount }` |
| `GET /promos` | Admin | None | Lists all promos, including inactive templates |
| `POST /promos` | Admin | Promo body | Creates a promo (`201`) |
| `PATCH /promos/:id` | Admin | Partial promo body | Updates a promo |
| `DELETE /promos/:id` | Admin | None | Permanently deletes a promo (`204`) |

Promo body:

```json
{
  "owner": null,
  "code": "NSUKFRESH",
  "description": "Save ₦150",
  "discountType": "fixed",
  "discountValue": 150,
  "minimumSubtotal": 1000,
  "maximumDiscount": null,
  "startsAt": "2026-09-13T00:00:00.000Z",
  "expiresAt": "2030-12-31T23:59:59.999Z",
  "usageLimit": null,
  "perUserLimit": 1,
  "isActive": true
}
```

For percentage promos, `discountValue` is the percentage, such as `10` for 10%. `owner` may be a user ID for an account-scoped code. Checkout always validates against the real server subtotal, even if the frontend called `/promos/validate` first.

### Orders, tracking, reorder, and chat

| Method and path | Access | Query/body | Function |
| --- | --- | --- | --- |
| `GET /orders` | Authenticated | Query: `page?`, `limit?`, `status?`, `store?` | Returns role-scoped order history |
| `POST /orders` | Customer | `{ addressId, paymentMethod }` | Creates an order from the current cart (`201`) |
| `GET /orders/:id` | Order participant/admin | None | Returns order, store, rider, customer, totals, and timeline |
| `POST /orders/:id/reorder` | Customer owner | None | Replaces the cart with currently available products from this order; returns added/unavailable counts and cart |
| `PATCH /orders/:id/cancel` | Customer owner | `{ reason }` | Cancels an unpaid order while it is pending/confirmed |
| `PATCH /orders/:id/status` | Admin, owning Merchant, assigned Rider | `{ status, note? }` | Performs an allowed state transition |
| `PATCH /orders/:id/rider` | Admin | `{ riderId }` | Assigns an active rider |
| `GET /orders/:id/messages` | Order participant/admin | None | Lists messages and marks them read |
| `POST /orders/:id/messages` | Order participant/admin | `{ message }` | Sends a message up to 2,000 characters (`201`) |

`paymentMethod` must be one of `card`, `wallet`, or `cash`.

Order statuses:

```text
pending -> confirmed -> preparing -> ready_for_pickup -> on_the_way -> delivered
```

Cancellation is allowed only from supported stages. Merchants manage confirmation/preparation/pickup readiness. Assigned riders manage `on_the_way` and `delivered`. Admins can perform any legal transition. A paid order must be refunded instead of using the customer cancellation endpoint.

### Payments

| Method and path | Access | Body | Function |
| --- | --- | --- | --- |
| `GET /payments` | Authenticated | None | Lists payments belonging to the signed-in user |
| `POST /payments/initialize` | Authenticated order owner | `{ orderId, callbackUrl? }` | Creates/returns a payment (`201`) |
| `GET /payments/:reference/verify` | Authenticated payment owner | None | Verifies a Paystack payment; already-successful payments return immediately |
| `POST /payments/:reference/refund` | Admin | `{ reason? }` | Refunds a successful mock, wallet, or Paystack payment |
| `POST /payments/webhook/paystack` | Public Paystack webhook | Raw JSON plus `x-paystack-signature` | Processes signed `charge.success` events; returns `200` |

Behavior by order payment method:

| Method | Behavior |
| --- | --- |
| `card` with `PAYMENT_PROVIDER=mock` | Payment becomes `successful` immediately for local development |
| `card` with `PAYMENT_PROVIDER=paystack` | Response includes `authorizationUrl`; redirect/open it, then verify the returned reference |
| `wallet` | Wallet is atomically debited and payment becomes successful immediately |
| `cash` | Creates a cash payment record that remains initialized/pending until an operational payment update is added |

Do not send card details to this API. For Paystack, configure the provider's webhook URL as:

```text
https://YOUR_API_DOMAIN/api/v1/payments/webhook/paystack
```

### Reviews

| Method and path | Access | Body | Function |
| --- | --- | --- | --- |
| `POST /reviews` | Customer | `{ order, product, rating, comment? }` | Creates a verified delivered-purchase review (`201`) |
| `DELETE /reviews/:id` | Review owner or Admin | None | Deletes a review (`204`) |

Use `GET /products/:productId/reviews?page=1&limit=20` to display reviews. Rating is an integer from 1 to 5; comment length is at most 1,000 characters.

### Rewards

| Method and path | Access | Body | Function |
| --- | --- | --- | --- |
| `GET /rewards` | Public | None | Lists active rewards, lowest point cost first |
| `GET /rewards/me/redemptions` | Authenticated | None | Lists the current user's claimed rewards and promo codes |
| `POST /rewards/:id/redeem` | Authenticated | None | Deducts points and claims a reward (`201`) |
| `POST /rewards` | Admin | Reward body | Creates a reward (`201`) |
| `PATCH /rewards/:id` | Admin | Partial reward body | Updates a reward |
| `DELETE /rewards/:id` | Admin | None | Soft-deletes a reward and returns it |

Reward body:

```json
{
  "name": "₦500 Off Delivery",
  "description": "Valid for orders above ₦1,500",
  "pointsCost": 500,
  "promo": "OPTIONAL_PROMO_TEMPLATE_ID",
  "image": "https://example.com/reward.png",
  "isActive": true
}
```

When a reward has a promo template, redemption returns `claimedPromo.code`. Use that code with `POST /cart/promo`.

### Notifications

All notification endpoints are authenticated and user-scoped.

| Method and path | Query/body | Function |
| --- | --- | --- |
| `GET /notifications` | Query: `page?`, `limit?`, `unread?` | Returns `{ items, unreadCount, meta }`; use `unread=true` to filter |
| `PATCH /notifications/read-all` | None | Marks all notifications read (`204`) |
| `PATCH /notifications/:id/read` | None | Marks one owned notification read and returns it |

### FAQs

| Method and path | Access | Body | Function |
| --- | --- | --- | --- |
| `GET /faqs` | Public | None | Lists active FAQs in display order |
| `GET /faqs/admin/all` | Admin | None | Lists active and inactive FAQs |
| `POST /faqs` | Admin | FAQ body | Creates an FAQ (`201`) |
| `PATCH /faqs/:id` | Admin | Partial FAQ body | Updates an FAQ |
| `DELETE /faqs/:id` | Admin | None | Permanently deletes an FAQ (`204`) |

FAQ body:

```json
{
  "question": "How do I track an order?",
  "answer": "Open Profile, select My Orders, and open the active order.",
  "category": "Orders",
  "sortOrder": 1,
  "isActive": true
}
```

## Frontend screen-to-endpoint map

| Frontend screen/feature | Endpoints to connect |
| --- | --- |
| App bootstrap/session | `POST /auth/login`, `GET /users/me` |
| Home | `GET /stores?sort=rating`, `GET /products?tier=popular`, `GET /categories` |
| Search | `GET /stores?search=...`, `GET /products?search=...` |
| Categories | `GET /categories`, then `GET /products?category=CATEGORY_SLUG` |
| Shop by store | `GET /stores?type=...&isOpen=true` |
| Merchant/store page | `GET /stores/:slug`; add `category` or `tier` query when tabs change |
| Product details | `GET /products/:id`, `GET /products/:id/reviews` |
| Favorite toggle/list | `PUT /favorites/:productId`, `DELETE /favorites/:productId`, `GET /favorites` |
| Cart badge and page | `GET /cart`, `POST/PATCH/DELETE /cart/items...`, `DELETE /cart` |
| Promo input | `POST /cart/promo`, `DELETE /cart/promo` |
| Checkout addresses | `GET /addresses`, address CRUD/default endpoints |
| Place order | `POST /orders` using selected address and payment method |
| Card/wallet/cash payment | `POST /payments/initialize`; Paystack card flow also uses `GET /payments/:reference/verify` |
| Order confirmation/tracking | `GET /orders/:id`; poll while active or refresh after a notification |
| Rider chat | `GET /orders/:id/messages`, `POST /orders/:id/messages` |
| Order history | `GET /orders?status=...`, `POST /orders/:id/reorder` |
| Review purchased product | `POST /reviews`, `DELETE /reviews/:id` |
| Profile | `GET /users/me`, `PATCH /users/me` |
| Rewards | `GET /rewards`, `GET /rewards/me/redemptions`, `POST /rewards/:id/redeem` |
| Notification preferences | `GET /users/me`, `PATCH /users/me/notification-settings` |
| Notification inbox | `GET /notifications`, mark-one/all-read endpoints |
| FAQ | `GET /faqs` |
| Logout | `POST /auth/logout`, then remove the local token |

## Checkout and payment flow

The frontend should use this order:

1. Load `GET /cart` and block checkout if `items` is empty.
2. Load `GET /addresses` and let the user select or create an address.
3. Optionally apply a promo with `POST /cart/promo`.
4. Create the order with `POST /orders`:

```json
{
  "addressId": "MONGODB_ADDRESS_ID",
  "paymentMethod": "card"
}
```

5. Save the returned order `_id`; the cart is now cleared.
6. Initialize payment:

```json
{
  "orderId": "MONGODB_ORDER_ID",
  "callbackUrl": "http://localhost:3000/order-confirmation"
}
```

7. Handle the provider:
   - Mock or wallet: payment is already successful; navigate to order confirmation.
   - Cash: navigate to confirmation and show payment as pending/cash.
   - Paystack: open `authorizationUrl`; after redirect, read Paystack's `reference` query parameter and call `GET /payments/:reference/verify`.
8. Load `GET /orders/:id` for the authoritative order, payment, rider, and timeline state.
9. Refresh/poll active orders with a reasonable interval such as 10–20 seconds. Stop polling after `delivered` or `cancelled`.

The frontend must never calculate or submit authoritative subtotal, delivery fee, discount, or total. Those values come from `GET /cart` and the created order.

## Important business rules

- All IDs used for mutations must be MongoDB `_id` values returned by the API.
- One cart can contain products from only one store.
- One user can have only one cart.
- One order can have only one payment record.
- One user can favorite a product only once.
- One customer can review the same product/order combination only once.
- A reward can be claimed once per user.
- Reward-generated promos belong only to the user who claimed them.
- Finite inventory is reserved during order creation, not when an item is added to a cart.
- Prices and delivery fees are trusted only from MongoDB.
- Paid orders require the refund endpoint before cancellation.
- Password changes, logout, account deactivation, and reactivation invalidate earlier tokens.
- Merchant and rider permissions are checked against actual store ownership/order assignment, not just the JWT role.
- `DELETE` is not always a hard delete: stores, products, and rewards are disabled so historical records remain valid.

## Testing

Run backend unit and integration tests:

```powershell
npm run test:api
```

The integration suite starts its own in-memory MongoDB database. It does not use or erase the database configured in `.env`.

Run backend-only linting:

```powershell
npx eslint server
```

Run the frontend production build:

```powershell
npm run build
```
