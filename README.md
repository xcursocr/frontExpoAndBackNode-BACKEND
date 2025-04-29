### Validations functions
```js
function validateMultiple(fields) {
  const errors = {};

  for (const fieldName in fields) {
    const { data, rules } = fields[fieldName];
    const fieldErrors = [];

    if (rules.required && (data === null || data === undefined || data === "")) {
      fieldErrors.push("El campo es requerido.");
    }

    if (rules.type === "string" && typeof data !== "string") {
      fieldErrors.push("Debe ser un string.");
    }

    if (rules.type === "number" && typeof data !== "number") {
      fieldErrors.push("Debe ser un número.");
    }

    if (rules.minLength && typeof data === "string" && data.length < rules.minLength) {
      fieldErrors.push(`Debe tener al menos ${rules.minLength} caracteres.`);
    }

    if (rules.maxLength && typeof data === "string" && data.length > rules.maxLength) {
      fieldErrors.push(`No debe exceder los ${rules.maxLength} caracteres.`);
    }

    if (rules.min && typeof data === "number" && data < rules.min) {
      fieldErrors.push(`El valor debe ser mayor o igual a ${rules.min}.`);
    }

    if (rules.max && typeof data === "number" && data > rules.max) {
      fieldErrors.push(`El valor debe ser menor o igual a ${rules.max}.`);
    }

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors; // Almacena los errores por campo
    }
  }

  return Object.keys(errors).length > 0 ? errors : "Todos los datos son válidos";
}

// Ejemplo de uso
const fieldsToValidate = {
  username: {
    data: "Luis",
    rules: { required: true, type: "string", minLength: 3, maxLength: 15 },
  },
  age: {
    data: 25,
    rules: { required: true, type: "number", min: 18, max: 100 },
  },
  email: {
    data: "",
    rules: { required: true, type: "string", minLength: 5, maxLength: 50 },
  },
};

const result = validateMultiple(fieldsToValidate);
console.log(result);
/*
Salida si hay errores:
{
  email: ["El campo es requerido."]
}
*/


```
