const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  createUserRepo,
  Login,
  getAllUserRepo,
  editUser,
  getUserByIdRepo,
} = require("./UserRepo");
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
    jabatan: data.jabatan,
    phone: data.phone,
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

const ResetPasswordUserServ = async (id, password) => {
  console.log(password);
  const hashPassword = await bcrypt.hash(password, 10);
  const dataRest = {
    password : hashPassword
  };
  console.log(id, dataRest);

  return await editUser(id, dataRest);
};

const LoginUser = async (email, password) => {
  const user = await Login(email);

  if (!user) {
    return Response(404, "", "email invalid");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return Response(404, "", "password invalid");
  }

  const token = jwt.sign(
    { namaUser: user.name, id: user.id, role: user.role.role },
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
  return Response(200, data, "email invalid");
};

const getAllUserServ = async () => {
  let user = await getAllUserRepo();
  user = user.filter((item) => !item.is_deleted);
  const userRest = await Promise.all(
    user.map(async (item) => {
      const role = await getRoleByid(item.role_id);
      return {
        id: item.id,
        name: item.name,
        email: item.email,
        role: role.role,
      };
    })
  );
  return userRest;
};

const editUserServ = async (id, data) => {
  const dataRest = {
    name: data.name,
    role_id: data.role,
  };

  return await editUser(id, dataRest);
};
const deleteUserServ = async (id) => {
  const dataRest = {
    is_deleted: true,
  };

  return await editUser(id, dataRest);
};

module.exports = {
  createUserServ,
  LoginUser,
  getAllUserServ,
  editUserServ,
  deleteUserServ,
  ResetPasswordUserServ
};
