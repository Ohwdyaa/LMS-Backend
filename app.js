const express = require('express');
const userRoutes = require('./controllers/users/route');
const db = require('./config/db/db');

const app = express();

app.use(express.json()); 
app.use('/', userRoutes); 


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