import express from "express";
import "dotenv/config";
import { sequelize } from "./config/db.js";

import authRoute from "./routes/authRoute.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// router
app.use("/api/auth", authRoute);

app.listen(PORT, async () => {
  try {
    console.log(`🚀 Servidor en http://localhost:${PORT}`),
      await sequelize.sync({ alter: true });
    console.log("✅ Base de datos conectada");
  } catch (err) {
    console.log("❌ Error al iniciar el servidor", err);
  }
});
