const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const GetMediaTayang = async () => {
  const network = await prisma.network.findMany();
  const mitra = await prisma.mitra.findMany();
  const sosmed = await prisma.sosmed.findMany();
  const dataRest = {
    network,
    mitra,
    sosmed,
  };

  return dataRest;
};

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

const CreateNetworkRepo = async (name) => {
  return await prisma.network.create({
    data: {
      name,
    },
  });
};

const GetNetworkByIdRepo = async (id) => {
  return prisma.network.findUnique({
    where: {
      id
    }
  })
}

const CreateMitraRepo = async (name) => {
  return await prisma.mitra.create({
    data: {
      name,
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

const CreateSosmedRepo = async (name) => {
  return await prisma.sosmed.create({
    data: {
      name,
    },
  });
};

const GetSosmedByIdRepo = async (id) => {
  return prisma.sosmed.findUnique({
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
      OrderNetwork: true,
      OrderMitra: true,
      OrderArtikel: true,
      OrderSosmed: true,
      payCash: true,
      barter: true,
      semiBarter: true,
      kredit: true,
      termin: true,
      deposit: true
    }
  })
}

const getCountOrder = async () => {
  return await  prisma.order.count()
}

const GetOrderByIdRepo = async (id) => {
  return await prisma.order.findUnique({
    where: {
      id
    },
    include: {
      costumer: true,
      OrderNetwork: true,
      OrderMitra: true,
      OrderArtikel: true,
      OrderSosmed: true,
      payCash: true,
      barter: true,
      semiBarter: true,
      kredit: true,
      termin: true

    }
  })
}

module.exports = {
  GetMediaTayang,
  CreateOrderRepo,
  CreateNetworkRepo,
  CreateMitraRepo,
  CreateSosmedRepo,
  GetAllOrderRepo,
  GetNetworkByIdRepo,
  GetMitraByIdRepo,
  GetSosmedByIdRepo,
  GetOrderByIdRepo,
  getCountOrder
};
