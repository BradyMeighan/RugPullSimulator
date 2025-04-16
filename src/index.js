const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

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

// Route to add an entry to the leaderboard
app.post('/leaderboard', (req, res) => {
  const { 
    playerName, 
    tokenName, 
    tokenSymbol, 
    finalScore, 
    holders, 
    rugPullHolders,
    marketCap,
    tickCount 
  } = req.body;

  // Validate required fields
  if (!playerName || !tokenName || !tokenSymbol || finalScore === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create a new leaderboard entry
  const newEntry = {
    id: Date.now(), // Simple unique ID based on timestamp
    playerName,
    tokenName,
    tokenSymbol,
    finalScore,
    holders: holders || 0,
    rugPullHolders: rugPullHolders || 0,
    marketCap: marketCap || 0,
    tickCount: tickCount || 0,
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