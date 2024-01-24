const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { createUserRepo, Login, getAllUserRepo } = require("./UserRepo");
const { Response } = require("../config/Response");
const { getRoleByid } = require("../Role/RoleRepo");

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
 
  if (!user) {
    return Response(404, '' , "email invalid");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return Response(404, '' , "password invalid");
  }

  const token = jwt.sign(
    { namaUser: user.name, id: user.id, role: user.role.number_role },
    secretKey,
    { expiresIn: "1d" }
  );

 const data = {
    name: user.name,
    uuid: user.id,
    role: user.role.role,
    email: user.email,
    role_number: user.role.number_role,
    accessToken: token,
  };
  return Response(200, data , "email invalid");
};

const getAllUserServ = async () => {
  const user = await getAllUserRepo()
  const userRest = await Promise.all(
    user.map(async (item) => {
      const role = await getRoleByid(item.role_id)
      return {
        id: item.id,
        name: item.name,
        email: item.email,
        role: role.role
      }
    })
  )
  return userRest
}

module.exports = { createUserServ, LoginUser , getAllUserServ};
