const Product = require("../models/product");
const Customer = require("../models/customer");
const Transaction = require("../models/Transaction");

exports.purchase = async function (req, res, next) {
  const name = req.body.name;
  const price = req.body.price;
  const shopName = req.body.shopName;
  const status = req.body.status;
  const userId = req.body.userId;
  var customer = await Customer.findById(userId);
  try {
    if (!customer) {
      res.status(403).json({ message: "Customer not available" });
    }
    const product = new Product({
      name: name,
      price: price,
      shopName: shopName,
      status: status,
      customer: customer._id,
    });
    var addedProduct = await product.save();

    if (!addedProduct) {
      res.status(403).json({ message: "Product has not added" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  var transaction = new Transaction({
    product: addedProduct._id,
    customer: customer._id,
  });

  transaction
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product purchased!",
        data: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.get = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      if (!product) {
        const error = new Error("Could not find product.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Product fetched.", product: product });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAll = (req, res, next) => {
  const searchText = req.query.searchText;
  const customerId = req.query.userId;
  console.log("searchText", searchText);
  Product.find({
    customer: customerId,
    name: { $regex: `(?i)(?<=|^)${searchText}(?=|$)` },
  })
    .then((products) => {
      res.status(200).json({
        message: "Fetched product successfully.",
        products: products,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
