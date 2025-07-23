import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for liked movies (in production, use a database)
let userMovies = {};

// Get liked movies for a user
app.get('/api/user/liked/:email', (req, res) => {
  const { email } = req.params;
  const movies = userMovies[email] || [];
  res.json({ movies });
});

// Add movie to liked list
app.post('/api/user/add', (req, res) => {
  const { email, data } = req.body;
  
  if (!userMovies[email]) {
    userMovies[email] = [];
  }
  
  // Check if movie already exists
  const existingMovie = userMovies[email].find(movie => movie.id === data.id);
  if (!existingMovie) {
    userMovies[email].push(data);
  }
  
  res.json({ movies: userMovies[email] });
});

// Remove movie from liked list
app.put('/api/user/remove', (req, res) => {
  const { email, movieId } = req.body;
  
  if (userMovies[email]) {
    userMovies[email] = userMovies[email].filter(movie => movie.id !== movieId);
  }
  
  res.json({ movies: userMovies[email] || [] });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});