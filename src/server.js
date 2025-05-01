import express from "express";
import "dotenv/config";
import { sequelize } from "./config/db.js";

import authRoute from "./routes/authRoute.js";

import { errorHandler } from "./middleware/errorHandler.js";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// router
app.use("/api/auth", authRoute);

// Middleware
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    console.log(`🚀 Servidor en http://localhost:${PORT}`),
      await sequelize.sync({ alter: true });
    console.log("✅ Base de datos conectada");
  } catch (err) {
    console.log("❌ Error al iniciar el servidor", err);
  }
});
