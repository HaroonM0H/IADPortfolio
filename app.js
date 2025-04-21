import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import {getUserById, createUser, getUsers, verifyUser} from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Configure session middleware
app.use(session({
    secret: 'your-secret-key', // Change this to a secure random string in production
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

app.get("/users", async (req, res) => {
    const users = await getUsers()
    res.send(users)
})

app.get("/users/:id", async (req, res) => {
    const id = req.params.id
    const user = await getUserById(id)
    res.send(user)
})

app.post("/users", async (req, res) => {
    const {username, email, password} = req.body
    const user = await createUser(username, email, password)
    res.status(201).send(user)
})

// Route to serve the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'))
})

// Route to serve the login page
app.get('/login', (req, res) => {
    // If user is already logged in, redirect to dashboard
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

// Route to handle login form submission
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await verifyUser(username, password);
        
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
        
        // Store user in session
        req.session.user = user;
        console.log('User logged in:', user);
        
        // Redirect to dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Login failed: ' + error.message);
    }
});

// Route to serve the dashboard page (protected)
app.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Route to get dashboard data
app.get('/dashboard-data', requireAuth, (req, res) => {
    res.json(req.session.user);
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Route to handle registration form submission
app.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body
        console.log('Registration attempt:', { username, email })
        const user = await createUser(username, email, password)
        console.log('New user registered:', user)
        res.redirect('/login')
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).send('Registration failed: ' + error.message)
    }
})

app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('Something Broke!')
})

app.listen(8080, () => {
    console.log("server is running on port 8080")
})