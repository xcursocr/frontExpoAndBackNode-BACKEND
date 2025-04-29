import { validate } from "../lib/validate.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const valData = {
      username: {
        data: username,
        rules: { required: true, type: "string", minLength: 3, maxLength: 15 },
      },
      email: {
        data: email,
        rules: { required: true, type: "string", minLength: 5, maxLength: 50 },
      },
      password: { data: password, rules: { required: true } },
    };

    const result = validate(valData);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
