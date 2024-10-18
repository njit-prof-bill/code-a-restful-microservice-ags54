const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above

// Middleware to append newline to JSON responses
app.use((req, res, next) =>
{
    const originalJson = res.json;

    res.json = function (body)
    {
        // Send the response using the original `res.json()` and append the newline after it is done
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(body) + '\n\n'); // added double line to view confort for me
        res.end();
    };

    next();
});

// In-memory storage using an array
let users = [];
let nextID = 1; // Auto-increment ID for users

// POST /users: Create a new user
app.post('/users', (req, res) =>
{
    const {name, email} = req.body;

    if (!name || !email)
    {
        return res.status(400).json({ERROR: 'Name and email are required. Please try again.'});
    }

    const nextUser = {id: nextID++, name, email};
    users.push(nextUser);
    res.status(201).json(nextUser);
});

// GET /users: Retrieve all users
app.get('/users', (req, res) =>
{
    res.json(users);
});

// GET /users/:id: Retrieve user information by id
app.get('/users/:id', (req, res) =>
{
    const userID = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userID);

    if (!user)
    {
        return res.status(404).json({ERROR: 'User not found. Please try again.'});
    }

    res.json(user);
});

// PUT /users/:id: Update user information by id
app.put('/users/:id', (req, res) =>
{
    const userID = parseInt(req.params.id, 10);
    const {name, email} = req.body;

    const user = users.find(u => u.id === userID);

    if (!user)
    {
        return res.status(404).json({ ERROR: 'User not found. Please try again.'});
    }

    if (!name || !email)
    {
        return res.status(400).json({ ERROR: 'Name and email are required. Please try again.' });
    }

    user.name = name;
    user.email = email;
    res.json(user);
});

// DELETE /users/:id: Delete a user by id
app.delete('/users/:id', (req, res) =>
{
    const userID = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(u => u.id === userID);

    if (userIndex === -1)
    {
        return res.status(404).json({ ERROR: 'User not found. Please try again.'});
    }

    users.splice(userIndex, 1); // Remove the user from the array
    res.status(204).send(); // 204 No Content
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing