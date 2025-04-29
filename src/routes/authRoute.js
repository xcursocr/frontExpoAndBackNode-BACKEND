import express from "express";
import { register } from "../controllers/authCtrl.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", (req, res) => {
  res.send("desde api");
});

export default router;
