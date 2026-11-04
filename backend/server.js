const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { calcularPuntos } = require("./scoring");

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || "mysql",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "mundial_db"
};

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend corriendo correctamente" });
});

app.post("/api/salas", async (req, res) => {
    const { nombre, codigo } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute("INSERT INTO salas (nombre, codigo_invitacion) VALUES (?, ?)", [nombre, codigo]);
        await connection.end();
        res.json({ success: true, message: "Sala creada con exito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/posiciones", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT id, nombre, puntos_totales, racha_actual FROM usuarios ORDER BY puntos_totales DESC");
        await connection.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor escuchando en puerto " + PORT));
