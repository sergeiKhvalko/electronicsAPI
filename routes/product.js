const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middleware/auth");

// controller
const {
	create,
	productsCount,
	list,
	listAll,
	remove,
	searchFilters,
	read,
	update,
	listRelated
} = require("../controllers/product");

// routes
router.post("/product", authCheck, adminCheck, create)
router.post("/products", list);
router.get("/products/total", productsCount);
router.get("/products/:count", listAll); // products/100
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);

// search
router.post("/search/filters", searchFilters);

// related
router.get("/product/related/:productId", listRelated);


module.exports = router;