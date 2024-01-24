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
  const data = await prisma.user.findUnique({
    where: {
      id
    }
  })
  
return data
}


const getAllUserRepo = async () => {
  return await prisma.user.findMany()
}
module.exports = { createUserRepo ,Login, getUserByIdRepo, getAllUserRepo};
