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

const getCountCustomer = async () => {
  return prisma.custs.count()
}

const getCustomerAll = async (pageNumber, pageSize) => {
  return await prisma.custs.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize
    
  })
}

const deleteCustomer = async (id) => {
  console.log();
  return await prisma.custs.delete({
    where: {
      id: id
    }
  })
}

module.exports = { createCustomerRepo, getCustomer, getCustomerByIdRepo, getCustomerAll , getCountCustomer, deleteCustomer};
