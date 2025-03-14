import express from 'express';

const app = express();
const PORT = 3000;
const router = express.Router();

app.use(express.json());  
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        res.json({ message: 'Login successful', user: username });
    } else {
        res.status(400).json({ error: 'Missing username or password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
