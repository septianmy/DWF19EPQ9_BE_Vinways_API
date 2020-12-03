const express = require("express");
const router = express.Router();
const { register } = require("../controllers/auth");

//middleware 
const {authenticated } = require('../../middleware');

router.post("/register", register);

module.exports = router;