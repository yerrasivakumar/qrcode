const express = require("express");
const router = express.Router();
const { Register, Login, addBook, getBooks, addStudent, getStudents, issueBook, returnBook ,getUserWithHistory} = require("../controllers/authController");

router.post("/register", Register);
router.post("/login", Login);
router.post("/addbook", addBook);
router.post("/addstudent", addStudent);
router.get("/getbooks", getBooks);
router.get("/getstudents", getStudents);
router.post("/issuebook", issueBook);
router.post("/returnbook", returnBook);
 router.get("/user/:id/history", getUserWithHistory);

module.exports = router;