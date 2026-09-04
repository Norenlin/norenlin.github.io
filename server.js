const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

// ==========================
// MySQL 連線
// ==========================

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================
// 測試後端 + MySQL
// ==========================

app.get("/api/test", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            success: true,
            message: "後端與 MySQL 連線成功！"
        });

    } catch (error) {
        console.error("MySQL 錯誤：", error);

        res.status(500).json({
            success: false,
            message: "MySQL 連線失敗"
        });
    }
});

// ==========================
// 取得所有商品
// ==========================

app.get("/api/products", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM products ORDER BY id"
        );

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error("取得商品錯誤：", error);

        res.status(500).json({
            success: false,
            message: "取得商品失敗"
        });
    }
});

// ==========================
// 取得單一商品
// ==========================

app.get("/api/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const [rows] = await pool.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "找不到商品"
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error("取得商品錯誤：", error);

        res.status(500).json({
            success: false,
            message: "取得商品失敗"
        });
    }
});

// ==========================
// 新增商品
// ==========================

app.post("/api/products", async (req, res) => {
    try {
        const {
            name,
            price,
            image,
            description
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "商品名稱不能為空"
            });
        }

        if (price === undefined || price === "") {
            return res.status(400).json({
                success: false,
                message: "商品價格不能為空"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO products
            (name, price, image, description)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                Number(price),
                image || "",
                description || ""
            ]
        );

        res.status(201).json({
            success: true,
            message: "商品新增成功",
            data: {
                id: result.insertId,
                name,
                price: Number(price),
                image: image || "",
                description: description || ""
            }
        });

    } catch (error) {
        console.error("新增商品錯誤：", error);

        res.status(500).json({
            success: false,
            message: "新增商品失敗"
        });
    }
});

// ==========================
// 修改商品
// ==========================

app.put("/api/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const {
            name,
            price,
            image,
            description
        } = req.body;

        const [result] = await pool.query(
            `UPDATE products
             SET name = ?,
                 price = ?,
                 image = ?,
                 description = ?
             WHERE id = ?`,
            [
                name,
                Number(price),
                image,
                description,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "找不到商品"
            });
        }

        res.json({
            success: true,
            message: "商品修改成功"
        });

    } catch (error) {
        console.error("修改商品錯誤：", error);

        res.status(500).json({
            success: false,
            message: "商品修改失敗"
        });
    }
});

// ==========================
// 刪除商品
// ==========================

app.delete("/api/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const [result] = await pool.query(
            "DELETE FROM products WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "找不到商品"
            });
        }

        res.json({
            success: true,
            message: "商品刪除成功"
        });

    } catch (error) {
        console.error("刪除商品錯誤：", error);

        res.status(500).json({
            success: false,
            message: "商品刪除失敗"
        });
    }
});

// ==========================
// 啟動伺服器
// ==========================

app.listen(PORT, () => {
    console.log("==============================");
    console.log("咖啡網站後端啟動成功！");
    console.log(`網站：http://localhost:${PORT}`);
    console.log(`商品 API：http://localhost:${PORT}/api/products`);
    console.log("==============================");
});