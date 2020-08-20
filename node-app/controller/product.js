const Product = require("../models/product");

exports.add = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const shopName = req.body.shopName;
  const status = req.body.status;

  const product = new Product({
    name: name,
    price: price,
    shopName: shopName,
    status: status,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product created!",
        _id: result._id,
        name: result.name,
        price: result.price,
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
  console.log("searchText", searchText);
  Product.find({ name: { $regex: `(?i)(?<=|^)${searchText}(?=|$)` } })
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
