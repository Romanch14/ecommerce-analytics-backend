const getStats = async (pool) => {
    const query = `
        SELECT 
            SUM(total_amount) AS total_revenue,
            COUNT(order_id) AS total_orders
        FROM orders
    `;
    return await pool.query(query);
};

const getTopCustomers = async (pool, values, month) => {
    let query = `
    SELECT * FROM (
        SELECT
            u.user_id,
            u.first_name,
            DATE_TRUNC('month', o.order_date) AS months,
            SUM(o.total_amount) AS amount,
            RANK() OVER (
                PARTITION BY DATE_TRUNC('month', o.order_date)
                ORDER BY SUM(o.total_amount) DESC
            ) AS rnk
        FROM users u
        JOIN orders o ON o.user_id = u.user_id
        GROUP BY u.user_id, u.first_name, DATE_TRUNC('month', o.order_date)
    ) t
    WHERE rnk <= $1
    `;

    if (month) {
        query += ` AND months = $2`;
    }

    query += ` ORDER BY months DESC, amount DESC`;

    return await pool.query(query, values);
};

const getTopProducts = async (pool, values, month) => {
    let query = `
    SELECT * FROM (
        SELECT 
            oi.product_id,
            p.product_name,
            DATE_TRUNC('month', o.order_date) AS months,
            SUM(oi.quantity * oi.price) AS revenue,
            RANK() OVER (
                PARTITION BY DATE_TRUNC('month', o.order_date)
                ORDER BY SUM(oi.quantity * oi.price) DESC
            ) AS rnk
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        JOIN orders o ON o.order_id = oi.order_id
        GROUP BY oi.product_id, p.product_name, DATE_TRUNC('month', o.order_date)
    ) t
    WHERE rnk <= $1
    `;

    if (month) {
        query += ` AND months = $2`;
    }

    query += ` ORDER BY months DESC, revenue DESC`;

    return await pool.query(query, values);
};

module.exports = {
    getStats,
    getTopCustomers,
    getTopProducts
};