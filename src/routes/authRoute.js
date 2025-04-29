import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  res.send("desde api");
});

router.post("/login", (req, res) => {
  res.send("desde api");
});

export default router;
