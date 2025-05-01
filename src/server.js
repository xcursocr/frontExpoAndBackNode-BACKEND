import express from "express";
import cors from "cors";
import "dotenv/config";
import { sequelize } from "./config/db.js";

import authRoute from "./routes/authRoute.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
// app.use(cors({ origin: "http://localhost:8081", optionsSuccessStatus: 200 }));

// router
app.use("/api/auth", authRoute);

// Middleware
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    console.log(`🚀 Servidor en http://192.168.100.180:${PORT}`),
      await sequelize.sync({ alter: true });
    console.log("✅ Base de datos conectada");
  } catch (err) {
    console.log("❌ Error al iniciar el servidor", err);
  }
});
