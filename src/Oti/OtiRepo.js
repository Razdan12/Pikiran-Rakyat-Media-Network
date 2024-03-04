const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOtiRepo = async (data) => {
  return await prisma.orderTayangIklan.create({
    data: data,
  });
};

const countOti = async () => {
  return await prisma.orderTayangIklan.count();
};
const getOtiById = async (id) => {
  return await prisma.orderTayangIklan.findUnique({
    where: {
      id,
    },
  });
};

const getOtiRepo = async (pageNumber, pageSize, date) => {
  return await prisma.orderTayangIklan.findMany({
    where: {
      orderDate: {
        gte: date.from,
        lt: date.to,
      },
    },
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    include: {
      order: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
const getOtiRepoByUser = async (id, pageNumber, pageSize, date) => {
 
  return await prisma.order.findMany({
    where: {
      id_user: id,
      order_date: {
        gte: date.from,
        lt: date.to,
      },
    },

    // skip: (pageNumber - 1) * pageSize,
    // take: pageSize,
    include: {
      oti: true,
      OrderMitra: true,
    },
    orderBy: {
      created_At: "desc",
    },
  });
};

const getOtiRepoByProduk = async ( pageNumber, pageSize, date) => {
  return await prisma.order.findMany({
    where: {
      order_date: {
        gte: date.from,
        lt: date.to,
      },
    },
    // skip: (pageNumber - 1) * pageSize,
    // take: pageSize,
    include: {
      oti: true,
      OrderMitra: true,
      listProduk: true
    },
    orderBy: {
      created_At: "desc",
    },
  });
};

const contAllOti = async () => {
  return await prisma.orderTayangIklan.count();
};

const editOtiRepo = async (id, data) => {
  return await prisma.orderTayangIklan.update({
    where: {
      id,
    },
    data,
  });
};
module.exports = {
  createOtiRepo,
  countOti,
  getOtiRepo,
  contAllOti,
  getOtiRepoByUser,
  getOtiById,
  getOtiRepoByProduk,

  editOtiRepo,
};
