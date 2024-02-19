const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const CreateOrderRepo = async (dataOrder) => {
  console.log('jalan');
  const order = await prisma.order.create({
    data: dataOrder,
  });

  return order;
 
};
const CreateProdukRepo = async (dataOrder) => {
 
  const order = await prisma.listProduk.createMany(dataOrder)

  return order;
 
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
    },
    include: {
      user: true,
      oti: true
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
      listProduk: true
    
    },
    orderBy: {
      created_At: "desc"
    }
  })
}

const GetAllOrderByUserRepo = async (id, pageNumber, pageSize) => {
  return await prisma.order.findMany({
    where: {
      id_user: id
    },
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
     listProduk: true
    },
    orderBy: {
      created_At: "desc"
    }
  })
}

const getCountOrder = async () => {
  return await  prisma.order.count()
}

const getCountByUserOrder = async (id) => {
  return await  prisma.order.count({
    where: {
      id_user: id
    }
  })
}

const editOrderRepo = async (id, data) => {
  return prisma.order.update({
    where: {
      id
    },
    data
  })
}

const getOrderByProdukRepo = async (produk, pageNumber, pageSize) =>{
  return prisma.order.findMany({
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
      listProduk: true
    },
    orderBy: {
      created_At: "desc"
    }
  })
}


module.exports = {
 
  CreateOrderRepo,
  CreateMitraRepo,
  GetAllOrderRepo,
  GetMitraByIdRepo,
  getCountOrder,
  GetOrderByIdRepo,
  editOrderRepo,
  GetAllOrderByUserRepo,
  getCountByUserOrder,
  getOrderByProdukRepo,
  CreateProdukRepo
 
};
