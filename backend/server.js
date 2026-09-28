const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------- ROUTES ----------

// 1. CREATE
app.post('/api/opportunities', async (req, res) => {
    try {
        const { title, description, research_area, required_skills,
                available_positions, application_deadline, status } = req.body;

        if (!title || !description || !research_area) {
            return res.status(400).json({
                error: 'title, description, and research_area are required'
            });
        }

        const sql = `
            INSERT INTO opportunities
            (title, description, research_area, required_skills,
             available_positions, application_deadline, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            title, description, research_area,
            required_skills || null,
            available_positions || 1,
            application_deadline || null,
            status || 'Open'
        ]);

        const [rows] = await db.query(
            'SELECT * FROM opportunities WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. READ ALL
app.get('/api/opportunities', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM opportunities ORDER BY created_at DESC'
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. READ ONE
app.get('/api/opportunities/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM opportunities WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. UPDATE
app.put('/api/opportunities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, research_area, required_skills,
                available_positions, application_deadline, status } = req.body;

        const [existing] = await db.query(
            'SELECT * FROM opportunities WHERE id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }

        if (!title || !description || !research_area) {
            return res.status(400).json({
                error: 'title, description, and research_area are required'
            });
        }

        await db.query(
            `UPDATE opportunities SET
                title = ?, description = ?, research_area = ?,
                required_skills = ?, available_positions = ?,
                application_deadline = ?, status = ?
             WHERE id = ?`,
            [title, description, research_area, required_skills,
             available_positions, application_deadline, status, id]
        );

        const [rows] = await db.query(
            'SELECT * FROM opportunities WHERE id = ?',
            [id]
        );
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 5. DELETE
app.delete('/api/opportunities/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM opportunities WHERE id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});