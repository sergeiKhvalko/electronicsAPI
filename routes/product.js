const express = require("express");
const router = express.Router();

// middlewares
const {authCheck, adminCheck} = require("../middleware/auth");

// controller
const {productsCount, list} = require("../controllers/product");

// routes
router.get("/products/total", productsCount);
router.post("/products", list);