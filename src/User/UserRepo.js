const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUserRepo = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

const Login = async (email) => {
    return await prisma.user.findUnique({
        where:{
            email
        },
        include:{
            role:true
        }
    })
}

const getUserByIdRepo = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id
    }
  })
}

module.exports = { createUserRepo ,Login, getUserByIdRepo};
