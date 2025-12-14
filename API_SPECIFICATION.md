# API & Data Specification
This document outlines the required data contracts and API endpoints (or Cloud Functions) needed to power the "The Productive House" e-commerce application.

## 1. Products API
**Core Logic**: Manages the product catalog.

### `GET /products` (List Products)
- **Use Case**: Shop page, Search, Admin List.
- **Input (Query Params)**:
  - `page` (number): Pagination.
  - `limit` (number): Items per page.
  - `category` (string, optional): Filter by category ID.
  - `search` (string, optional): Keyword search.
  - `sort` (string, optional): `price_asc`, `price_desc`, `date_desc`.
- **Output**:
  ```json
  {
    "data": [
      {
        "id": "prod_123",
        "name": "Daily Planner 2025",
        "price": 29.99,
        "image": "https://...",
        "category": "Planners",
        "stock": 150,
        "isNew": true
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "pages": 5
    }
  }
  ```

### `GET /products/:id` (Get Product Details)
- **Use Case**: Single Product Page.
- **Input**: `id` (path param)
- **Output**:
  ```json
  {
    "id": "prod_123",
    "name": "Daily Planner 2025",
    "description": "Full Markdown description...",
    "price": 29.99,
    "images": ["url1", "url2"],
    "specifications": { "pages": 200, "size": "A5" },
    "stock": 150,
    "relatedProducts": ["prod_456", "prod_789"]
  }
  ```

### `POST /products` (Create Product) [Admin Only]
- **Input**:
  ```json
  {
    "name": "New Journal",
    "description": "Description...",
    "price": 19.99,
    "categoryId": "cat_journals",
    "stock": 100,
    "images": ["url1"]
  }
  ```
- **Output**: `201 Created` with `{ "id": "prod_new_123" }`

### `PUT /products/:id` (Update Product) [Admin Only]
- **Input**: Partial product object.
- **Output**: `200 OK` with updated object.

---

## 2. Orders API
**Core Logic**: Handling checkout and order lifecycle.

### `POST /orders` (Create Order / Checkout)
- **Use Case**: User places an order.
- **Input**:
  ```json
  {
    "userId": "user_123",
    "items": [
      { "productId": "prod_123", "quantity": 2 }
    ],
    "shippingAddress": {
      "name": "John Doe",
      "street": "123 Main St",
      "city": "London",
      "zip": "SW1A 1AA",
      "country": "UK"
    },
    "paymentMethod": "stripe",
    "paymentToken": "tok_123" // Or generic payment intent ID
  }
  ```
- **Output**:
  ```json
  {
    "orderId": "ORD-998877",
    "status": "Processing",
    "total": 64.98
  }
  ```

### `GET /orders/my-orders` (User History)
- **Use Case**: Profile > Order History.
- **Input**: `userId` (from Auth token).
- **Output**:
  ```json
  [
    {
      "id": "ORD-998877",
      "date": "2025-12-11T10:00:00Z",
      "total": 64.98,
      "status": "Processing",
      "itemCount": 2
    }
  ]
  ```

### `GET /orders/:id` (Order Details)
- **Use Case**: Order Confirmation / Details View.
- **Input**: `id` (path param).
- **Output**: Full order object (Items, Address, Status Logs).

### `PATCH /admin/orders/:id/status` (Update Status) [Admin Only]
- **Input**:
  ```json
  {
    "status": "Shipped", // Delivered, Cancelled
    "trackingNumber": "TRK123456" // Optional
  }
  ```
- **Output**: `200 OK`

---

## 3. Users API
**Core Logic**: Customer management.

### `POST /users/profile` (Sync/Update Profile)
- **Use Case**: On Signup or Edit Profile.
- **Input**:
  ```json
  {
    "displayName": "John Doe",
    "phone": "+44 7000 000000"
  }
  ```
- **Output**: `200 OK`

### `GET /admin/customers` (List Customers) [Admin Only]
- **Input**: Pagination query params.
- **Output**:
  ```json
  {
    "data": [
      {
        "id": "user_123",
        "email": "john@example.com",
        "name": "John Doe",
        "totalOrders": 5,
        "totalSpent": 450.00,
        "status": "Active"
      }
    ]
  }
  ```

---

## 4. Analytics API [Admin Only]
**Core Logic**: Populating the Admin Dashboard.

### `GET /admin/stats`
- **Output**:
  ```json
  {
    "revenue": { "total": 15400, "growth": 12.5 },
    "activeOrders": 45,
    "customers": { "total": 1200, "newThisMonth": 150 },
    "lowStockProducts": 3
  }
  ```

### `GET /admin/stats/sales-chart`
- **Input**: `period` (last_7_days, last_30_days, year_to_date).
- **Output**:
  ```json
  [
    { "date": "2025-12-01", "sales": 1200 },
    { "date": "2025-12-02", "sales": 1500 }
  ]
  ```
