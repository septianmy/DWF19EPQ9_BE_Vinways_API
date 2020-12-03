const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth");
const { getUsers, deleteUser, restoreUser } = require("../controllers/users");

//middleware 
const {authenticated } = require('../../middleware');


//Auth
router.post("/register", register);
router.post("/login", login);

//Users
router.get("/users", getUsers);
router.delete("/user/:id", deleteUser);
router.post("/user/:id", restoreUser);

module.exports = router;