const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list
// public_users.get("/", (req, res) => {
//   res.status(200).json(Object.values(books)); // Send the list of books
// });

public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    res.status(500).send("Error fetching the list of books");
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/${isbn}`);
    res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    res.status(500).send("Error fetching book details");
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/");
    const books = response.data;
    const filteredBooks = Object.values(books).filter(
      (book) => book.author === author
    );

    if (filteredBooks.length === 0) {
      return res.status(404).send("No books found for this author");
    }

    res.status(200).send(JSON.stringify(filteredBooks, null, 2));
  } catch (error) {
    res.status(500).send("Error fetching books by author");
  }
});

// Get book details based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get("http://localhost:5000/");
    const books = response.data;
    const filteredBooks = Object.values(books).filter(
      (book) => book.title === title
    );

    if (filteredBooks.length === 0) {
      return res.status(404).send("No books found with this title");
    }

    res.status(200).send(JSON.stringify(filteredBooks, null, 2));
  } catch (error) {
    res.status(500).send("Error fetching books by title");
  }
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
