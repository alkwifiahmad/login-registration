const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
//Define Home Route

router.get("/", (req, res) => res.render("welcome"));

// Dashboard

router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    name: req.user
  })
);

module.exports = router;
