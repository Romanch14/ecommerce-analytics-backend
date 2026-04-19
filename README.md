# 🚀 Ecommerce Analytics Backend API

## 🧠 Overview
A backend analytics system built using Node.js, PostgreSQL, and Redis.

It provides APIs for:
- Top customers analysis
- Product performance tracking
- Monthly revenue insights
- Dashboard aggregation

Includes query optimization and Redis-based caching with TTL.

---

## ⚙️ Tech Stack

- Node.js  
- Express.js  
- PostgreSQL  
- Redis  

---

## 🚀 Features

- Complex SQL queries using JOINs, GROUP BY, and Window Functions  
- Monthly analytics using DATE_TRUNC  
- Dynamic filtering using query parameters (`month`, `limit`)  
- Redis caching with TTL for performance optimization  
- Clean architecture (API routes + query separation)  
- Query performance optimization using indexing and EXPLAIN ANALYZE  

---

## 📡 API Endpoints

GET /dashboard  
GET /top-customers/monthly  
GET /top-products/monthly  

---

## 📊 Sample Response

{
  "success": true,
  "source": "redis",
  "data": {
    "stats": {
      "total_revenue": 5000,
      "total_orders": 20
    },
    "top_customers": [],
    "top_products": []
  }
}

---

## 🛠️ Setup & Run

1. Install dependencies
npm install

2. Start server
node index.js

---

## 🧪 Testing

Test APIs using browser or Postman:

/dashboard  
/top-customers/monthly?month=2026-03&limit=2  
/top-products/monthly?limit=3  

---

## ⚡ Performance Optimization

- Added indexes for faster query execution  
- Used EXPLAIN ANALYZE to analyze query performance  
- Implemented Redis caching with TTL  

---

## 📌 Future Improvements

- Authentication (JWT)  
- Deployment (Render / Railway)  
- Pagination for large datasets  
- Role-based access control  