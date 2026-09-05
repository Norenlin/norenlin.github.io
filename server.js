const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------------------------Express 設定--------------------------------------------

// 讓後端可以讀取 JSON
app.use(express.json());

// 讓 HTML、CSS、JS、圖片可以正常使用
app.use(express.static("."));

// MySQL 資料庫連線
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {rejectUnauthorized: false},
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 測試後端 + MySQL
app.get("/api/test", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({
            success: true, 
            message: "後端與 MySQL 連線成功！"
        });
    } 
    catch (error) {
        console.error("MySQL 連線錯誤：", error);
        res.status(500).json({
            success: false, 
            message: "MySQL 連線失敗"
        });
    }
});

// -----------------------------------------------------商品 API-------------------------------------------

// 取得所有商品
// GET /api/products
app.get("/api/products", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products ORDER BY id");
        res.json({
            success: true, 
            data: rows
        });
    } 
    catch (error) {
        console.error("取得商品錯誤：", error);
        res.status(500).json({
            success: false, 
            message: "取得商品失敗"
        });
    }
});


// 取得單一商品
// GET /api/products/:id
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
        res.json({success: true, data: rows[0]});
    } 
    catch (error) {
        console.error("取得單一商品錯誤：", error);
        res.status(500).json({
            success: false, 
            message: "取得商品失敗"
        });
    }
});

// 新增商品
// POST /api/products
app.post("/api/products", async (req, res) => {
    try {
        const {
            name, 
            price, 
            image, 
            description
        } = req.body;

        // 檢查商品名稱
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "商品名稱不能為空"
            });
        }

        // 檢查價格
        if (price === undefined || price === "") {
            return res.status(400).json({
                success: false, 
                message: "商品價格不能為空"});
        }

        // 新增到 MySQL
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
                name: name,
                price: Number(price),
                image: image || "",
                description: description || ""
            }
        });
    } 
    catch (error) {
        console.error("新增商品錯誤：", error);
        res.status(500).json({
            success: false, 
            message: "商品新增失敗"
        });
    }
});

// 修改商品
// PUT /api/products/:id
app.put("/api/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const {
            name,
            price,
            image,
            description
        } = req.body;

        // 先確認商品存在
        const [existing] = await pool.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "找不到商品"
            });

        }


        // 修改商品
        await pool.query(
            `UPDATE products
             SET name = ?,
                 price = ?,
                 image = ?,
                 description = ?
             WHERE id = ?`,
            [
                name,
                Number(price),
                image || "",
                description || "",
                id
            ]
        );


        // 取得修改後的資料
        const [rows] = await pool.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );


        res.json({

            success: true,

            message: "商品修改成功",

            data: rows[0]

        });

    } catch (error) {

        console.error("修改商品錯誤：", error);

        res.status(500).json({
            success: false,
            message: "商品修改失敗"
        });

    }

});


// ----------------------------------------
// 刪除商品
// DELETE /api/products/:id
// ----------------------------------------

app.delete("/api/products/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);


        // 先確認商品存在
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

        // 刪除商品
        await pool.query(
            "DELETE FROM products WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "商品刪除成功",
            data: rows[0]
        });
    } 
    catch (error) {
        console.error("刪除商品錯誤：", error);
        res.status(500).json({
            success: false,
            message: "商品刪除失敗"
        });
    }
});

// ---------------------------------------------會員 API------------------------------------------------
// 會員註冊
// POST /api/register
app.post("/api/register", async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        // 檢查帳號密碼
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "帳號和密碼不能為空"
            });
        }

        // 檢查帳號長度
        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: "帳號至少需要 3 個字元"
            });
        }

        // 檢查密碼長度
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "密碼至少需要 6 個字元"
            });
        }

        // 檢查帳號是否已存在
        const [existingUsers] = await pool.query(
            "SELECT id FROM users WHERE username = ?",
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: "這個帳號已經存在"
            });
        }

        // 使用 bcrypt 加密密碼
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // 寫入 MySQL
        const [result] = await pool.query(
            `INSERT INTO users
            (username, password)
            VALUES (?, ?)`,
            [
                username,
                hashedPassword
            ]
        );

        res.status(201).json({
            success: true,
            message: "註冊成功",
            user: {
                id: result.insertId,
                username: username
            }
        });

    } 
    catch (error) {
        console.error("註冊錯誤：", error);
        res.status(500).json({
            success: false,
            message: "註冊失敗"
        });
    }
});

// 會員登入
// POST /api/login
app.post("/api/login", async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        // 檢查資料
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "帳號和密碼不能為空"
            });
        }

        // 從 MySQL 找使用者
        const [users] = await pool.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        // 找不到帳號
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "帳號或密碼錯誤"
            });
        }

        const user = users[0];

        // 比對密碼
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        // 密碼錯誤
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "帳號或密碼錯誤"
            });
        }

        // 登入成功
        res.json({
            success: true,
            message: "登入成功",
            user: {
                id: user.id,
                username: user.username
            }
        });
    } 
    catch (error) {
        console.error("登入錯誤：", error);
        res.status(500).json({
            success: false,
            message: "登入失敗"
        });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log("==============================");
    console.log("咖啡網站後端啟動成功！");
    console.log(`網站：http://localhost:${PORT}`);
    console.log(`商品 API：http://localhost:${PORT}/api/products`);
    console.log(`登入 API：http://localhost:${PORT}/api/login`);
    console.log(`註冊 API：http://localhost:${PORT}/api/register`);
    console.log("==============================");
});