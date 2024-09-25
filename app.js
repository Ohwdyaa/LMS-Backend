const express = require('express');
const userRoutes = require('./controllers/users/route');
const db = require('./config/db/db'); // ganti dengan path yang sesuai

const app = express();

app.use(express.json()); // Untuk parsing JSON request body
app.use('/', userRoutes); // Menggunakan routes dengan prefix /api

// Setelah semua route didaftarkan
app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
        console.log(r.route.path)
    }
});

db.query('SELECT 1')
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/test', (req, res) => {
    res.send('Server is working');
});