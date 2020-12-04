const express = require("express");
const router = express.Router();

//Controller
const { register, login } = require("../controllers/auth");
const { getUsers, deleteUser, restoreUser } = require("../controllers/users");
const { getArtists, getDetailArtist, addArtist, deleteArtist, restoreArtist, updateArtist } = require("../controllers/artist");

//middleware 
const {auth } = require('../middleware/auth');
const {uploadImage } = require('../middleware/uploadImage');

//Auth
router.post("/register", register);
router.post("/login", login);

//Users
router.get("/users", getUsers);
router.delete("/user/:id", deleteUser);
router.post("/user/:id", restoreUser);

//Artists 
router.get("/artists", getArtists);
router.get("/artist/:id", getDetailArtist);
router.post("/artist", auth, uploadImage("thumbnail"), addArtist);
router.patch("/artist/:id", auth, updateArtist);
router.delete("/artist/:id", auth, deleteArtist); //Soft Delete Artist
router.post("/artist/:id", auth, restoreArtist); //Restore Artist

module.exports = router;