const express = require("express");
const productRouter = require("./product");
const blogRouter = require("./blog");
const homeRouter = require("./home");
const userRouter = require("./user");
const checkOutRouter = require("./checkOut");
const paymentRouter = require("./payment");
const discountRouter = require("../api/discount");

const router = express.Router();


function route(app) {
  app.use("/", userRouter);

  app.use("/home", homeRouter);
  app.use("/success",paymentRouter );

  app.use("/shop-grid", productRouter);

  app.get("/shop-details", function (req, res) {
    res.render("shop-details/shop-details");
  });

  app.get("/shoping-cart", function (req, res) {
    res.render("shoping-cart/shoping-cart");
  });

  app.use("/blog", blogRouter);

  app.get("/contact", function (req, res) {
    res.render("contact/contact");
  });

  app.get("/aboutUs", function (req, res) {
    res.render("aboutUs/aboutUs");
  });

  app.use("/discount", discountRouter);
  app.use("/checkout", checkOutRouter);

  app.use("/payment", paymentRouter);

  //app.use("/webhook",chatBotRouter);
}

module.exports = route;
