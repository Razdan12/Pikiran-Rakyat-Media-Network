const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addRole = async (data) => {
  return await prisma.role.create({
    data: data,
  });
};

const totalRole = async() => {
    return await prisma.role.count()
}

const getAllRole = async () => {
    return await prisma.role.findMany()
}

const getRoleByid = async (id) => {
  return await prisma.role.findUnique({
    where: {
      id
    }
  })
}
module.exports = { addRole, totalRole, getAllRole,getRoleByid };