# JSM NestJS API

A NestJS REST API for managing users, products, and orders. The application uses
MongoDB through Mongoose and is organized into feature modules.

## Requirements

- Node.js and npm
- A MongoDB instance, local or hosted

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root. Do not commit this file.

   ```dotenv
   MONGODB_URI=mongodb://127.0.0.1:27017/jsm_nestjs
   SECRET_KEY=replace-with-a-private-api-key
   ADMIN_USER_TYPE=admin
   PORT=3000
   ```

   `MONGODB_URI` is required. `PORT` is optional and defaults to `3000`.
   `SECRET_KEY` is the expected API key for user routes, and
   `ADMIN_USER_TYPE` is the role value required to delete a user.

3. Start the API:

   ```bash
   # Development
   npm run start:dev

   # Standard start
   npm run start

   # Production (after building)
   npm run build
   npm run start:prod
   ```

The API listens on `http://localhost:3000` unless `PORT` is set to another
value.

## Project structure

```text
src/
├── main.ts                  # Application bootstrap, global validation,
│                            # response interceptor, CORS, and port
├── app.module.ts            # Root module, configuration, MongoDB, middleware
├── app.controller.ts        # Root welcome route
├── guards/
│   └── role.guard.ts        # Role check for user deletion
├── middleware/
│   └── api-key.middleware.ts # API-key check for user routes
├── user/                    # User controller, service, schema, and DTOs
├── product/                 # Product controller, service, schema, and DTOs
├── orders/                  # Order controller, service, schema, and DTOs
└── utils/
    └── transform.interceptor.ts # Standard success response envelope
test/                        # End-to-end test and Jest configuration
```

Each feature module groups its controller (HTTP routes), service (business
logic), and Mongoose schema. DTOs define and validate incoming request data.

## API

All successful responses are wrapped in this shape:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {}
}
```

The `data` value contains the route's result. Errors use NestJS HTTP error
responses.

### Root

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/` | Returns the default welcome message |

### Users

All `/user` routes require the `x-api-key` header to match `SECRET_KEY`.
Deleting a user also requires the `role` header to match `ADMIN_USER_TYPE`.

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/user` | List users; optionally filter by the `name` query parameter |
| `GET` | `/user/:id` | Get a user by MongoDB ID |
| `POST` | `/user` | Create a user |
| `PUT` | `/user/:id` | Replace a user's fields |
| `PATCH` | `/user/:id` | Partially update a user |
| `DELETE` | `/user/:id` | Delete a user (requires the configured role) |

Create-user request:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
```

`name` must be a string with at least 3 characters; `email` must be a valid
email address. The `name` query filter is case-insensitive.

Example:

```bash
curl -H "x-api-key: replace-with-a-private-api-key" \
  "http://localhost:3000/user?name=ada"
```

For user deletion, also send `-H "role: admin"` (using the configured
`ADMIN_USER_TYPE` value).

### Products

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/product` | List products |
| `GET` | `/product/:id` | Get a product by MongoDB ID |
| `POST` | `/product` | Create a product |
| `PUT` | `/product/:id` | Update a product |
| `DELETE` | `/product/:id` | Delete a product |

Product creation requires `name`, `price`, `stock`, `category`, and
`description`. `name` must be a string of at least 3 characters; `price` and
`stock` must be numbers; `category` and `description` must be strings. The product schema requires a non-negative
price and defines a default stock of `0`; the create DTO still requires the
`stock` field in the request.
Product routes do not use the user API-key middleware.

Example request:

```json
{
  "name": "Notebook",
  "price": 4.5,
  "stock": 25,
  "category": "Stationery",
  "description": "A ruled notebook"
}
```

### Orders

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/orders` | List orders, with user and product references populated |
| `GET` | `/orders/:id` | Get one populated order by MongoDB ID |
| `POST` | `/orders` | Create an order |

Order creation requires a MongoDB `userId` and at least one item. Each item
requires a MongoDB `productId` and an integer `quantity` of at least `1`. The
server looks up each product, records its current price on the order, and
calculates `totalAmount` from item prices and quantities. New orders start
with `pending` status.

Example request:

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ]
}
```

Order routes do not use the user API-key middleware.

## Validation and tests

Request DTOs are checked with NestJS's global `ValidationPipe`. The application
enables CORS for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.

```bash
# Unit tests
npm test

# End-to-end tests
npm run test:e2e

# Coverage
npm run test:cov

# Lint
npm run lint
```

## Configuration and security notes

- Keep `.env` out of version control and use strong, unique values for
  `SECRET_KEY` and `ADMIN_USER_TYPE`.
- The API-key middleware currently protects user routes only. Product and
  order routes do not have authentication configured.
- The role guard checks a request header; it is a simple role gate, not a
  complete authentication or authorization system.
