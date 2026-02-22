const User = require("../models/User");
const Book = require("../models/Book");
const Stundent = require("../models/Student")


exports.Register = async (req, res) => {
  try {
    const { name, password, role } = req.body;

   
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

   
    const admin = await User.create({
      name,
      password,
      role
    });

    return res.status(201).json({ message: "Admin registered successfully",
      name: admin.name,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.Login = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

   
    res.status(200).json({
      message: "Login successful",
      
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
       password: user.password
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};




exports.addBook = async (req, res) => {
  try {
    const { title, author, status } = req.body;

   
    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    const book = await Book.create({
      title,
      author,
      status
    });

    res.status(201).json({
      message: "Book added successfully",
      book
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json({
      count: books.length,
      books
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.addStudent = async (req, res) => {
  try {
    const { Stundentname, Department } = req.body;

   
    if (!Stundentname || !Department) {
      return res.status(400).json({ message: "Stundentname and Department are required" });
    }

    const book = await Stundent.create({
      Stundentname,
      Department
    });

    res.status(201).json({
      message: "Student added successfully",
      book
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const stundent = await Stundent.find();

    res.status(200).json({
      stundent
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
