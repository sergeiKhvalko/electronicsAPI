const express = require("express");
const router = express.Router();

// middlewares
const {authCheck, adminCheck} = require("../middleware/auth");

// controller
const {productsCount, list, listAll, remove, searchFilters} = require("../controllers/product");

// routes
router.post("/products", list);
router.get("/products/total", productsCount);
router.get("/products/:count", listAll); // products/100
router.delete("/product/:slug", authCheck, adminCheck, remove);

// search
router.post("/search/filters", searchFilters);


module.exports = router;