const express = require("express");
const jwt = require("jsonwebtoken");

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
    res.sendStatus(403);
  }
};

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

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "test",
    email: "test@test.com"
  };
  jwt.sign({ user: user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
    res.json({
      token
    });
  });
});

app.listen(5000, () => console.log("Server started on port 5000"));
