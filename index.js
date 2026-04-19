const express = require("express");
const pool = require("./db");
const redisClient = require("./redis");

// 🔥 NEW: import query functions
const {
    getStats,
    getTopCustomers,
    getTopProducts
} = require("./queries/analytics");

const app = express();


// =======================
// TOP CUSTOMERS
// =======================
app.get('/top-customers/monthly', async (req, res) => {
    try {
        const { month, limit } = req.query;
        const topN = limit ? parseInt(limit) : 2;

        let values = [topN];
        if (month) values.push(month + '-01');

        // 🔥 using function
        const result = await getTopCustomers(pool, values, month);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("DB Error");
    }
});


// =======================
// TOP PRODUCTS
// =======================
app.get('/top-products/monthly', async (req, res) => {
    try {
        const { month, limit } = req.query;
        const topN = limit && !isNaN(parseInt(limit)) ? parseInt(limit) : 2;

        let values = [topN];
        if (month) values.push(month + '-01');

        // 🔥 using function
        const result = await getTopProducts(pool, values, month);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("DB error");
    }
});


// =======================
// DASHBOARD (WITH REDIS)
// =======================
app.get('/dashboard', async (req, res) => {
    try {
        const { month, limit } = req.query;
        const topN = limit && !isNaN(parseInt(limit)) ? parseInt(limit) : 2;

        const key = req.originalUrl;

        // 🔥 Redis cache check
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            return res.json({
                success: true,
                source: "redis",
                data: JSON.parse(cachedData)
            });
        }

        let values = [topN];
        if (month) values.push(month + '-01');

        // 🔥 using functions
        const stats = await getStats(pool);
        const customers = await getTopCustomers(pool, values, month);
        const products = await getTopProducts(pool, values, month);

        const responseData = {
            stats: stats.rows[0],
            top_customers: customers.rows,
            top_products: products.rows
        };

        // 🔥 store in Redis (TTL = 10 sec)
        await redisClient.setEx(
            key,
            10,
            JSON.stringify(responseData)
        );

        res.json({
            success: true,
            source: "db",
            data: responseData
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("DB error");
    }
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});