export const validate = async (fields,res) => {
  const errors = {};

  for (const fieldName in fields) {
    const { data, rules } = fields[fieldName];
    // const fieldErrors = [];
    const fieldErrors = {};

    if (
      rules.required &&
      (data === null || data === undefined || data === "")
    ) {
      // fieldErrors.push("El campo es requerido.");
       res.status(400).json({message:"El campo es requerido"})

    if (rules.type === "string" && typeof data !== "string") {
      // fieldErrors.push("Debe ser un string.");
      res.status(400).json({message:"Debe ser un string"})
    }

    if (rules.type === "number" && typeof data !== "number") {
      // fieldErrors.push("Debe ser un número.");
      res.status(400).json({message:"Debe ser un numero"})
    }

    if (
      rules.minLength &&
      typeof data === "string" &&
      data.length < rules.minLength
    ) {
      // fieldErrors.push(`Debe tener al menos ${rules.minLength} caracteres.`);
      res.status(400).json({message:"Debe ser un string"})
    }

    if (
      rules.maxLength &&
      typeof data === "string" &&
      data.length > rules.maxLength
    ) {
      // fieldErrors.push(`No debe exceder los ${rules.maxLength} caracteres.`);
      res.status(400).json({message:"Debe ser un string"})
    }

    if (rules.min && typeof data === "number" && data < rules.min) {
      // fieldErrors.push(`El valor debe ser mayor o igual a ${rules.min}.`);
      res.status(400).json({message:"Debe ser un string"})
    }

    if (rules.max && typeof data === "number" && data > rules.max) {
      // fieldErrors.push(`El valor debe ser menor o igual a ${rules.max}.`);
      res.status(400).json({message:"Debe ser un string"})
    }

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors; // Almacena los errores por campo
      
    }
  }

  return Object.keys(errors).length > 0
    ? errors
    : "Todos los datos son válidos";
};
