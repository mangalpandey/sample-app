const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Customer = require("../models/customer");

exports.signup = async function (req, res, next) {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  var existCustomer = await Customer.findOne({ email: email });
  if (existCustomer) {
    res.status(201).json({
      message: "Customer with this email already exist!",
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const customer = new Customer({
        email: email,
        password: hashedPw,
        name: name,
      });
      return customer.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Customer created!",
        customer: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  Customer.findOne({ email: email })
    .then((customer) => {
      if (!customer) {
        const error = new Error(
          "A customer with this email could not be found."
        );
        error.statusCode = 401;
        throw error;
      }
      loadedUser = customer;
      return bcrypt.compare(password, customer.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          _id: loadedUser._id.toString(),
        },
        "my-product-customer-secret",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        _id: loadedUser._id.toString(),
        email: loadedUser.email,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.me = (req, res, next) => {
  const email = req.body.email;
  Customer.findOne({ email: email })
    .then((customer) => {
      if (!customer) {
        const error = new Error(
          "A customer with this email could not be found."
        );
        error.statusCode = 401;
        throw error;
      }
      res.status(200).json({
        _id: customer._id.toString(),
        email: customer.email,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
