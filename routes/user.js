const express = require("express");
const router = express.Router();
const { getUserById, getUser, updateUser, userPurchaseList /*getAllUsers */ } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { update } = require("../models/user");

router.param("userId", getUserById)

router.get("/user/:userId", isSignedIn, isAuthenticated,/* isAdmin*/ getUser)
//router.get("/users", getAllUsers)
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)

router.get("/o")
module.exports = router;