const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

// database connection
// mongoose.connect("mongodb://localhost:27017/Movie-Recommender").then(()=>{
mongoose
  .connect(
    "mongodb+srv://deayan252:CPBeLf0XzMI0Swuy@cluster0.xohuq9b.mongodb.net/"
  )
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

// importing our own model
const userModel = require("./userModel");
const reviewModel = require("./reviewModel");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// REGISTRATION
app.post("/register", async (req, res) => {
  let userCred = req.body;

  try {
    const user = await userModel.findOne({ email: userCred.email });
    // If the email is found, prevent the user from registering again
    if (user) {
      return res.status(405).send({ message: "Already registered" });
    }

    // If email is not found, proceed with password hashing
    bcrypt.genSalt(5, (err, salt) => {
      if (!err) {
        // Hash the password using the generated salt
        bcrypt.hash(userCred.password, salt, async (err, hpass) => {
          if (!err) {
            // Replace the plain password with the hashed one
            userCred.password = hpass;
            try {
              await userModel.create(userCred);
              res.status(200).send({ message: "successful registration" });
            } catch (err) {
              console.log(err);
              res.status(400).send({
                message:
                  "An error has occured during registration! Please try again.",
              });
            }
          }
        });
      }
    });
  } catch (err) {
    res.status(400).send({
      message: "An error has occured during registration! Please try again.",
    });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  let userCred = req.body;

  try {
    const user = await userModel.findOne({ email: userCred.email });
    if (user != null) {
      bcrypt.compare(userCred.password, user.password, (err, result) => {
        if (result == true) {
          // generate token
          jwt.sign({ email: userCred.email }, "pixybox", (err, token) => {
            if (!err) {
              res.status(200).send({
                message: `Login successful ! Welcome back, ${user.name}.`,
                token: token,
                userid: user._id,
                name: user.name,
              });
            }
          });
        } else {
          res.status(401).send({ message: "Incorrect password !" });
        }
      });
    } else {
      res.status(404).send({ message: "User not found !" });
    }
  } catch (err) {
    res.status(400).send({ message: "An error has occured! Please try again" });
  }
});

// Post a Review
app.post("/review/:userid", async (req, res) => {
  let review = req.body;
  try {
    const user = await userModel.findOne({ _id: req.params.userid });
    review.user = user._id;
    review.name = user.name;
    review.country = user.country;

    await reviewModel.create(review);
    res.status(200).send({
      message: "Your review and rating has been posted successfully!",
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: "An error has occured! Please try again." });
  }
});

// Fetch all reviews
app.get("/all-reviews", async (req, res) => {
  try {
    let reviews = await reviewModel.find();

    // If no reviews are found
    if (reviews.length === 0)
      return res.status(204).send({ message: "No reviews found!" });

    // Returning the reviews as a response
    return res.status(200).json(reviews);
  } catch (err) {
    res.status(500).send({ message: "Server error! Please try again." });
  }
});

// Fetch my reviews
app.get("/my-reviews/:userId", async (req, res) => {
  try {
    let reviews = await reviewModel.find({ user: req.params.userId });

    // If no reviews are found
    if (reviews.length === 0)
      return res
        .status(204)
        .send({ message: "You haven't posted any reviews!" });

    // Returning the reviews as a response
    return res.status(200).json(reviews);
  } catch (err) {
    res.status(500).send({ message: "Server error! Please try again." });
  }
});

// Delete a review
app.delete("/delete-review/:reviewId", async (req, res) => {
  try {
    await reviewModel.deleteOne({ _id: req.params.reviewId });
    return res
      .status(204)
      .send({ message: "Your review was deleted successfully!" });
  } catch (err) {
    res.status(409).send({ message: "Server error! Please try again." });
  }
});

//order payment
app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

//validate payment
app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

// starting the server
app.listen(2020, () => {
  console.log("Server running");
});
