const express = require("express");
const router = express.Router();

// middleware
const { authCheck } = require("../middleware/auth");

// controllers
const { addToWishlist, removeFromWishlist } = require("../controllers/user");

// wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

module.exports = router;