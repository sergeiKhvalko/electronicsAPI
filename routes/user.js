const express = require("express");
const router = express.Router();

// middleware
const { authCheck } = require("../middleware/auth");

// controllers
const {
	userCart,
	addToWishlist,
	removeFromWishlist
} = require("../controllers/user");

router.post("/user/cart", authCheck, userCart); //save cart

// wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

module.exports = router;