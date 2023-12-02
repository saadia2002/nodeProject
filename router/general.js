const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Assuming users is an array of registered user objects with 'username' and 'password' properties

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

    users.push({ username, password });
    return res.status(201).json({ message: 'User registered successfully' });
 
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  const formattedBooks = JSON.stringify(books, null, 2);
  
  // Send the book list as the response
  return res.status(200).send(formattedBooks);
});

// Get book details based on ISBN

 public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Extract ISBN from request parameters

  // Check if the book with the given ISBN exists in the 'books' object
  if (books[isbn]) {
    // If book with matching ISBN is found, send its details as response
    return res.status(200).json(books[isbn]);
  } else {
    // If book with given ISBN is not found, return appropriate message
    return res.status(404).json({ message: 'Book not found for the given ISBN' });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author; // Extract author from request parameters

  // Find books with the matching author
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    // If books by the matching author are found, send their details as response
    return res.status(200).json(booksByAuthor);
  } else {
    // If no books by the given author are found, return appropriate message
    return res.status(404).json({ message: 'No books found for the given author' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; // Extract title from request parameters

  // Find books with the matching title
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  if (booksByTitle.length > 0) {
    // If books with the matching title are found, send their details as response
    return res.status(200).json(booksByTitle);
  } else {
    // If no books with the given title are found, return appropriate message
    return res.status(404).json({ message: 'No books found for the given title' });
  }
});

//  Get book review
// Assuming books is an object of book objects indexed by numbers

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Extract ISBN from request parameters

  // Check if the book with the given ISBN exists in the 'books' object
  if (books[isbn]) {
    // If book with matching ISBN is found
    const bookReview = books[isbn].reviews;

    if (bookReview && Object.keys(bookReview).length > 0) {
      // If a review exists for the book, send it as a response
      return res.status(200).json({ review: bookReview });
    } else {
      // If no review exists for the book, return a message
      return res.status(404).json({ message: 'No review found for the book' });
    }
  } else {
    // If book with given ISBN is not found, return appropriate message
    return res.status(404).json({ message: 'Book not found for the given ISBN' });
  }
});


module.exports.general = public_users;
