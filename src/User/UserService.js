const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { createUserRepo, Login } = require("./UserRepo");

dotenv.config();

const secretKey = process.env.SECRET_KEY_JWT;

const createUserServ = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  const dataRes = {
    name: data.name,
    email: data.email,
    password: hashPassword,
    role_id: data.role_id,
  };

  try {
    const response = await createUserRepo(dataRes);
    const dataReq = {
      name: response.name,
      uuid: response.id,
    };
    return dataReq;
  } catch (error) {
    console.log(error);
  }
};

const LoginUser = async (email, password) => {
  const user = await Login(email);
  console.log(user);
  if (!user) {
    return "invalid email";
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return "invalid password";
  }

  const token = jwt.sign(
    { namaUser: user.name, id: user.id, role_id: user.role.number_role },
    secretKey,
    { expiresIn: "1d" }
  );

  return {
    name: user.name,
    uuid: user.id,
    role: user.role.role,
    role_number: user.role.number_role,
    accessToken: token,
  };
};

module.exports = { createUserServ, LoginUser };
