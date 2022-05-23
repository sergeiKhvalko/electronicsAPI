const express = require("express");

const router = express.Router();

// middleware
const { authCheck } = require("../middleware/auth");

// controller
const { createOrUpdateUser, currentUser } = require("../controllers/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);

module.exports = router;
