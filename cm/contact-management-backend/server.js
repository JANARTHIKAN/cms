const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const contactRouter = require('./routes/contacts');

require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();

// Google OAuth2 Client setup
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Use environment variable for security
const client = new OAuth2Client(CLIENT_ID);

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON payloads
app.use(express.json()); // Additional body parsing

// Google Login route
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];

    // Implement your logic to find or create the user in your database
    // const user = await findOrCreateUser(userId, email, name); // Example function

    // Generate JWT for authenticated user
    const authToken = jwt.sign({ userId, email, name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user ID
    res.status(200).json({ token: authToken, userId });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:/contact_management';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/api', authRoutes); // Authentication routes
app.use('/api/contacts', contactRouter); // Contact management routes

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
