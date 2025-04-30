export const errorHandler = (err, req, res, next) => {
  // Errores personalizados (desde validate.js)
  if (typeof err === "object" && !err.name && !err.message) {
    return res.status(422).json({ errors: err });
  }

  // Errores de Sequelize
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const errors = {};
    err.errors.forEach((e) => {
      errors[e.path] = e.message;
    });
    return res.status(422).json({ errors });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
