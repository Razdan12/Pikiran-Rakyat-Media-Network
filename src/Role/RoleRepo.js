const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addRole = async (data) => {
  return await prisma.role.create({
    data: data,
  });
};

const totalRole = async () => {
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

const isRoleExist = async (id) => {
  return await prisma.role.findUniqueOrThrow({ where: { id } })
}

const editRole = async (id, data) => {
  return await prisma.role.update({ where: { id }, data })
}
module.exports = { addRole, totalRole, getAllRole, getRoleByid, editRole, isRoleExist };