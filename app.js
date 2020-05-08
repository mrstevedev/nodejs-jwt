const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', VerifyToken, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({ 
                message: 'Post created..',
                authData
            });
        }
    })
});

app.post('/api/login', (req, res) => {

    // Mock User
    const user = {
        id: 1,
        username: 'Jay',
        email: 'jay#orgymusic.com'
    };
    
    jwt.sign({ user }, 'secret', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        });
    });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function VerifyToken(req, res, next) {
    // Get the Auth Header value
    const bearerHeader = req.headers['authorization'];
    // Check if Bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split At The Space
        const bearer = bearerHeader.split(' ');
        // Get token from array 
        const bearerToken = bearer[1];
        // Set the token 
        req.token = bearerToken;
        // Net middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

app.listen(5000, () => console.log(`Server started on port 5000`));
