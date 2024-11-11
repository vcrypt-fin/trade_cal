# Backend API Documentation

Welcome to the Backend API documentation for the Trade Management System. This API allows you to manage trades and playbooks, including importing trades from CSV files and integrating with brokerages like Tradeovate.

---

## Table of Contents

- [Backend API Documentation](#backend-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Base URL](#base-url)
  - [Endpoints](#endpoints)
    - [Trades](#trades)
      - [Get All Trades](#get-all-trades)
      - [Add a Single Trade](#add-a-single-trade)
      - [Add Multiple Trades (Bulk)](#add-multiple-trades-bulk)
      - [Edit a Trade](#edit-a-trade)
    - [Playbooks](#playbooks)
      - [Get All Playbooks](#get-all-playbooks)
      - [Add a Playbook](#add-a-playbook)
    - [Clear All Data](#clear-all-data)
  - [Data Models](#data-models)
    - [Trade](#trade)
    - [Playbook](#playbook)
  - [Error Handling](#error-handling)
  - [CORS](#cors)
  - [Quick Start](#quick-start)

---

## Base URL

All API endpoints are prefixed with the base URL:

```
https://your-domain.com/api
```

*Replace `https://your-domain.com` with your actual domain.*

---

## Endpoints

### Trades

#### Get All Trades

- **Endpoint:** `/trades`
- **Method:** `GET`
- **Description:** Retrieve a list of all trades.

#### Add a Single Trade

- **Endpoint:** `/trades`
- **Method:** `POST`
- **Description:** Add a new trade.
- **Body Parameters:**
  - `id` (string) - Unique identifier.
  - `orderId` (string) - Unique order ID from brokerage.
  - `symbol` (string) - Trading symbol.
  - `quantity` (number) - Quantity traded.
  - `price` (number) - Trade price.
  - `side` (`Buy` | `Sell`) - Trade side.
  - `createdAt` (string) - ISO date string.

#### Add Multiple Trades (Bulk)

- **Endpoint:** `/trades/bulk`
- **Method:** `POST`
- **Description:** Add multiple trades at once.
- **Body:** Array of trade objects (same structure as single trade).

#### Edit a Trade

- **Endpoint:** `/trades/{tradeId}`
- **Method:** `PUT`
- **Description:** Update an existing trade by `tradeId`.
- **Path Parameters:**
  - `tradeId` (string) - ID of the trade to update.
- **Body:** Trade object with updated fields.

### Playbooks

#### Get All Playbooks

- **Endpoint:** `/playbooks`
- **Method:** `GET`
- **Description:** Retrieve a list of all playbooks.

#### Add a Playbook

- **Endpoint:** `/playbooks`
- **Method:** `POST`
- **Description:** Add a new playbook.
- **Body Parameters:**
  - `name` (string) - Name of the playbook.
  - Other relevant fields as needed.

### Clear All Data

- **Endpoint:** `/clear`
- **Method:** `DELETE`
- **Description:** Remove all trades and playbooks from the system.

---

## Data Models

### Trade

| Field     | Type               | Description                       |
|-----------|--------------------|-----------------------------------|
| id        | `string`           | Unique identifier.                |
| orderId   | `string`           | Unique order ID from brokerage.   |
| symbol    | `string`           | Trading symbol.                   |
| quantity  | `number`           | Quantity traded.                  |
| price     | `number`           | Trade price.                      |
| side      | `Buy` \| `Sell`    | Trade side.                       |
| createdAt | `string` (ISO Date)| Trade creation timestamp.         |
| ...       | `any`              | Additional fields as needed.      |

### Playbook

| Field       | Type               | Description                     |
|-------------|--------------------|---------------------------------|
| id          | `string`           | Unique identifier.              |
| name        | `string`           | Name of the playbook.           |
| createdAt   | `string` (ISO Date)| Playbook creation timestamp.    |
| ...         | `any`              | Additional fields as needed.    |

---

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of an API request.

| Status Code | Description                                     |
|-------------|-------------------------------------------------|
| `200 OK`    | The request was successful.                    |
| `201 Created` | A new resource was successfully created.     |
| `400 Bad Request` | The request was invalid or cannot be served. |
| `404 Not Found` | The requested resource could not be found.  |
| `405 Method Not Allowed` | The HTTP method is not supported. |
| `409 Conflict` | Duplicate resource or conflict occurred.     |
| `500 Internal Server Error` | An unexpected error occurred.   |

**Example Error Response:**

```json
{
  "message": "Trade already exists"
}
```

---

## CORS

Cross-Origin Resource Sharing (CORS) is enabled to allow the frontend to communicate with the backend API.

- **Allowed Origin:** `*` (all origins)

*For enhanced security in production, replace `*` with your frontend's specific domain.*

**CORS Headers Included:**

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

---

## Quick Start

1. **Get All Trades:**

   ```bash
   curl -X GET https://your-domain.com/api/trades
   ```

2. **Add a New Trade:**

   ```bash
   curl -X POST https://your-domain.com/api/trades \
   -H "Content-Type: application/json" \
   -d '{
     "id": "118205681085",
     "orderId": "118205681085",
     "symbol": "MNQU4",
     "quantity": 18,
     "price": 19606.5,
     "side": "Buy",
     "createdAt": "2024-09-02T19:25:28.000Z"
   }'
   ```

3. **Add Multiple Trades:**

   ```bash
   curl -X POST https://your-domain.com/api/trades/bulk \
   -H "Content-Type: application/json" \
   -d '[{...}, {...}]'
   ```

4. **Edit a Trade:**

   ```bash
   curl -X PUT https://your-domain.com/api/trades/118205681085 \
   -H "Content-Type: application/json" \
   -d '{
     "price": 19610.0
   }'
   ```

5. **Get All Playbooks:**

   ```bash
   curl -X GET https://your-domain.com/api/playbooks
   ```

6. **Add a Playbook:**

   ```bash
   curl -X POST https://your-domain.com/api/playbooks \
   -H "Content-Type: application/json" \
   -d '{
     "name": "Gap and Go"
   }'
   ```

7. **Clear All Data:**

   ```bash
   curl -X DELETE https://your-domain.com/api/clear
   ```

---

For further assistance or questions, please contact the development team.