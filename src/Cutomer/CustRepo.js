const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCustomerRepo = async (dataCust) => {
  return prisma.custs.create({
    data: dataCust,
  });
};

const getCustomer = async () => {
  return prisma.custs.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
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
    take: pageSize,
    orderBy: {
      createdAt: "desc"
    }
    
  })
}

const deleteCustomer = async (id) => {
  return await prisma.custs.update({
    where: {
      id: id
    },
    data:{
      is_deleted: true
    }
  })
}

const editCustomerRepo = async (id, data) => {
  return await prisma.custs.update({
    where: {id},
    data
  })
}

module.exports = { createCustomerRepo, getCustomer, getCustomerByIdRepo, getCustomerAll , getCountCustomer, deleteCustomer, editCustomerRepo};
