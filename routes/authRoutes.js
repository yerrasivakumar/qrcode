const express = require("express");
const router = express.Router();
const { Register, Login,addBook,getBooks,addStudent,getStudents } = require("../controllers/authController");

router.post("/register", Register);
router.post("/login", Login);
router.post("/addbook", addBook);
router.post("/addstudent", addStudent);
router.get("/getbooks", getBooks);
router.get("/getstudents", getStudents);

module.exports = router;