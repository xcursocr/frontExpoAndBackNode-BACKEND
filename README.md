### Validations functions

```js
import models from "../models/index.js"; // Sequelize models

const TABLE_MODEL_MAP = {
  users: "User",
  // posts: "Post",
};

const parseRules = (ruleStr) =>
  ruleStr.split("|").map((rule) => {
    const [name, value] = rule.split(":");
    return { name, value };
  });

const validators = {
  required: (value) => value !== undefined && value !== null && value !== "",
  max: (value, max) =>
    typeof value === "string" && value.length <= parseInt(max),
  min: (value, min) =>
    typeof value === "string" && value.length >= parseInt(min),
  email: (value) => {
    if (typeof value !== "string") return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  },
  unique: async (value, tableField) => {
    const [table, field] = tableField.split(",");
    const modelName = TABLE_MODEL_MAP[table]; // "User"
    const model = models[modelName]; // ✅ busca en todos los modelos

    if (!model) {
      console.warn(`Modelo no encontrado para tabla: ${table}`);
      return true;
    }

    const existing = await model.findOne({ where: { [field]: value } });
    return !existing;
  },
};

export const validate = async (data, rules, messages = {}) => {
  const errors = {};
  const validated = {};

  for (const field in rules) {
    const value = data[field];
    const fieldRules = parseRules(rules[field]);

    for (const { name, value: ruleValue } of fieldRules) {
      const validator = validators[name];

      if (validator) {
        const isValid =
          name === "unique"
            ? await validator(value, ruleValue)
            : validator(value, ruleValue);

        if (!isValid) {
          // Usa mensaje personalizado si existe
          const customKey = `${field}.${name}`;
          errors[field] =
            messages[customKey] ||
            `${field} failed ${name}${ruleValue ? ":" + ruleValue : ""}`;
          break;
        }
      }
    }

    if (!errors[field]) {
      validated[field] = value;
    }
  }

  if (Object.keys(errors).length > 0) throw errors;

  return validated;
};

// USO ejemplo en el controlador
import { validate } from "../lib/validate.js";
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const data = await validate(
      req.body,
      {
        username: "required|unique:users,username|max:255",
        email: "required|email|unique:users,email",
        password: "required|min:6",
      },
      {
        "username.required": "El nombre de usuario es obligatorio.",
        "username.unique": "Ese nombre de usuario ya está en uso.",
        "username.max":
          "El nombre de usuario no puede tener más de 255 caracteres.",
        "email.required": "El correo electrónico es obligatorio.",
        "email.email": "El formato del correo no es válido.",
        "email.unique": "Ese correo ya está registrado.",
        "password.required": "La contraseña es obligatoria.",
        "password.min": "La contraseña debe tener al menos 6 caracteres.",
      },
    );

    // get random avatar
    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

    const newUser = await User.create({
      username: data.username,
      email: data.email,
      // password: await bcrypt.hash(data.password, 10),
      password: data.password,
      profileImage: profileImage,
    });

    const token = generateToken(newUser.id);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    // ❌ Si hay errores de validación, respondemos con 422 y los errores
    res.status(422).json({ err });
  }
};
```
