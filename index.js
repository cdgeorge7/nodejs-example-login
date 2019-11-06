const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

const verifyToken = (req, res, next) => {
  // Get auth header valu
  const bearerHeader = req.headers["authorization"];
  //Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/api", (req, res) => {
  res.json({ message: "ok good" });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created...",
        authData
      });
    }
  });
});

app.post("/login", (req, res) => {
  const user = { email: "test@test.com" };
  if (req.body.email === user.email) {
    //obviously silly, we will pull password hash from database to compare
    bcrypt.hash("password", 10).then(hash => {
      bcrypt.compare(req.body.password, hash).then(result => {
        if (result === true) {
          jwt.sign({ email: req.body.email }, "secretkey", (err, token) => {
            if (err) {
              console.error(error);
            } else {
              res.json({
                token
              });
            }
          });
        } else {
          res.sendStatus(401);
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
