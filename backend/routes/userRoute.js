const express = require("express");
const { uservalidator, addUserHandler, getLogin } = require("../controllers/userController");
const router = express.Router();

//sign up route
router.post("/signup", uservalidator, addUserHandler);

//login
router.post("/login", getLogin);



//export router
module.exports = router;
