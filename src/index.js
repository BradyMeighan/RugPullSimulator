const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3001;

// Security Middleware
app.use(helmet()); // Add various security headers

// Rate Limiter for score submission
const scoreLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many score submissions from this IP, please try again after 15 minutes'
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://rugpullsimulator.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// In-memory leaderboard storage
let leaderboard = [];

// Route to get leaderboard
app.get('/leaderboard', (req, res) => {
  // Sort by finalScore in descending order
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.finalScore - a.finalScore);
  
  // Return only top 100 entries
  res.json(sortedLeaderboard.slice(0, 100));
});

// Route to add an entry to the leaderboard with validation and rate limiting
app.post('/leaderboard', 
  scoreLimiter, // Apply rate limiting first
  [
    // Validate and sanitize input
    body('playerName').trim().isLength({ min: 1, max: 15 }).escape(),
    body('tokenName').trim().notEmpty().escape(),
    body('tokenSymbol').trim().notEmpty().escape(),
    body('finalScore').isNumeric().toInt(),
    body('rugPullHolders').optional().isNumeric().toInt(),
    body('marketCap').optional().isNumeric().toInt(),
    body('tickCount').optional().isNumeric().toInt(),
  ],
  (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      playerName, 
      tokenName, 
      tokenSymbol, 
      finalScore, 
      holders, // Keep original holders name if frontend sends it
      rugPullHolders,
      marketCap,
      tickCount 
    } = req.body;

    // // Basic validation is now handled by express-validator
    // if (!playerName || !tokenName || !tokenSymbol || finalScore === undefined) {
    //   return res.status(400).json({ error: 'Missing required fields' });
    // }

    // Create a new leaderboard entry
    const newEntry = {
      id: Date.now(), // Simple unique ID based on timestamp
      playerName, // Already validated and sanitized
      tokenName, // Already validated and sanitized
      tokenSymbol, // Already validated and sanitized
      finalScore, // Already validated and parsed as Int
      holders: holders || 0, // Keep original name for backward compatibility
      rugPullHolders: rugPullHolders || 0, // Already validated and parsed as Int
      marketCap: marketCap || 0, // Already validated and parsed as Int
      tickCount: tickCount || 0, // Already validated and parsed as Int
      date: new Date().toISOString()
    };

    // Add to leaderboard
    leaderboard.push(newEntry);

    // Return success
    res.status(201).json({ success: true, entry: newEntry });
});

// Optional: Route to clear the leaderboard (for admin use)
app.delete('/leaderboard', (req, res) => {
  // In a real app, you'd have authentication here
  leaderboard = [];
  res.json({ success: true, message: 'Leaderboard cleared' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Start the server
app.listen(port, () => {
  console.log(`Rug Pull Simulator backend running on port ${port}`);
}); 