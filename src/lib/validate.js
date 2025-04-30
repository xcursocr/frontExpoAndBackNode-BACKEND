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
