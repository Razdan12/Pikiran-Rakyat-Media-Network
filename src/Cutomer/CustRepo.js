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
  return prisma.custs.count({
    where: {
      is_deleted: false
    }
  })
}

const getCustomerAll = async (pageNumber, pageSize, filter) => {
  return await prisma.custs.findMany({
    where: {
      ...(filter && {  })
    },
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
