import { sequelize } from "../config/db.js";
import { User } from "../models/User.js";

const runSeeders = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("✏️  Base de datos reiniciada");

    //   await seedUser();
    //   await seedCategory();
    //   await seedProduct();

    console.log("✅ Seed completo");
    process.exit();
  } catch (error) {
    console.error("Error al ejecutar seeds", error);
    process.exit(1);
  }
};

runSeeders();
