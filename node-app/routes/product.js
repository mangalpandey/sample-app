const express = require("express");
const productController = require("../controller/product");

const isAuth = require("../middleware/auth");
const auth = require("../middleware/auth");
const router = express.Router();

// GET /product/get/id
router.get("/get/:id", isAuth, productController.get);

// GET /product/getAll
router.get("/getAll", isAuth, productController.getAll);

// GET /product/purchase
router.post("/purchase", isAuth, productController.purchase);

module.exports = router;
