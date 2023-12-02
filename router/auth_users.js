const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
// Authentifier un utilisateur enregistré
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body; // Extraire le nom d'utilisateur et le mot de passe du corps de la requête

  // Vérifier si le nom d'utilisateur ou le mot de passe est manquant
  if (!username || !password) {
    return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
  }
console.log(users);
  // Vérifier si l'utilisateur existe dans la liste des utilisateurs enregistrés
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    // Utilisateur authentifié avec succès
    const token = jwt.sign({ username: user.username }, 'your_secret_key'); // Générer un jeton d'authentification (à remplacer par votre clé secrète)
    return res.status(200).json({ message: 'Connexion réussie', token: token });
  } else {
    // Identifiants invalides
    return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
  }
});


// Add a book review
// Add/modify a book review based on ISBN
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Extract ISBN from request parameters
  const { review } = req.body; // Extract review from request body

  // Check if the book with the given ISBN exists in the 'books' object
  if (books[isbn]) {
    // If book with matching ISBN is found, add/modify the review
    books[isbn].reviews = review;
    return res.status(200).json({ message: 'Book review updated successfully', review: books[isbn].reviews });
  } else {
    // If book with given ISBN is not found, return appropriate message
    return res.status(404).json({ message: 'Book not found for the given ISBN' });
  }
});
// Delete book review based on ISBN for the authenticated user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Extract ISBN from request parameters
  const { username } = req.body; // Extract username (authenticated user)

  // Check if the book with the given ISBN exists in the 'books' object
  if (books[isbn]) {
    // Check if the user has added a review for this book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      // Delete the review for the book added by the user
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: 'Book review deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Review not found for the given user and ISBN' });
    }
  } else {
    // If book with given ISBN is not found, return appropriate message
    return res.status(404).json({ message: 'Book not found for the given ISBN' });
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
