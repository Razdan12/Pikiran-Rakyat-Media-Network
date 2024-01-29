const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const CreateOrderRepo = async (dataOrder) => {
  try {
    const order = await prisma.order.create({
      data: dataOrder,
    });

    return order;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const CreateMitraRepo = async (name, status) => {
  return await prisma.mitra.create({
    data: {
      name,
      status
    },
  });
};

const GetMitraByIdRepo = async (id) => {
  return prisma.mitra.findUnique({
    where: {
      id
    }
  })
}

const GetOrderByIdRepo = async (id) => {
  return await prisma.order.findUnique({
    where: {
      id
    }
  })
}
const GetAllOrderRepo = async (pageNumber, pageSize) => {
  return await prisma.order.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    include: {
      costumer: true,
      OrderMitra: true,
      payCash: true,
      barter: true,
      semiBarter: true,
      kredit: true,
      termin: true,
      deposit: true,
      rate_article_cust : true,
      rate_sosmed_cust : true,
      rate_other_cust: true,
      rate_cpd_cust: true,
      rate_cpm_cust: true
    },
    orderBy: {
      created_At: "desc"
    }
  })
}

const getCountOrder = async () => {
  return await  prisma.order.count()
}


module.exports = {
 
  CreateOrderRepo,
  CreateMitraRepo,
  GetAllOrderRepo,
  GetMitraByIdRepo,
  getCountOrder,
  GetOrderByIdRepo
 
};
