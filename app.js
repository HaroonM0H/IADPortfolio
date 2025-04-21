import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import {getUserById, createUser, getUsers, verifyUser, getRecipebyID, getRecipesByUserId} from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Configure session middleware :P
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

// logout route
app.get('/logout', (req, res) => {
    // Store username for feedback message
    const username = req.session.user ? req.session.user.username : null;
    
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Error during logout process');
        }
        
        // Clear the cookie on client side
        res.clearCookie('connect.sid');
        
        // Redirect with a success message
        res.redirect('/login?message=You have been successfully logged out&username=' + (username || ''));
    });
});

// Route to handle registration form :)
app.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body
        
        // Basic server-side validation
        if (password.length < 8) {
            return res.redirect('/register?message=Password must be at least 8 characters long&error=true');
        }
        
        console.log('Registration attempt:', { username, email })
        
        // Check if username already exists
        const existingUsers = await getUsers();
        const userExists = existingUsers.some(user => user.username === username);
        if (userExists) {
            return res.redirect('/register?message=Username already exists&error=true');
        }
        
        // Check if email already exists
        const emailExists = existingUsers.some(user => user.email === email);
        if (emailExists) {
            return res.redirect('/register?message=Email already in use&error=true');
        }
        
        const user = await createUser(username, email, password)
        console.log('New user registered:', user)
        
        // Redirect with success message
        res.redirect('/login?message=Registration successful! Please log in.');
    } catch (error) {
        console.error('Registration error:', error)
        res.redirect('/register?message=Registration failed: ' + error.message + '&error=true');
    }
})

app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('Something Broke!')
})

app.listen(8080, () => {
    console.log("server is running on port 8080")
})

// Route to get user's recipes
app.get('/user-recipes', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.uid;
        const recipes = await getRecipesByUserId(userId);
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});