const User = require("../models/User");
const Book = require("../models/Book");
const Stundent = require("../models/Student");
const IssueReturn = require("../models/IssueReturn");


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

    // Validate password
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};




exports.addBook = async (req, res) => {
  try {
    const { title, author, status, image, stock } = req.body;

    if (!title || !author || !image || !stock) {
      return res.status(400).json({
        message: "Title, author, image and stock are required"
      });
    }

    
    const exist = await Book.findOne({ title });

    if (exist) {
      return res.status(400).json({
        message: "Book already exists"
      });
    }

    // create book
    const book = await Book.create({
      title,
      author,
      status,
      image,
      stock
    });

    res.status(201).json({
      message: "Book added successfully",
      book
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


exports.getBooks = async (req, res) => {
  try {


    const search = req.query.search || ""
  let filter = {}
    if(search){
 filter.title = { $regex:search,$options:"i"}
}

const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 5;

  const skip = (page -1) * limit

    const books = await Book.find(filter).sort({createdAt:-1}).skip(skip).limit(limit)
    // const books = await Book.find(filter).select("-createdAt -updatedAt")
   const total = await Book.countDocuments(filter);
    res.status(200).json({
      count: books.length,
      books,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
     
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

    const student = await Stundent.create({
      Stundentname,
      Department
    });

    res.status(201).json({
      message: "Student added successfully",
      student
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

exports.issueBook = async (req, res) => {
  try {
    const { bookId, studentId, issueDate } = req.body;

    if (!bookId || !studentId || !issueDate) {
      return res.status(400).json({ message: "bookId, studentId, and issueDate are required" });
    }

      const parts = issueDate.split("-");
    const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);

    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ message: "Invalid issueDate format" });
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    if (book.stock <= 0) {
      return res.status(400).json({ message: "Book out of stock" });
    }

    // Decrease stock
    book.stock -= 1;
    await book.save();

    // Create issue record
    const issueRecord = await IssueReturn.create({
      bookId,
      studentId,
      issueDate,
      status: "issued"
    });

    res.status(201).json({
      message: "Book issued successfully",
      issueRecord,
      remainingStock: book.stock
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { bookId, studentId, returnDate } = req.body;


      const parts = returnDate.split("-");
    const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);

    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ message: "Invalid returnDate format" });
    }
    if (!bookId || !studentId || !returnDate) {
      return res.status(400).json({ message: "bookId, studentId, and returnDate are required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    // Increase stock
    book.stock += 1;
    await book.save();

    // Update issue record
    const issueRecord = await IssueReturn.findOneAndUpdate(
      { bookId, studentId, status: "issued" },
      { returnDate, status: "returned" },
      { new: true }
    );

    if (!issueRecord) {
      return res.status(400).json({ message: "No active issue record found for this book and student" });
    }

    res.status(200).json({
      message: "Book returned successfully",
      issueRecord,
      updatedStock: book.stock
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.getUserWithHistory = async (req, res) => {
  try {
    const userId = req.params.id;

   

    // ✅ get user (remove __v)
    const user = await Stundent.findById(userId).select("-__v");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // ✅ get history
    const userhistory = await IssueReturn.find({ studentId: userId })
      .populate("bookId", "title author image")
      .select("bookId issueDate returnDate status")
      .sort({ createdAt: -1 });

    // ✅ send response
    return res.status(200).json({
      user,
      history: userhistory
    });

  } catch (err) {
    console.error(err); // important
    res.status(500).json({
      message: "Server error"
    });
  }
};
