const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCustomerRepo = async (dataCust) => {
  return prisma.custs.create({
    data: dataCust,
  });
};

const getCustomer = async () => {
  return prisma.custs.findMany();
};

const getCustomerByIdRepo = async (id) => {
  return prisma.custs.findUnique({
    where: {
      id: id
    }
  })
} 
module.exports = { createCustomerRepo, getCustomer, getCustomerByIdRepo };
