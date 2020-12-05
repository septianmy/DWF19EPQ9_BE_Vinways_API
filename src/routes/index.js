const express = require("express");
const router = express.Router();

//Controller
const { register, login } = require("../controllers/auth");
const { getUsers, deleteUser, restoreUser } = require("../controllers/users");
const { getArtists, getDetailArtist, addArtist, deleteArtist, restoreArtist, updateArtist } = require("../controllers/artist");
const { getTransactions, getDetailTransactions, addTransaction, deleteTransaction, updateTransaction } = require("../controllers/transactions");

//middleware 
const {auth, userCheck} = require('../middleware/auth');
const {uploadImage} = require('../middleware/uploadImage');
const {uploadMusic} = require('../middleware/uploadMusic');
const { getMusics, getDetailMusic, addMusic, deleteMusic, updateMusic } = require("../controllers/music");

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

//Transactions
router.get("/transactions",getTransactions);
router.get("/transaction/:id",getDetailTransactions);
router.post("/transaction",auth,uploadImage("proofTransaction"),addTransaction );
router.patch("/transaction/:id",auth,updateTransaction);
router.delete("/transaction/:id", auth, deleteTransaction);

//Musics
router.get("/musics",getMusics);
router.get("/music/:id",getDetailMusic);
router.post("/music",auth, uploadMusic("thumbnail","attachment"), addMusic);
router.patch("/music/:id",auth,updateMusic);
router.delete("/music/:id",auth,deleteMusic);

module.exports = router;