const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const supabase = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- Endpoints ---

// 1. POST /users/register - Register a new user
app.post('/users/register', async (req, res) => {
    const { name, email, country, join_date } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    try {
        // email uniqueness is handled by DB constraint, but we can catch it
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, country, join_date: join_date || new Date().toISOString() }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Postgres unique constraint violation
                return res.status(409).json({ error: 'Email already registered.' });
            }
            throw error;
        }

        res.status(201).json({ message: 'User registered successfully', user: data });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to register user. Please try again.' });
    }
});

// 2. POST /events/track - Track user action
app.post('/events/track', async (req, res) => {
    const { user_id, action_type, meta_data, timestamp } = req.body;

    if (!user_id || !action_type) {
        return res.status(400).json({ error: 'user_id and action_type are required.' });
    }

    try {
        const { data, error } = await supabase
            .from('user_events')
            .insert([{
                user_id,
                action_type,
                meta_data: meta_data || {},
                timestamp: timestamp || new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'Event tracked', event: data });
    } catch (err) {
        console.error('Tracking error:', err);
        res.status(500).json({ error: 'Failed to track event.' });
    }
});

// 3. GET /users - Get all users (paginated)
app.get('/users', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { data, error, count } = await supabase
            .from('users')
            .select('*', { count: 'exact' })
            .range(offset, offset + limit - 1)
            .order('join_date', { ascending: false });

        if (error) throw error;

        res.json({
            users: data,
            total: count,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        console.error('Fetch users error:', err);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

// 4. GET /events/:user_id - Get all events for a user
app.get('/events/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const { data, error } = await supabase
            .from('user_events')
            .select('*')
            .eq('user_id', user_id)
            .order('timestamp', { ascending: false });

        if (error) throw error;

        res.json({ events: data });
    } catch (err) {
        console.error('Fetch events error:', err);
        res.status(500).json({ error: 'Failed to fetch user events.' });
    }
});

// Root check
app.get('/', (req, res) => {
    res.json({ message: 'Budget + Crypto Tracker API is running 🚀' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
