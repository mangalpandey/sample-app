const express = require("express");
const productController = require("../controller/product");

const isAuth = require("../middleware/auth");
const router = express.Router();

// POST /product/add
router.post("/add", isAuth, productController.add);

// GET /product/get/id
router.get("/get/:id", isAuth, productController.get);

// GET /product/getAll
router.get("/getAll", isAuth, productController.getAll);

module.exports = router;
